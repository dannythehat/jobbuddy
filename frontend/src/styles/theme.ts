import { createTheme } from '@mui/material/styles';

// JobBuddi brand colors from the robot logo
export const jobBuddiTheme = createTheme({
  palette: {
    primary: {
      main: '#4A90E2', // Robot blue
      light: '#7BB3F0',
      dark: '#2E5A87',
    },
    secondary: {
      main: '#7ED321', // Accent green
      light: '#9FE045',
      dark: '#5BA016',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
  },
});

export default jobBuddiTheme;