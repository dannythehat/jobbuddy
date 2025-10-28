import React, { useState } from 'react';
import { Box, Button, List, ListItem, ListItemIcon, ListItemText, CircularProgress, Alert } from '@mui/material';
import { AutoAwesome, CheckCircle } from '@mui/icons-material';

interface JobSummaryProps {
  jobId: string;
}

const JobSummary: React.FC<JobSummaryProps> = ({ jobId }) => {
  const [summary, setSummary] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSummary = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/jobs/${jobId}/summarize`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const data = await response.json();
      
      if (data.status === 'success' && data.data.summary) {
        setSummary(data.data.summary);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      console.error('Summary error:', err);
      setError(err.message || 'Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Alert severity="error" onClose={() => setError(null)}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ my: 2 }}>
      {summary.length === 0 ? (
        <Button
          variant="outlined"
          size="small"
          startIcon={loading ? <CircularProgress size={16} /> : <AutoAwesome />}
          onClick={generateSummary}
          disabled={loading}
          sx={{ 
            textTransform: 'none',
            borderRadius: 2
          }}
        >
          {loading ? 'Generating...' : 'AI Summary'}
        </Button>
      ) : (
        <Box>
          <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1, p: 1 }}>
            {summary.map((point, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircle color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary={point}
                  primaryTypographyProps={{
                    variant: 'body2',
                    color: 'text.secondary'
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default JobSummary;
