import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const JobsPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Job Opportunities
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse and manage job opportunities matched to your preferences.
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Coming Soon
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Job browsing and matching features will be available in the next update.
        </Typography>
      </Paper>
    </Container>
  );
};

export default JobsPage;