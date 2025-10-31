import { createTheme } from '@mui/material/styles';

export const jobBuddiTheme = createTheme({
  palette: {
    primary: { main: '#4A90E2', light: '#7BB3F0', dark: '#2E5A87' },
    secondary: { main: '#7ED321', light: '#9FE045', dark: '#5BA016' },
    background: { default: '#F8F9FA', paper: '#FFFFFF' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { 
      fontWeight: 700,
      fontSize: '2rem',
      '@media (min-width:600px)': { fontSize: '2.5rem' },
      '@media (min-width:900px)': { fontSize: '3rem' },
    },
    h2: { 
      fontWeight: 600,
      fontSize: '1.75rem',
      '@media (min-width:600px)': { fontSize: '2rem' },
      '@media (min-width:900px)': { fontSize: '2.5rem' },
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      '@media (min-width:600px)': { fontSize: '1.75rem' },
      '@media (min-width:900px)': { fontSize: '2rem' },
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      '@media (min-width:600px)': { fontSize: '1.5rem' },
    },
    body1: {
      fontSize: '0.875rem',
      '@media (min-width:600px)': { fontSize: '1rem' },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: '44px', // Touch-friendly
          minWidth: '44px',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          minHeight: '44px', // Touch-friendly
          minWidth: '44px',
        },
      },
    },
  },
});

export default jobBuddiTheme;