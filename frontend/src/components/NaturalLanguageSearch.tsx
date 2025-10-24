import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { Search, Psychology } from '@mui/icons-material';

interface SearchIntent {
  jobTitle?: string;
  location?: string;
  salary?: { min?: number; max?: number };
  remote?: boolean;
  experience?: string;
  skills?: string[];
  company?: string;
  industry?: string;
}

interface NLSearchProps {
  onSearch: (intent: SearchIntent) => void;
}

export const NaturalLanguageSearch: React.FC<NLSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsedIntent, setParsedIntent] = useState<SearchIntent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/search/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          query,
          userId: localStorage.getItem('userId')
        })
      });

      if (!response.ok) {
        throw new Error('Failed to parse search query');
      }

      const data = await response.json();
      setParsedIntent(data.data.parsedIntent);
      onSearch(data.data.parsedIntent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Psychology color="primary" />
          AI-Powered Job Search
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Try: 'Find remote React developer jobs paying $80k+ at tech startups'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : <Search />}
            sx={{ minWidth: 120 }}
          >
            {loading ? 'Parsing...' : 'Search'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {parsedIntent && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              AI Understood:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {parsedIntent.jobTitle && (
                <Chip label={`Role: ${parsedIntent.jobTitle}`} color="primary" size="small" />
              )}
              {parsedIntent.location && (
                <Chip label={`Location: ${parsedIntent.location}`} color="secondary" size="small" />
              )}
              {parsedIntent.remote && (
                <Chip label="Remote" color="success" size="small" />
              )}
              {parsedIntent.salary && (
                <Chip 
                  label={`Salary: $${parsedIntent.salary.min || 0}k - $${parsedIntent.salary.max || '∞'}k`} 
                  color="info" 
                  size="small" 
                />
              )}
              {parsedIntent.experience && (
                <Chip label={`Experience: ${parsedIntent.experience}`} color="warning" size="small" />
              )}
              {parsedIntent.skills && parsedIntent.skills.length > 0 && (
                <Chip 
                  label={`Skills: ${parsedIntent.skills.join(', ')}`} 
                  color="default" 
                  size="small" 
                />
              )}
              {parsedIntent.company && (
                <Chip label={`Company: ${parsedIntent.company}`} color="primary" size="small" />
              )}
              {parsedIntent.industry && (
                <Chip label={`Industry: ${parsedIntent.industry}`} color="secondary" size="small" />
              )}
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};