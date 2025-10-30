import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Search, AutoAwesome } from '@mui/icons-material';

interface ParsedQuery {
  jobTitle?: string;
  location?: string;
  jobType?: string;
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  company?: string;
}

interface NLSearchResult {
  jobs: any[];
  parsedQuery: ParsedQuery;
  totalResults: number;
}

interface NaturalLanguageSearchProps {
  onSearch: (results: NLSearchResult) => void;
}

const NaturalLanguageSearch: React.FC<NaturalLanguageSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedQuery, setParsedQuery] = useState<ParsedQuery | null>(null);

  const examples = [
    'Senior React developer in New York with 5+ years experience',
    'Remote Python jobs paying over $100k',
    'Entry level data analyst positions in San Francisco',
    'Full-time DevOps engineer roles at tech startups',
  ];

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/jobs/search/natural', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      
      if (data.status === 'error') {
        setError(data.message || 'Search failed');
        return;
      }

      if (data.status === 'success') {
        setParsedQuery(data.data.parsedQuery);
        onSearch(data.data);
      }
    } catch (error) {
      setError('Search failed. Please try again.');
      console.error('NL Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    setError(null);
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <AutoAwesome sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">
          Natural Language Search
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Try: 'Senior React developer in New York with 5+ years experience'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          disabled={loading}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : <Search />}
        >
          Search
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {parsedQuery && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Understood:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {parsedQuery.jobTitle && (
              <Chip label={`Title: ${parsedQuery.jobTitle}`} size="small" color="primary" />
            )}
            {parsedQuery.location && (
              <Chip label={`Location: ${parsedQuery.location}`} size="small" color="primary" />
            )}
            {parsedQuery.jobType && (
              <Chip label={`Type: ${parsedQuery.jobType}`} size="small" color="primary" />
            )}
            {parsedQuery.experienceLevel && (
              <Chip label={`Level: ${parsedQuery.experienceLevel}`} size="small" color="primary" />
            )}
            {parsedQuery.salaryMin && (
              <Chip label={`Min: $${parsedQuery.salaryMin}k`} size="small" color="primary" />
            )}
            {parsedQuery.salaryMax && (
              <Chip label={`Max: $${parsedQuery.salaryMax}k`} size="small" color="primary" />
            )}
            {parsedQuery.skills && parsedQuery.skills.length > 0 && (
              <Chip label={`Skills: ${parsedQuery.skills.join(', ')}`} size="small" color="primary" />
            )}
            {parsedQuery.company && (
              <Chip label={`Company: ${parsedQuery.company}`} size="small" color="primary" />
            )}
          </Box>
        </Box>
      )}

      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
          Try these examples:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
          {examples.map((example, index) => (
            <Chip
              key={index}
              label={example}
              size="small"
              onClick={() => handleExampleClick(example)}
              sx={{ cursor: 'pointer' }}
              variant="outlined"
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default NaturalLanguageSearch;
