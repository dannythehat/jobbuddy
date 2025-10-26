# Phase 6.1 Frontend - Natural Language Search UI

## 🎯 Goal
Add natural language search to JobsPage

---

## Step 1: Create NL Search Component (30 min)

**New File**: `frontend/src/components/NaturalLanguageSearchBar.tsx`

**What to build**:
- Text input for natural language queries
- Search button
- Example queries display
- Loading state

**Example queries to show**:
- "Find remote React jobs in London"
- "Senior Python developer roles"
- "Part-time marketing jobs near me"

---

## Step 2: Add API Service (15 min)

**File**: `frontend/src/services/jobService.ts`

Add function:
```typescript
export const searchJobsNaturalLanguage = async (query: string) => {
  const response = await fetch('/api/nl/search/natural', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  return response.json();
};
```

---

## Step 3: Integrate into JobsPage (20 min)

**File**: `frontend/src/pages/JobsPage.tsx`

- Import NaturalLanguageSearchBar
- Add above existing search
- Handle search results
- Show parsed query feedback

---

## Step 4: Test (10 min)

Test queries:
1. "Remote React jobs"
2. "Senior developer London £60k+"
3. "Part-time marketing"

---

Total Time: ~75 minutes