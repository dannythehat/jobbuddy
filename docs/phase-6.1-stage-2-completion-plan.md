# Phase 6.1 Stage 2 - Frontend UI Completion Plan

## Current Status
- ✅ NaturalLanguageSearch component created (PR #7)
- ❌ Component NOT integrated into JobsPage
- ❌ Steps 2.2, 2.3, 2.4 incomplete

## Issues Found
1. NaturalLanguageSearch component exists but is not imported/used in JobsPage
2. No handler for natural language search results
3. Missing loading states and error handling for NL search
4. No visual feedback for parsed queries

## Implementation Steps

### Step 2.2: Integrate NL Search into JobsPage
**Changes needed in `frontend/src/pages/JobsPage.tsx`:**
1. Add import: `import NaturalLanguageSearch from '../components/NaturalLanguageSearch';`
2. Add state for NL search results
3. Create handler function `handleNaturalLanguageSearch`
4. Place component after page title, before tabs

### Step 2.3: Display Parsed Query Feedback
**Already implemented in NaturalLanguageSearch component:**
- Shows parsed keywords, location, remote status, salary
- Displays in gray box below search input

### Step 2.4: Show Search Results
**Changes needed:**
1. Update jobs state when NL search completes
2. Switch to "All Jobs" tab automatically
3. Show result count and query summary

## Code Changes Required

### JobsPage.tsx - Add Import (Line 1-42)
```typescript
import NaturalLanguageSearch from '../components/NaturalLanguageSearch';
```

### JobsPage.tsx - Add Handler (after line 220)
```typescript
const handleNaturalLanguageSearch = (query: string, data: any) => {
  if (data.jobs && data.jobs.length > 0) {
    setJobs(data.jobs);
    setActiveTab(1); // Switch to All Jobs tab
    setSuccess(`Found ${data.jobs.length} jobs matching: "${query}"`);
  } else {
    setError('No jobs found matching your search');
  }
};
```

### JobsPage.tsx - Add Component (after line 260, before Tabs)
```typescript
<NaturalLanguageSearch onSearch={handleNaturalLanguageSearch} />
```

## Testing Checklist
- [ ] Component renders on JobsPage
- [ ] Search executes and returns results
- [ ] Results display in jobs grid
- [ ] Parsed query shows feedback
- [ ] Error handling works
- [ ] Loading states display correctly
- [ ] Tab switches automatically on search

## Files to Modify
1. `frontend/src/pages/JobsPage.tsx` - Add import, handler, component placement
