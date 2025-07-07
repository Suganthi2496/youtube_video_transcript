import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TranscriptPage from './pages/TranscriptPage';
import ViewTranscriptsPage from './pages/ViewTranscriptsPage';
import AppBarHeader from './components/AppBarHeader';
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

const getPageTitle = (pathname) => {
  switch (pathname) {
    case '/':
      return 'Overview';
    case '/transcript':
      return 'YouTube Transcript';
    case '/view-transcripts':
      return 'Transcripts';
    case '/settings':
      return 'Settings';
    default:
      return '';
  }
};

const DashboardOverview = () => (
  <Box sx={{ p: 3 }}>
    <h2>Welcome to the YT Transcript Admin Dashboard</h2>
    {/* Add dashboard widgets here (stats, recent transcripts, etc.) */}
  </Box>
);

function App() {
  const location = useLocation();
  const title = getPageTitle(location.pathname);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', background: theme.palette.background.default }}>
        <AppBarHeader title={title} />
        <Sidebar />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            marginTop: '80px',
            minHeight: 'calc(100vh - 80px)',
            width: '100%'
          }}
        >
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/transcript" element={<TranscriptPage />} />
            <Route path="/view-transcripts" element={<ViewTranscriptsPage />} />
            <Route path="/settings" element={<div>Settings Page (Coming soon)</div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
