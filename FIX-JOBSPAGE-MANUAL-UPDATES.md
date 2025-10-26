# Fix Instructions for JobsPage.tsx

## Fix 1: Separate the imports on Line 1
**Current Line 1:**
```typescript
import NaturalLanguageSearch from '../components/NaturalLanguageSearch';import React, { useState, useEffect } from 'react';
```

**Replace with (two separate lines):**
```typescript
import React, { useState, useEffect } from 'react';
import NaturalLanguageSearch from '../components/NaturalLanguageSearch';
```

## Fix 2: Move NaturalLanguageSearch component (around line 263)
**Find this section (WRONG placement inside Button):**
```typescript
          >
            Refresh
        <NaturalLanguageSearch onSearch={handleNaturalLanguageSearch} />
            
          </Button>
```

**Replace with (remove from inside Button):**
```typescript
          >
            Refresh
          </Button>
```

**Then find this section (around line 272):**
```typescript
        </Box>

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
```

**Replace with (add component between Box and Tabs):**
```typescript
        </Box>

        <NaturalLanguageSearch onSearch={handleNaturalLanguageSearch} />

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
```

## Summary
- Line 1: Split into two separate import lines
- Line 263: Remove `<NaturalLanguageSearch />` from inside the Button
- Line 273: Add `<NaturalLanguageSearch />` between `</Box>` and `<Tabs>`
