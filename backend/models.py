from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Transcript(Base):
    __tablename__ = 'transcripts'
    id = Column(Integer, primary_key=True, index=True)
    youtube_url = Column(String, nullable=False)
    transcript_text = Column(Text, nullable=True)
    status = Column(String, default='completed')
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) 