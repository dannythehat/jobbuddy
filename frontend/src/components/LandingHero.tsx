import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import RobotAvatar from '../components/RobotAvatar';

const LandingHero: React.FC = () => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 8,
        background: 'linear-gradient(135deg, #4A90E2 0%, #7ED321 100%)',
        borderRadius: 4,
        color: 'white',
        mb: 8,
      }}
    >
      <Container maxWidth="md">
        <RobotAvatar size={120} />
        
        <Typography variant="h2" component="h1" gutterBottom fontWeight="bold" sx={{ mt: 3 }}>
          JobBuddi
        </Typography>
        
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4, opacity: 0.9 }}>
          Your AI-Powered Career Assistant 🤖
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto', opacity: 0.8 }}>
          Complete job application automation from CV parsing to interview scheduling. 
          Let your AI buddy handle the work while you focus on landing your dream job.
        </Typography>
        
        <Button
          component={RouterLink}
          to="/register"
          variant="contained"
          size="large"
          sx={{
            bgcolor: 'white',
            color: 'primary.main',
            '&:hover': { bgcolor: 'grey.100' },
            px: 4,
            py: 1.5,
            fontWeight: 'bold',
            mr: 2,
          }}
        >
          Start Free Trial 🚀
        </Button>
        
        <Button
          component={RouterLink}
          to="/login"
          variant="outlined"
          size="large"
          sx={{
            borderColor: 'white',
            color: 'white',
            '&:hover': { borderColor: 'grey.300', bgcolor: 'rgba(255,255,255,0.1)' },
            px: 4,
            py: 1.5,
          }}
        >
          Sign In
        </Button>
      </Container>
    </Box>
  );
};

export default LandingHero;