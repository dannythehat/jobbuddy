import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography } from '@mui/material';
import { Search, AutoAwesome } from '@mui/icons-material';

interface NaturalLanguageSearchProps {
  onSearch: (results: any) => void;
}

const NaturalLanguageSearch: React.FC<NaturalLanguageSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <AutoAwesome sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">Natural Language Search</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Try: 'Senior React developer in New York'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button variant="contained" startIcon={<Search />}>
          Search
        </Button>
      </Box>
    </Paper>
  );
};

export default NaturalLanguageSearch;
