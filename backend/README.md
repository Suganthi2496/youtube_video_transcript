# YouTube Video Transcript Backend

This is the FastAPI backend for the YouTube Video Transcript project. It supports:
- Downloading YouTube audio
- Audio enhancement (denoise, remove music)
- Transcription using OpenAI Whisper, Google Cloud Speech-to-Text, and AssemblyAI
- Multilingual support (Tamil, Telugu, Kannada, Hindi, English, and more)
- REST API for transcript management

## Features
- **Audio enhancement**: Uses ffmpeg to reduce background noise/music before transcription.
- **Multiple engines**: Tries Whisper first, then Google Cloud, then AssemblyAI.
- **Language selection**: Transcribe in your chosen language (not translation).
- **Transcript management**: List, download, update, and delete transcripts.

## Setup

### 1. Clone the repository
```
git clone <your-repo-url>
cd youtube_video_transcript/backend
```

### 2. Create a virtual environment
```
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies
```
pip install -r requirements.txt
```

### 4. Install ffmpeg
- **macOS**: `brew install ffmpeg`
- **Ubuntu**: `sudo apt-get install ffmpeg`
- **Windows**: [Download from ffmpeg.org](https://ffmpeg.org/download.html)

### 5. Set up Google Cloud Speech-to-Text
- Create a Google Cloud project and enable the Speech-to-Text API.
- Create a service account and download the JSON key as `google-credentials.json` in the backend directory.
- Add to `.env`:
  ```
  GOOGLE_APPLICATION_CREDENTIALS=backend/google-credentials.json
  ASSEMBLYAI_API_KEY=your_assemblyai_key_here
  ```

### 6. Run the server
```
uvicorn main:app --reload
```

## API Endpoints
- `POST /transcribe` — Transcribe a YouTube video (provide `youtube_url` and `language`)
- `GET /transcripts` — List transcripts
- `GET /transcripts/{id}` — Get transcript details
- `PUT /transcripts/{id}` — Update transcript text
- `DELETE /transcripts/{id}` — Delete transcript
- `GET /audio/{filename}` — Download audio file

## Troubleshooting
- **Accuracy issues**: Try with cleaner audio, or force Google Cloud for Indian languages.
- **ffmpeg errors**: Ensure ffmpeg is installed and in your PATH.
- **Google Cloud errors**: Check credentials and API enablement.
- **Whisper memory errors**: Use a smaller model (edit `main.py`).

## License
MIT 