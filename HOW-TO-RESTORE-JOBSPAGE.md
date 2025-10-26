# How to Restore JobsPage.tsx to Original (Clean) Version

## The Easy Way (GitHub Web Interface)

Since you're on mobile and can't run bash scripts, here's how to restore the file using GitHub's web interface:

### Step 1: Go to the File History
1. Go to: https://github.com/dannythehat/jobbuddy/commits/main/frontend/src/pages/JobsPage.tsx
2. Find the commit: **"Implement comprehensive jobs page with matching and browsing"**
3. Commit SHA: `6de047d`
4. Date: Oct 22, 2025

### Step 2: View the Clean Version
1. Click on that commit
2. Click "View file" button
3. You'll see the clean 652-line version

### Step 3: Copy the Clean Content
1. Click the "Raw" button
2. Select all and copy the entire content

### Step 4: Replace Current File
1. Go to: https://github.com/dannythehat/jobbuddy/edit/main/frontend/src/pages/JobsPage.tsx
2. Delete ALL current content (select all, delete)
3. Paste the clean content you copied
4. Commit with message: "Restore JobsPage.tsx to clean version before manual edits"

## Direct Links

**View clean version (commit 6de047d):**
https://github.com/dannythehat/jobbuddy/blob/6de047d30848b6024a4bf18cb6ea489b4833180b/frontend/src/pages/JobsPage.tsx

**Raw clean version (for copying):**
https://raw.githubusercontent.com/dannythehat/jobbuddy/6de047d30848b6024a4bf18cb6ea489b4833180b/frontend/src/pages/JobsPage.tsx

**Edit current file:**
https://github.com/dannythehat/jobbuddy/edit/main/frontend/src/pages/JobsPage.tsx

## What This Does
- Removes the corrupted 1222-line version
- Restores the original clean 652-line version
- Gets you back to a working state
- Ready for proper NaturalLanguageSearch integration later (on desktop)

## After Restoration
The file will be back to its original working state. You can then:
1. Test that the app works normally
2. Wait until you have desktop access
3. Properly integrate NaturalLanguageSearch component with a code editor

---

**Current file**: 1222 lines (corrupted)  
**Target file**: 652 lines (clean, working)  
**Commit to restore from**: `6de047d`
