import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';

const JobHistoryPage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom>
          Job History (Coming Soon)
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          This page is temporarily disabled while we finish some fixes.
        </Typography>
        <Button variant="contained" href="/">
          Go Home
        </Button>
      </Box>
    </Container>
  );
};

export default JobHistoryPage;
