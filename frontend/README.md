# YouTube Video Transcript Frontend

This is the React frontend for the YouTube Video Transcript project. It provides:
- Admin dashboard for managing YouTube video transcripts
- Transcript form with language selection
- Transcript list, audio player, download, and delete actions
- Modern UI (Mira Pro style, Material UI)

## Features
- **Paste YouTube URL** and select language to generate transcript
- **List, edit, download, and delete** transcripts
- **Audio player** for listening to extracted audio
- **Responsive, modern dashboard UI**

## Setup

### 1. Install dependencies
```
cd frontend
npm install
```

### 2. Configure API endpoint
- By default, the frontend expects the backend at `http://localhost:8000` (see `src/api.js`).
- If your backend runs elsewhere, update `API_BASE` in `src/api.js`.

### 3. Run the development server
```
npm run dev
```
- The app will be available at [http://localhost:5173](http://localhost:5173)

## Usage
- Go to the dashboard, paste a YouTube URL, select a language, and generate a transcript.
- Manage transcripts from the "Transcripts" page.

## Troubleshooting
- **CORS errors**: Make sure the backend allows requests from the frontend origin.
- **API errors**: Check backend is running and API_BASE is correct.

## License
MIT
