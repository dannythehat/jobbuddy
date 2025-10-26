# Apply Phase 6.1 Stage 2 Integration - READY FOR MANUAL APPLICATION

## ⚠️ File Too Large for Automated Update
The `frontend/src/pages/JobsPage.tsx` file (22KB) exceeds GitHub API limits for automated updates.

## ✅ Solution: Manual Application Required

### Code Snippets Created in `/patches` folder:
1. **phase-6.1-stage-2-import.ts** - Import statement
2. **phase-6.1-stage-2-handler.ts** - Handler function  
3. **phase-6.1-stage-2-component.tsx** - Component JSX

### Quick Integration (3 Simple Edits to `frontend/src/pages/JobsPage.tsx`):

#### Edit 1: Add Import (Line 2)
After `import React, { useState, useEffect } from 'react';` add:
```typescript
import NaturalLanguageSearch from '../components/NaturalLanguageSearch';
```

#### Edit 2: Add Handler (After line 223)
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

#### Edit 3: Add Component (Before line 261)
Before `<Tabs value={activeTab}...>` add:
```typescript
<NaturalLanguageSearch onSearch={handleNaturalLanguageSearch} />
```

## Testing
Test with: **"Find remote React jobs in London"**

## Next Steps
Apply these changes locally in your development environment, then commit and push.
