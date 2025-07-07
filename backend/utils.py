import os
from dotenv import load_dotenv
import yt_dlp as youtube_dl

load_dotenv(override=True)

ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")
GOOGLE_APPLICATION_CREDENTIALS = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if GOOGLE_APPLICATION_CREDENTIALS:
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = GOOGLE_APPLICATION_CREDENTIALS

def download_youtube_audio(youtube_url, output_path):
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': output_path,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'quiet': True,
    }
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.download([youtube_url]) 