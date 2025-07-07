import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Typography, 
  Box, 
  IconButton, 
  Chip,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { getTranscript, updateTranscript } from '../api';

const TranscriptEditorDialog = ({ open, transcript, onSave, onClose }) => {
  const [text, setText] = useState(transcript?.transcript_text || '');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [current, setCurrent] = useState(transcript);

  useEffect(() => {
    if (open && transcript?.id) {
      setFetching(true);
      setError('');
      getTranscript(transcript.id)
        .then((data) => {
          setCurrent(data);
          setText(data.transcript_text || '');
        })
        .catch(() => setError('Failed to load transcript.'))
        .finally(() => setFetching(false));
    }
  }, [open, transcript]);

  useEffect(() => {
    setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length);
  }, [text]);

  const handleSave = async () => {
    if (!current?.id) return;
    setLoading(true);
    setError('');
    try {
      await updateTranscript(current.id, text);
      onSave({ ...current, transcript_text: text });
    } catch (err) {
      setError('Failed to update transcript.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle sx={{ p: 3, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <EditIcon sx={{ color: '#6366f1', fontSize: 28 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                Edit Transcript
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                {current?.title || current?.youtube_url || 'Untitled Video'}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ p: 3 }}>
        {fetching ? (
          <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
        <>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <PlayCircleOutlineIcon sx={{ color: '#6366f1' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Video Information
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Chip 
              label={`Words: ${wordCount}`} 
              variant="outlined" 
              size="small" 
            />
            <Chip 
              label={`Status: ${current?.status || 'Unknown'}`} 
              color={current?.status === 'completed' ? 'success' : 'warning'}
              size="small" 
            />
          </Box>
          <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>
            {current?.youtube_url}
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
            Transcript Text
          </Typography>
          <TextField
            multiline
            minRows={12}
            maxRows={20}
            fullWidth
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Enter transcript text here..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: '#e5e7eb',
                },
                '&:hover fieldset': {
                  borderColor: '#6366f1',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#6366f1',
                },
              },
              '& .MuiInputBase-input': {
                fontSize: '14px',
                lineHeight: 1.6,
              },
            }}
          />
          <Typography variant="caption" sx={{ color: '#6b7280', mt: 1, display: 'block' }}>
            💡 Tip: Review the transcript for accuracy and make any necessary corrections before saving.
          </Typography>
        </Box>
        </>
        )}
      </DialogContent>
      
      <Divider />
      
      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ 
            borderRadius: 2,
            borderColor: '#d1d5db',
            color: '#6b7280',
            '&:hover': {
              borderColor: '#9ca3af',
              backgroundColor: '#f9fafb',
            },
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          startIcon={<SaveIcon />}
          disabled={loading || fetching}
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5856eb 0%, #7c3aed 100%)',
            },
          }}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TranscriptEditorDialog; 