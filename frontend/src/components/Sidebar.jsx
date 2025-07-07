import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Box, Divider, Avatar } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 260;

const navGroups = [
  {
    title: 'Dashboards',
    items: [
      { text: 'Overview', icon: <HomeIcon />, path: '/' },
      { text: 'YouTube Transcript', icon: <YouTubeIcon />, path: '/transcript' },
      { text: 'Transcripts', icon: <ListAltIcon />, path: '/view-transcripts' },
    ],
  },
  {
    title: 'General',
    items: [
      { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    ],
  },
];

const Sidebar = () => {
  const location = useLocation();
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: (theme) => theme.palette.background.sidebar,
          color: '#fff',
          borderRight: 'none',
        },
      }}
    >
      <Toolbar sx={{ minHeight: 80 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#6366f1' }}>YT</Avatar>
          <Box>
            <Typography variant="h6" noWrap>YT Transcript</Typography>
            <Typography variant="body2" sx={{ color: '#b0b3c7' }}>Workspace</Typography>
          </Box>
        </Box>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
      {navGroups.map((group) => (
        <Box key={group.title} sx={{ mt: 2 }}>
          <Typography variant="caption" sx={{ pl: 3, color: '#b0b3c7', textTransform: 'uppercase', letterSpacing: 1 }}>
            {group.title}
          </Typography>
          <List>
            {group.items.map((item) => (
              <ListItem
                button
                key={item.text}
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  borderLeft: location.pathname === item.path ? '4px solid #6366f1' : '4px solid transparent',
                  background: location.pathname === item.path ? 'rgba(99,102,241,0.08)' : 'transparent',
                  color: '#fff',
                  '&:hover': {
                    background: 'rgba(99,102,241,0.12)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#fff', minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </Drawer>
  );
};

export default Sidebar; 