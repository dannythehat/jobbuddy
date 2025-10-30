import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import { Search, AutoAwesome } from '@mui/icons-material';

interface NaturalLanguageSearchProps {
  onSearch: (results: any) => void;
}

const NaturalLanguageSearch: React.FC<NaturalLanguageSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = () => {
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }
    setError(null);
    // Search logic will be added next
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <AutoAwesome sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">Natural Language Search</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Try: 'Senior React developer in New York'"
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
      {error && <Alert severity="error">{error}</Alert>}
    </Paper>
  );
};

export default NaturalLanguageSearch;
