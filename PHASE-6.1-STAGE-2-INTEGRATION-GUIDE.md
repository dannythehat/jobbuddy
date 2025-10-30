# Phase 6.1 Stage 2: Natural Language Search Integration Guide

**Status:** Ready for manual integration  
**File to modify:** `frontend/src/pages/JobsPage.tsx`  
**Component:** `NaturalLanguageSearch.tsx` (already exists)

---

## 📋 Overview

This guide walks you through integrating the Natural Language Search component into JobsPage. The component is already built and tested - you just need to wire it up!

**What you'll add:**
1. Import statement for the component
2. Handler function to process search results
3. Component placement in the UI

**Time required:** ~5 minutes

---

## 🔧 Step-by-Step Integration

### Step 1: Add Import Statement

**Location:** Line 2 (after the React import)

**Current code (Line 1-2):**
```typescript
import React, { useState, useEffect } from 'react';
import {
```

**Add this line between them:**
```typescript
import React, { useState, useEffect } from 'react';
import NaturalLanguageSearch from '../components/NaturalLanguageSearch';  // ← ADD THIS
import {
```

---

### Step 2: Add Handler Function

**Location:** After the `clearFilters` function (around line 223)

**Find this section:**
```typescript
const clearFilters = () => {
  setFilters({
    status: '',
    company: '',
    location: '',
    minSalary: '',
    maxSalary: '',
    dateFrom: '',
    dateTo: '',
  });
  setSearchTerm('');
};
```

**Add this function right after it:**
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

---

### Step 3: Add Component to UI

**Location:** Before the Tabs component (around line 261)

**Find this section:**
```typescript
<Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
```

**Add the component RIGHT BEFORE the Tabs:**
```typescript
{/* Natural Language Search */}
<NaturalLanguageSearch onSearch={handleNaturalLanguageSearch} />

{/* Existing Tabs */}
<Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
```

---

## ✅ Verification

After making these changes:

1. **Save the file**
2. **Restart your dev server** (if running)
3. **Navigate to the Jobs page**
4. **Test with:** "Find remote React jobs in London"

**Expected result:**
- Search bar appears at the top of the Jobs page
- Typing triggers suggestions
- Submitting search shows matching jobs
- Success message displays with result count

---

## 🎯 What This Does

**The NaturalLanguageSearch component:**
- Accepts plain English queries (e.g., "remote React jobs")
- Sends query to backend API (`/api/jobs/natural-language-search`)
- Backend uses OpenAI to parse the query
- Returns filtered jobs matching the criteria
- Updates the jobs list with results

**The handler function:**
- Receives search results from the component
- Updates the jobs state with filtered results
- Switches to "All Jobs" tab to show results
- Displays success/error messages

---

## 📁 Reference Files

**Component location:**
- `frontend/src/components/NaturalLanguageSearch.tsx`

**Patch files (for reference):**
- `patches/phase-6.1-stage-2-import.ts`
- `patches/phase-6.1-stage-2-handler.ts`
- `patches/phase-6.1-stage-2-component.tsx`

---

## 🐛 Troubleshooting

**Import error?**
- Check the path: `../components/NaturalLanguageSearch`
- Ensure the component file exists

**Handler not working?**
- Verify function is inside the JobsPage component
- Check that `setJobs`, `setActiveTab`, `setSuccess`, `setError` are available

**Component not showing?**
- Check placement is before `<Tabs>` component
- Verify no syntax errors in previous code

---

## 📝 Commit Message

After successful integration:
```
[Phase 6.1 Stage 2] Integrate Natural Language Search into JobsPage

- Add NaturalLanguageSearch component import
- Add handleNaturalLanguageSearch handler function
- Place component above Tabs in UI
- Enable plain English job search functionality
```

---

## 🎉 Next Steps

After integration is complete:
1. Test thoroughly with various queries
2. Commit and push changes
3. Update CONTEXT.md to mark Phase 6.1 Stage 2 as complete
4. Consider Phase 6.2 (Global job board integration)

---

**Questions?** Check the component code in `frontend/src/components/NaturalLanguageSearch.tsx` for implementation details.
