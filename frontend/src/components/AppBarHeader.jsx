import React from 'react';
import { AppBar, Toolbar, Typography, Avatar, Box, IconButton, InputBase, Badge } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LanguageIcon from '@mui/icons-material/Language';

const AppBarHeader = ({ title }) => (
  <AppBar
    position="fixed"
    elevation={0}
    sx={{
      zIndex: (theme) => theme.zIndex.drawer + 1,
      background: '#fff',
      color: '#181c32',
      boxShadow: '0 1px 0 0 #e5e7eb',
    }}
  >
    <Toolbar sx={{ minHeight: 80, display: 'flex', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>{title}</Typography>
        <Box sx={{ ml: 3, background: '#f4f5fa', borderRadius: 2, px: 2, py: 0.5, display: 'flex', alignItems: 'center' }}>
          <SearchIcon sx={{ color: '#6366f1', mr: 1 }} />
          <InputBase placeholder="Search…" sx={{ fontSize: 16 }} />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton color="inherit">
          <Badge variant="dot" color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton color="inherit">
          <LanguageIcon />
        </IconButton>
        <Avatar alt="Admin" src="" sx={{ ml: 1, bgcolor: '#6366f1' }}>A</Avatar>
      </Box>
    </Toolbar>
  </AppBar>
);

export default AppBarHeader; 