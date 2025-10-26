# MANUAL APPLICATION INSTRUCTIONS
# Phase 6.1 Stage 2 Integration

## File to Edit: `frontend/src/pages/JobsPage.tsx`

### EDIT 1: Add Import (Line 2)
**Location:** After `import React, { useState, useEffect } from 'react';`
**Action:** Add this line:
```typescript
import NaturalLanguageSearch from '../components/NaturalLanguageSearch';
```

### EDIT 2: Add Handler Function (After line ~223)
**Location:** After the `clearFilters` function (around line 223)
**Action:** Add this function:
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

### EDIT 3: Add Component (Before line ~261)
**Location:** Before `<Tabs value={activeTab}...>` (around line 261)
**Action:** Add this component:
```typescript
<NaturalLanguageSearch onSearch={handleNaturalLanguageSearch} />
```

## Testing
After applying changes, test with: **"Find remote React jobs in London"**

## File is too large for automated update
Due to GitHub API limits, these changes must be applied manually or through your local development environment.
