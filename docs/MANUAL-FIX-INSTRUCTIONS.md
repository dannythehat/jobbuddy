# MANUAL FIX INSTRUCTIONS - Phase 6.1 Stage 2

## File to Edit: `frontend/src/pages/JobsPage.tsx`

### ✅ FIX #1: Add Import (Line 2)

**Location:** After `import React, { useState, useEffect } from 'react';`

**Add this line:**
```typescript
import NaturalLanguageSearch from '../components/NaturalLanguageSearch';
```

**Result should look like:**
```typescript
import React, { useState, useEffect } from 'react';
import NaturalLanguageSearch from '../components/NaturalLanguageSearch';
import {
  Container,
  Typography,
  ...
```

---

### ✅ FIX #2: Add Handler Function (After line 217)

**Location:** After the `clearFilters` function, before the `return` statement

**Find this code:**
```typescript
  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setJobTypeFilter('');
    setSalaryMinFilter('');
    fetchAllJobs();
  };

  return (
```

**Add this function between them:**
```typescript
  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setJobTypeFilter('');
    setSalaryMinFilter('');
    fetchAllJobs();
  };

  const handleNaturalLanguageSearch = (query: string, data: any) => {
    if (data.jobs && data.jobs.length > 0) {
      setJobs(data.jobs);
      setActiveTab(1); // Switch to All Jobs tab
      setSuccess(`Found ${data.jobs.length} jobs matching: "${query}"`);
    } else {
      setError('No jobs found matching your search');
    }
  };

  return (
```

---

### ✅ FIX #3: Add Component (After line 259)

**Location:** After the "Create Sample Jobs" button, before the `<Tabs>` component

**Find this code:**
```typescript
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

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
```

**Add the component between them:**
```typescript
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

        <NaturalLanguageSearch onSearch={handleNaturalLanguageSearch} />

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
```

---

## ✅ Verification Checklist

After making changes:
- [ ] File compiles without errors
- [ ] Import is at line 2
- [ ] Handler function is before `return` statement
- [ ] Component is between buttons and Tabs
- [ ] No syntax errors

## 🧪 Testing

1. Start dev server: `cd frontend && npm start`
2. Navigate to Jobs page
3. Enter search: "Find remote React jobs in London"
4. Verify:
   - Search executes
   - Results appear
   - Tab switches to "All Jobs"
   - Success message shows

## 📝 Commit Message

```
Complete Phase 6.1 Stage 2: Integrate NL search into JobsPage

- Add NaturalLanguageSearch import
- Add handleNaturalLanguageSearch handler
- Place component before Tabs
- Closes #8
```
