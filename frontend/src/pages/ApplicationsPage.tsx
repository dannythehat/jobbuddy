import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const ApplicationsPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          My Applications
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage all your job applications in one place.
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Coming Soon
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Application tracking and management features will be available in the next update.
        </Typography>
      </Paper>
    </Container>
  );
};

export default ApplicationsPage;