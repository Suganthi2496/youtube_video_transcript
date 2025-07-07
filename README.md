# YouTube Video Transcript Project

A full-stack solution for extracting, enhancing, and transcribing YouTube video audio into text, supporting multiple languages (Tamil, Telugu, Kannada, Hindi, English, and more).

## Features
- **Paste YouTube URL** and select language to generate a transcript
- **Audio enhancement**: Removes background noise/music before transcription
- **Multi-engine transcription**: OpenAI Whisper, Google Cloud Speech-to-Text, AssemblyAI
- **Admin dashboard**: List, edit, download, and delete transcripts
- **Audio player**: Listen to extracted audio
- **Modern UI**: Responsive, professional dashboard (React + Material UI)

## Architecture
- **Frontend**: React (Vite, Material UI)
- **Backend**: FastAPI (Python)
- **Audio Processing**: ffmpeg
- **Transcription Engines**: Whisper (local), Google Cloud STT, AssemblyAI
- **Database**: SQLite (via SQLAlchemy)

## Setup

### 1. Clone the repository
```
git clone <your-repo-url>
cd youtube_video_transcript
```

### 2. Backend Setup
See [backend/README.md](backend/README.md) for full details.
- Create and activate a Python virtual environment
- Install dependencies: `pip install -r backend/requirements.txt`
- Install ffmpeg
- Set up Google Cloud credentials and `.env`
- Run: `uvicorn backend/main:app --reload`

### 3. Frontend Setup
See [frontend/README.md](frontend/README.md) for full details.
- `cd frontend`
- Install dependencies: `npm install`
- Run: `npm run dev`
- App runs at [http://localhost:5173](http://localhost:5173)

## Usage
1. Open the frontend in your browser.
2. Paste a YouTube video URL, select a language, and generate a transcript.
3. Manage transcripts from the dashboard: listen, edit, download, or delete.

## Troubleshooting
- **Accuracy issues**: Try with cleaner audio, or force Google Cloud for Indian languages.
- **ffmpeg errors**: Ensure ffmpeg is installed and in your PATH.
- **Google Cloud errors**: Check credentials and API enablement.
- **CORS/API errors**: Ensure backend allows frontend origin and API_BASE is correct.
- **Whisper memory errors**: Use a smaller model (edit backend `main.py`).

## License
MIT 