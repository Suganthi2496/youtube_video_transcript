import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress, 
  Alert, 
  Box, 
  Paper,
  Divider,
  Chip,
  Container,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { transcribe } from '../api';

const TranscriptForm = () => {
  const [url, setUrl] = useState('');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [transcript, setTranscript] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');
    setTranscript('');
    try {
      const res = await transcribe(url, language);
      setSuccess(true);
      setTranscript(res.transcript);
      setUrl('');
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to transcribe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', 
          color: 'white',
          borderRadius: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <YouTubeIcon sx={{ fontSize: 40 }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            YouTube Transcript Generator
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 600 }}>
          Transform any YouTube video into accurate text transcripts. Simply paste the video URL below and let our AI do the work.
        </Typography>
      </Paper>

      {/* Main Form Card */}
      <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e5e7eb', mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <CloudUploadIcon sx={{ color: '#6366f1', fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Add YouTube Video
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 3 }} />

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                YouTube Video URL
              </Typography>
              <TextField
                placeholder="https://www.youtube.com/watch?v=..."
                variant="outlined"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#6366f1',
                    },
                  },
                }}
              />
              <Typography variant="caption" sx={{ color: '#6b7280', mt: 1, display: 'block' }}>
                Supported formats: YouTube video URLs (youtube.com or youtu.be)
              </Typography>
            </Box>

            <Box>
              <FormControl fullWidth>
                <InputLabel id="language-select-label">Language</InputLabel>
                <Select
                  labelId="language-select-label"
                  id="language-select"
                  value={language}
                  label="Language"
                  onChange={(e) => setLanguage(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="ta-IN">Tamil</MenuItem>
                  <MenuItem value="te-IN">Telugu</MenuItem>
                  <MenuItem value="kn-IN">Kannada</MenuItem>
                  <MenuItem value="hi-IN">Hindi</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <YouTubeIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5856eb 0%, #7c3aed 100%)',
                  },
                }}
              >
                {loading ? 'Processing...' : 'Generate Transcript'}
              </Button>
              
              {success && (
                <Chip 
                  icon={<CheckCircleIcon />} 
                  label="Success! Transcript generated" 
                  color="success" 
                  variant="outlined"
                />
              )}
            </Box>

            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ borderRadius: 2 }}>
                <Typography variant="body2">
                  🎉 Transcript generated successfully! You can view and edit it in the 
                  <strong> Transcripts</strong> section.
                </Typography>
                {transcript && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">Preview:</Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line', maxHeight: 200, overflow: 'auto', background: '#f4f5fa', p: 2, borderRadius: 2 }}>
                      {transcript}
                    </Typography>
                  </Box>
                )}
              </Alert>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Card elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e5e7eb' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            ⚡ Fast Processing
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            Our AI-powered transcription typically completes within 2-5 minutes depending on video length.
          </Typography>
        </Card>
        
        <Card elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e5e7eb' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            ✏️ Editable Results
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            Review and manually edit transcripts for perfect accuracy before exporting or sharing.
          </Typography>
        </Card>
      </Box>
    </Container>
  );
};

export default TranscriptForm; 