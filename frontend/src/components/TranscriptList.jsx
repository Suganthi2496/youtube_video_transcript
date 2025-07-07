import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Typography, 
  Box, 
  TextField, 
  Chip,
  Avatar,
  Button,
  Toolbar,
  InputAdornment,
  Menu,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { getTranscripts, deleteTranscript } from '../api';

const API_BASE = 'http://localhost:8000';

const getStatusColor = (status) => {
  switch (status) {
    case 'completed': return 'success';
    case 'processing': return 'warning';
    case 'failed': return 'error';
    default: return 'default';
  }
};

const TranscriptList = ({ onEdit, refreshTrigger }) => {
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [transcripts, setTranscripts] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getTranscripts();
      setTranscripts(data);
    } catch (err) {
      setError('Failed to load transcripts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [refreshTrigger]);

  const filtered = transcripts.filter(t =>
    t.youtube_url?.toLowerCase().includes(search.toLowerCase())
  );

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleDownload = (row) => {
    window.open(`${API_BASE}/transcripts/${row.id}/download`, '_blank');
    handleMenuClose();
  };

  const handleDelete = async (row) => {
    try {
      await deleteTranscript(row.id);
      fetchData();
    } catch (err) {
      setError('Failed to delete transcript.');
    }
    handleMenuClose();
  };

  if (loading) {
    return <Box sx={{ textAlign: 'center', py: 8 }}><CircularProgress /></Box>;
  }
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto', py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, width: '100%' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Transcripts
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            Manage and edit your YouTube video transcripts
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PlayCircleOutlineIcon />}
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5856eb 0%, #7c3aed 100%)',
            },
          }}
        >
          New Transcript
        </Button>
      </Box>

      {/* Search and Filter Toolbar */}
      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: 3, border: '1px solid #e5e7eb', width: '100%' }}>
        <Toolbar sx={{ px: 0, minHeight: 'auto', width: '100%' }}>
          <TextField
            placeholder="Search transcripts..."
            variant="outlined"
            size="small"
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ 
              minWidth: 300,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#6b7280' }} />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ ml: 'auto' }}>
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid #e5e7eb', width: '100%' }}>
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f9fafb' }}>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Video</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Listen</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Created</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((row) => (
              <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                      variant="rounded" 
                      sx={{ width: 48, height: 36, bgcolor: '#f3f4f6' }}
                    >
                      <PlayCircleOutlineIcon sx={{ color: '#6366f1' }} />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, mb: 0.5, cursor: 'pointer', color: '#1976d2' }}
                        component="a"
                        href={row.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {row.youtube_url}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  {row.audio_file ? (
                    <audio controls style={{ width: 120 }}>
                      <source src={`${API_BASE}/audio/${row.audio_file}`} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  ) : (
                    <Typography variant="caption" color="text.secondary">No audio</Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={row.status} 
                    color={getStatusColor(row.status)} 
                    size="small"
                    sx={{ 
                      textTransform: 'capitalize',
                      borderRadius: 1.5,
                      fontWeight: 500
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    {row.created_at ? new Date(row.created_at).toLocaleDateString() : ''}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      color="primary" 
                      onClick={() => onEdit(row)}
                      disabled={row.status !== 'completed'}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={(e) => handleMenuOpen(e, row)}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedRow?.id === row.id}
                    onClose={handleMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem onClick={() => handleDownload(row)}>
                      <DownloadIcon sx={{ mr: 1, fontSize: 20 }} />
                      Download
                    </MenuItem>
                    <MenuItem onClick={() => handleDelete(row)} sx={{ color: 'error.main' }}>
                      <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
                      Delete
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Empty State */}
      {filtered.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <PlayCircleOutlineIcon sx={{ fontSize: 64, color: '#d1d5db', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#6b7280', mb: 1 }}>
            No transcripts found
          </Typography>
          <Typography variant="body2" sx={{ color: '#9ca3af' }}>
            {search ? 'Try adjusting your search terms' : 'Create your first transcript to get started'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TranscriptList; 