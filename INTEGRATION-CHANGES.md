# Phase 6.1 Stage 2 - Integration Changes for JobsPage.tsx

## Change 1: Add Import (Line 2)

After the React import, add:
```typescript
import NaturalLanguageSearch from '../components/NaturalLanguageSearch';
```

## Change 2: Add Handler Function (After line 223 - after clearFilters function)

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

## Change 3: Add Component (Before Tabs component - around line 261)

Before the line `<Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>`, add:

```typescript
{/* Natural Language Search */}
<NaturalLanguageSearch onSearch={handleNaturalLanguageSearch} />
```

## Implementation Status

- [ ] Import added
- [ ] Handler function added  
- [ ] Component placed in UI
- [ ] Tested with sample queries
