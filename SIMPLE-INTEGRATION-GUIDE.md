# 🎯 Phase 6.1 - Manual Integration Guide

## Quick Start (3 Simple Edits)

### File to Edit
`frontend/src/pages/JobsPage.tsx`

---

## ✏️ Edit 1: Add Import (Line 2)

**Find this** (Line 1):
```typescript
import React, { useState, useEffect } from 'react';
```

**Add this line right after it**:
```typescript
import NaturalLanguageSearch from '../components/NaturalLanguageSearch';
```

**Result**:
```typescript
import React, { useState, useEffect } from 'react';
import NaturalLanguageSearch from '../components/NaturalLanguageSearch';
import {
  Container,
  // ... rest of imports
```

---

## ✏️ Edit 2: Add Handler Function (After line ~223)

**Find this function** (around line 217-223):
```typescript
  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setJobTypeFilter('');
    setSalaryMinFilter('');
    fetchAllJobs();
  };
```

**Add this function right after it**:
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

---

## ✏️ Edit 3: Add Component (Before line ~263)

**Find this code** (around line 263):
```typescript
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab 
            label="Matched Jobs" 
            icon={<TrendingUp />} 
            iconPosition="start"
          />
```

**Add this line right before the `<Tabs>` element**:
```typescript
        <NaturalLanguageSearch onSearch={handleNaturalLanguageSearch} />

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
```

---

## 🧪 Testing

1. **Start the app**:
   ```bash
   cd frontend
   npm start
   ```

2. **Test queries**:
   - "Find remote React jobs in London"
   - "Senior Python developer positions"
   - "Data science jobs paying over $100k"

3. **Expected behavior**:
   - ✅ Natural language search bar appears above tabs
   - ✅ Search executes and switches to "All Jobs" tab
   - ✅ Results populate with success message
   - ✅ Parsed query feedback displays

---

## 📦 Alternative: Use Automated Script

```bash
chmod +x scripts/apply-phase-6.1.sh
./scripts/apply-phase-6.1.sh
```

---

## 🔄 Rollback if Needed

The script creates automatic backups:
```bash
cp frontend/src/pages/JobsPage.tsx.backup-* frontend/src/pages/JobsPage.tsx
```

---

## 📝 Summary

- **3 simple edits** to one file
- **No breaking changes**
- **Fully tested** backend and component
- **Ready to merge** after testing

---

## 🎉 After Integration

1. Test thoroughly
2. Commit changes
3. Create PR to main
4. Close issue #8
5. Mark Phase 6.1 complete!
