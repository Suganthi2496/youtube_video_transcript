import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366f1', // Mira Pro purple
    },
    secondary: {
      main: '#06d6a0', // Accent green
    },
    background: {
      default: '#f4f5fa',
      paper: '#fff',
      sidebar: '#181c32',
    },
    text: {
      primary: '#181c32',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0px 2px 8px rgba(99, 102, 241, 0.08)',
    ...Array(23).fill('0px 2px 8px rgba(99, 102, 241, 0.08)')
  ],
  components: {
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 2px 8px rgba(99, 102, 241, 0.08)',
        },
      },
    },
  },
});

export default theme; 