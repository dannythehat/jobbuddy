# Phase 6.1 - Step 2.2 Integration Guide

## Changes to JobsPage.tsx

### 1. Add Import
```typescript
import NaturalLanguageSearch from '../components/NaturalLanguageSearch';
```

### 2. Add State
```typescript
const [nlSearchActive, setNlSearchActive] = useState(false);
```

### 3. Add Handler
```typescript
const handleNaturalLanguageSearch = (query: string, results: any) => {
  setJobs(results.jobs);
  setNlSearchActive(true);
  setSuccess(`Found ${results.totalResults} jobs matching: "${query}"`);
};
```

### 4. Add Component (after Tabs, before Filters)
```typescript
{activeTab === 1 && (
  <NaturalLanguageSearch onSearch={handleNaturalLanguageSearch} />
)}
```

## Small incremental change - just adds the component to the page