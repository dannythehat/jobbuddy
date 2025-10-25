import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Search, AutoAwesome } from '@mui/icons-material';

interface NaturalLanguageSearchProps {
  onSearch: (query: string, results: any) => void;
}

const NaturalLanguageSearch: React.FC<NaturalLanguageSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsedQuery, setParsedQuery] = useState<any>(null);

  const examples = [
    'Find remote React jobs in London',
    'Senior Python developer positions',
    'Data science jobs paying over $100k',
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/nl/search/natural', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setParsedQuery(data.data.parsedQuery);
        onSearch(query, data.data);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
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
          placeholder="Try: Find remote React jobs in London..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Typography variant="caption" sx={{ mr: 1, alignSelf: 'center' }}>
          Try:
        </Typography>
        {examples.map((example, index) => (
          <Chip
            key={index}
            label={example}
            size="small"
            onClick={() => handleExampleClick(example)}
            sx={{ cursor: 'pointer' }}
          />
        ))}
      </Box>

      {parsedQuery && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Understood: {parsedQuery.keywords?.join(', ')}
            {parsedQuery.location && ` in ${parsedQuery.location}`}
            {parsedQuery.remote && ' (Remote)'}
            {parsedQuery.salary?.min && ` • $${parsedQuery.salary.min}+`}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default NaturalLanguageSearch;