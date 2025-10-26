# Apply Phase 6.1 Stage 2 Integration

## Quick Integration (3 Simple Edits)

Edit `frontend/src/pages/JobsPage.tsx`:

### Edit 1: Add Import (Line 2)
After `import React, { useState, useEffect } from 'react';` add:
```
import NaturalLanguageSearch from '../components/NaturalLanguageSearch';
```

### Edit 2: Add Handler (After line 223)
After the `clearFilters` function, add:
```typescript
const handleNaturalLanguageSearch = (query: string, data: any) => {
  if (data.jobs && data.jobs.length > 0) {
    setJobs(data.jobs);
    setActiveTab(1);
    setSuccess(`Found ${data.jobs.length} jobs matching: "${query}"`);
  } else {
    setError('No jobs found matching your search');
  }
};
```

### Edit 3: Add Component (Before line 261)
Before `<Tabs value={activeTab}...>` add:
```typescript
<NaturalLanguageSearch onSearch={handleNaturalLanguageSearch} />
```

## Done!
Test with: "Find remote React jobs in London"
