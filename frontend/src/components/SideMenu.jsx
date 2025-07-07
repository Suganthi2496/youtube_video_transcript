import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ListAltIcon from '@mui/icons-material/ListAlt';

const drawerWidth = 220;

const navItems = [
  { text: 'Transcript', icon: <MenuBookIcon />, path: '/transcript' },
  { text: 'View Transcripts', icon: <ListAltIcon />, path: '/view-transcripts' },
];

const SideMenu = () => {
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
          background: '#212b36',
          color: '#fff',
        },
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MenuBookIcon fontSize="large" />
          <Typography variant="h6" noWrap>YT Transcript Admin</Typography>
        </Box>
      </Toolbar>
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                background: '#1976d2',
                color: '#fff',
              },
              '&:hover': {
                background: '#1976d2',
                color: '#fff',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default SideMenu; 