# Phase 6.1 Changes to Apply

## File: `frontend/src/pages/JobsPage.tsx`

### Change 1: Add Import (Line 2)
**After line 1** (`import React, { useState, useEffect } from 'react';`), add:
```typescript
import NaturalLanguageSearch from '../components/NaturalLanguageSearch';
```

### Change 2: Add Handler Function (After line 223)
**After the `clearFilters` function** (around line 223), add:
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

### Change 3: Add Component (Before line 263)
**Before the Tabs component** (around line 263), add:
```typescript
        <NaturalLanguageSearch onSearch={handleNaturalLanguageSearch} />
```

## Exact Line Numbers

Based on current file structure:
- **Line 2**: Add import after React import
- **Line 224**: Add handler function after `clearFilters()`
- **Line 264**: Add component before `<Tabs>` element

## Testing After Changes

```bash
cd frontend
npm start
```

Test queries:
1. "Find remote React jobs in London"
2. "Senior Python developer positions"
3. "Data science jobs paying over $100k"

Expected behavior:
- Natural language search bar appears above tabs
- Search executes and switches to "All Jobs" tab
- Results populate with success message
