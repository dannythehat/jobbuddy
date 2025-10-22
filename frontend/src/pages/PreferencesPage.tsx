import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const PreferencesPage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Job Preferences
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Set your job search preferences to help us find the perfect matches.
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Coming Soon
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Job preference configuration will be available in the next update.
        </Typography>
      </Paper>
    </Container>
  );
};

export default PreferencesPage;