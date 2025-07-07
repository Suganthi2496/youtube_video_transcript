import axios from 'axios';

const API_BASE = 'http://localhost:8000';

export const transcribe = async (youtube_url, language = 'en') => {
  const res = await axios.post(`${API_BASE}/transcribe`, { youtube_url, language });
  return res.data;
};

export const getTranscripts = async () => {
  const res = await axios.get(`${API_BASE}/transcripts`);
  return res.data;
};

export const getTranscript = async (id) => {
  const res = await axios.get(`${API_BASE}/transcripts/${id}`);
  return res.data;
};

export const updateTranscript = async (id, transcript_text) => {
  const res = await axios.put(`${API_BASE}/transcripts/${id}`, { transcript_text });
  return res.data;
};

export const deleteTranscript = async (id) => {
  await axios.delete(`${API_BASE}/transcripts/${id}`);
}; 