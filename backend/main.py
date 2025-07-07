from fastapi import FastAPI, HTTPException, Depends, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
import uuid
import assemblyai as aai
from utils import download_youtube_audio, ASSEMBLYAI_API_KEY
from sqlalchemy.orm import Session
from database import SessionLocal, init_db
from models import Transcript
from datetime import datetime
import whisper
from google.cloud import speech
import subprocess

AUDIO_DIR = 'audio_files'
os.makedirs(AUDIO_DIR, exist_ok=True)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

aai.settings.api_key = ASSEMBLYAI_API_KEY

class TranscribeRequest(BaseModel):
    youtube_url: str
    language: str = 'en'  # Default to English if not provided

class TranscriptUpdateRequest(BaseModel):
    transcript_text: str

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
def read_root():
    return {"status": "ok"}

@app.post("/transcribe")
def transcribe(request: TranscribeRequest, db: Session = Depends(get_db)):
    audio_filename_base = f"audio_{uuid.uuid4().hex}"
    audio_path = os.path.join(AUDIO_DIR, audio_filename_base + ".mp3")
    enhanced_audio_path = os.path.join(AUDIO_DIR, audio_filename_base + "_enhanced.mp3")
    try:
        download_youtube_audio(request.youtube_url, os.path.join(AUDIO_DIR, audio_filename_base))
        audio_filename = audio_path
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to download audio: {e}")
    if not os.path.exists(audio_filename):
        raise HTTPException(status_code=500, detail=f"Audio file not found: {audio_filename}")
    file_size = os.path.getsize(audio_filename)
    if file_size == 0:
        raise HTTPException(status_code=500, detail=f"Audio file is empty: {audio_filename}")
    # Enhance audio: remove background noise/music using ffmpeg (simple lowpass/highpass filter)
    try:
        # You can tune these filters for better results
        # Remove frequencies below 100Hz (rumble) and above 4000Hz (music)
        ffmpeg_cmd = [
            "ffmpeg", "-y", "-i", audio_filename,
            "-af", "highpass=f=100, lowpass=f=4000, afftdn=nf=-25",  # afftdn for denoise
            enhanced_audio_path
        ]
        subprocess.run(ffmpeg_cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        audio_to_transcribe = enhanced_audio_path
    except Exception as e:
        print(f"Audio enhancement failed: {e}. Using original audio.")
        audio_to_transcribe = audio_filename
    transcript_text = None
    error_messages = []
    # Normalize language code for Whisper and Google
    lang_map = {
        'tamil': 'ta', 'ta': 'ta', 'ta-in': 'ta',
        'telugu': 'te', 'te': 'te', 'te-in': 'te',
        'kannada': 'kn', 'kn': 'kn', 'kn-in': 'kn',
        'hindi': 'hi', 'hi': 'hi', 'hi-in': 'hi',
        'english': 'en', 'en': 'en', 'en-us': 'en', 'en_in': 'en',
    }
    google_lang_map = {
        'ta': 'ta-IN', 'te': 'te-IN', 'kn': 'kn-IN', 'hi': 'hi-IN', 'en': 'en-US'
    }
    req_lang = request.language.lower().replace('_', '-').strip()
    print(f"Request language: {req_lang}")
    whisper_lang = lang_map.get(req_lang, 'en')
    google_lang = google_lang_map.get(whisper_lang, 'en-US')
    print(f"Using Whisper language: {whisper_lang}")
    print(f"Using Google Cloud Speech-to-Text language: {google_lang}")
    # Force Google Cloud for Tamil
    # if whisper_lang == "ta":
    #     try:
    #         client = speech.SpeechClient()
    #         with open(audio_to_transcribe, "rb") as audio_file:
    #             content = audio_file.read()
    #         audio = speech.RecognitionAudio(content=content)
    #         config = speech.RecognitionConfig(
    #             encoding=speech.RecognitionConfig.AudioEncoding.MP3,
    #             language_code=google_lang,
    #             enable_automatic_punctuation=True,
    #         )
    #         response = client.recognize(config=config, audio=audio)
    #         transcript_text = " ".join([result.alternatives[0].transcript for result in response.results])
    #         print(f"Transcription succeeded with Google Cloud Speech-to-Text (lang={google_lang}).")
    #     except Exception as e:
    #         error_messages.append(f"Google Cloud error: {e}")
    #         print("Google Cloud error:", e)
    # else:
    # 1. Try Whisper
    try:
        whisper_model = "large"
        try:
            model = whisper.load_model(whisper_model)
        except Exception:
            whisper_model = "large"
            model = whisper.load_model(whisper_model)
        result = model.transcribe(audio_to_transcribe, language=whisper_lang)
        transcript_text = result["text"]
        print(f"transcript_text from whisper: {transcript_text}")
        print(f"Transcription succeeded with Whisper (model={whisper_model}, lang={whisper_lang}).")
    except Exception as e:
        error_messages.append(f"Whisper error: {e}")
        print("Whisper error:", e)
    # 2. Try Google Cloud Speech-to-Text if Whisper failed
    if not transcript_text:
        try:
            client = speech.SpeechClient()
            with open(audio_to_transcribe, "rb") as audio_file:
                content = audio_file.read()
            audio = speech.RecognitionAudio(content=content)
            config = speech.RecognitionConfig(
                encoding=speech.RecognitionConfig.AudioEncoding.MP3,
                language_code=google_lang,
                enable_automatic_punctuation=True,
            )
            response = client.recognize(config=config, audio=audio)
            print(response)
            transcript_text = " ".join([result.alternatives[0].transcript for result in response.results])
            print(f"transcript_text from google cloud: {transcript_text}")
            print(f"Transcription succeeded with Google Cloud Speech-to-Text (lang={google_lang}).")
        except Exception as e:
            error_messages.append(f"Google Cloud error: {e}")
            print("Google Cloud error:", e)
    # 3. Try AssemblyAI if both failed
    if not transcript_text:
        try:
            transcriber = aai.Transcriber()
            transcript = transcriber.transcribe(audio_to_transcribe)
            transcript_text = transcript.text
            print("Transcription succeeded with AssemblyAI.")
        except Exception as e:
            error_messages.append(f"AssemblyAI error: {e}")
            print("AssemblyAI error:", e)
    if not transcript_text:
        if os.path.exists(audio_filename):
            os.remove(audio_filename)
        if os.path.exists(enhanced_audio_path):
            os.remove(enhanced_audio_path)
        raise HTTPException(status_code=500, detail=f"Transcription failed: {' | '.join(error_messages)}")
    db_transcript = Transcript(
        youtube_url=request.youtube_url,
        transcript_text=transcript_text,
        status='completed',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(db_transcript)
    db.commit()
    db.refresh(db_transcript)
    return {"id": db_transcript.id, "transcript": db_transcript.transcript_text, "audio_file": os.path.basename(audio_filename)}

@app.get("/audio/{filename}")
def get_audio(filename: str):
    file_path = os.path.join(AUDIO_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Audio file not found")
    return FileResponse(file_path, media_type="audio/mpeg", filename=filename)

@app.get("/transcripts/{transcript_id}/download")
def download_transcript(transcript_id: int, db: Session = Depends(get_db)):
    t = db.query(Transcript).filter(Transcript.id == transcript_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Transcript not found")
    content = t.transcript_text or ""
    return Response(content, media_type="text/plain", headers={"Content-Disposition": f"attachment; filename=transcript_{transcript_id}.txt"})

@app.get("/transcripts")
def list_transcripts(db: Session = Depends(get_db)):
    transcripts = db.query(Transcript).all()
    return [
        {
            "id": t.id,
            "youtube_url": t.youtube_url,
            "transcript_text": t.transcript_text,
            "status": t.status,
            "created_at": t.created_at,
            "updated_at": t.updated_at,
            "audio_file": f"audio_{t.id}.mp3" if os.path.exists(os.path.join(AUDIO_DIR, f"audio_{t.id}.mp3")) else None
        } for t in transcripts
    ]

@app.get("/transcripts/{transcript_id}")
def get_transcript(transcript_id: int, db: Session = Depends(get_db)):
    t = db.query(Transcript).filter(Transcript.id == transcript_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Transcript not found")
    return {
        "id": t.id,
        "youtube_url": t.youtube_url,
        "transcript_text": t.transcript_text,
        "status": t.status,
        "created_at": t.created_at,
        "updated_at": t.updated_at,
        "audio_file": f"audio_{t.id}.mp3" if os.path.exists(os.path.join(AUDIO_DIR, f"audio_{t.id}.mp3")) else None
    }

@app.put("/transcripts/{transcript_id}")
def update_transcript(transcript_id: int, req: TranscriptUpdateRequest, db: Session = Depends(get_db)):
    t = db.query(Transcript).filter(Transcript.id == transcript_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Transcript not found")
    t.transcript_text = req.transcript_text
    t.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(t)
    return {
        "id": t.id,
        "youtube_url": t.youtube_url,
        "transcript_text": t.transcript_text,
        "status": t.status,
        "created_at": t.created_at,
        "updated_at": t.updated_at,
        "audio_file": f"audio_{t.id}.mp3" if os.path.exists(os.path.join(AUDIO_DIR, f"audio_{t.id}.mp3")) else None
    }

@app.delete("/transcripts/{transcript_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transcript(transcript_id: int, db: Session = Depends(get_db)):
    t = db.query(Transcript).filter(Transcript.id == transcript_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Transcript not found")
    db.delete(t)
    db.commit()
    # Optionally, delete the audio file
    audio_file = os.path.join(AUDIO_DIR, f"audio_{transcript_id}.mp3")
    if os.path.exists(audio_file):
        os.remove(audio_file)
    return Response(status_code=status.HTTP_204_NO_CONTENT) 