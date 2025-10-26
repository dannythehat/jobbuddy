# Phase 6.1 Stage 2 - JobsPage Integration Instructions

## Changes Required

### 1. Add Import (Line 2)
After `import React, { useState, useEffect } from 'react';`, add:

```typescript
import NaturalLanguageSearch from '../components/NaturalLanguageSearch';
```

### 2. Add Handler Function (After line 223, after `clearFilters` function)
Add this new function:

```typescript
const handleNaturalLanguageSearch = (query: string, data: any) => {
  if (data.jobs && data.jobs.length > 0) {
    setJobs(data.jobs);
    setActiveTab(1); // Switch to "All Jobs" tab
    setSuccess(`Found ${data.jobs.length} jobs matching: "${query}"`);
  } else {
    setError('No jobs found matching your search');
  }
};
```

### 3. Add Component (After line 261, before the Tabs component)
Add the NaturalLanguageSearch component:

```typescript
{/* Natural Language Search */}
<NaturalLanguageSearch onSearch={handleNaturalLanguageSearch} />
```

## Complete Integration Code

Here's what the integration section should look like:

```typescript
// ... existing code ...

const clearFilters = () => {
  setSearchTerm('');
  setLocationFilter('');
  setJobTypeFilter('');
  setSalaryMinFilter('');
  fetchAllJobs();
};

// NEW: Natural Language Search Handler
const handleNaturalLanguageSearch = (query: string, data: any) => {
  if (data.jobs && data.jobs.length > 0) {
    setJobs(data.jobs);
    setActiveTab(1); // Switch to "All Jobs" tab
    setSuccess(`Found ${data.jobs.length} jobs matching: "${query}"`);
  } else {
    setError('No jobs found matching your search');
  }
};

return (
  <Container maxWidth="lg">
    <Box sx={{ mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Job Opportunities
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Discover jobs that match your skills and preferences.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => activeTab === 0 ? fetchMatchedJobs() : fetchAllJobs()}
        >
          Refresh
        </Button>
        <Button
          variant="outlined"
          onClick={createSampleJobs}
        >
          Create Sample Jobs
        </Button>
      </Box>

      {/* NEW: Natural Language Search Component */}
      <NaturalLanguageSearch onSearch={handleNaturalLanguageSearch} />

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab 
          label="Matched Jobs" 
          icon={<TrendingUp />} 
          iconPosition="start"
        />
        <Tab 
          label="All Jobs" 
          icon={<Work />} 
          iconPosition="start"
        />
      </Tabs>
    </Box>
    
    {/* ... rest of the component ... */}
```

## Testing

After making these changes, test with these queries:
1. "Find remote React jobs in London"
2. "Senior Python developer positions"
3. "Data science jobs paying over $100k"

The search should:
- Parse the natural language query
- Display the parsed query feedback
- Show matching jobs in the "All Jobs" tab
- Display a success message with the count
