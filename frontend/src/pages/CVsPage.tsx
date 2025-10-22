import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const CVsPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          My CVs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload and manage your CVs for automated job applications.
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Coming Soon
        </Typography>
        <Typography variant="body1" color="text.secondary">
          CV upload and management features will be available in the next update.
        </Typography>
      </Paper>
    </Container>
  );
};

export default CVsPage;