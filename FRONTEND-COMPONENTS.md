# Frontend Components

**Part of:** GCP-MERGE.md
**Purpose:** New React components needed

---

## New Pages to Create

### 1. JobBoardsPage
**Location:** `frontend/src/pages/JobBoardsPage.tsx`

**Features:**
- List all available job boards
- Filter by country/region
- Show connection status
- Connect/disconnect buttons
- Connection statistics

### 2. SavedJobsPage
**Location:** `frontend/src/pages/SavedJobsPage.tsx`

**Features:**
- Display all saved jobs
- Filter and search
- Quick apply from saved
- Remove from saved
- Organize into folders

### 3. ApplicationHistoryPage (enhance existing)
**Location:** `frontend/src/pages/ApplicationHistoryPage.tsx`

**Add:**
- Timeline view of all status changes
- Email correspondence display
- Interview scheduling from page
- Notes and attachments
- Export application data

---

## New Components to Create

### 1. JobBoardCard
**Location:** `frontend/src/components/JobBoards/JobBoardCard.tsx`

**Props:**
- jobBoard (board data)
- isConnected (boolean)
- onConnect (callback)
- onDisconnect (callback)

**Displays:**
- Board logo
- Board name and country
- Connection status
- Connect button
- Premium badge if paid

### 2. ConnectBoardDialog
**Location:** `frontend/src/components/JobBoards/ConnectBoardDialog.tsx`

**Features:**
- OAuth flow initiation
- Credential input form
- API key input
- Connection testing
- Success/error messages

### 3. DailyScanWidget
**Location:** `frontend/src/components/Dashboard/DailyScanWidget.tsx`

**Displays:**
- Last scan time
- Jobs found today
- New matches count
- Trigger manual scan button
- Scan history link

### 4. JobSourceBadge
**Location:** `frontend/src/components/Jobs/JobSourceBadge.tsx`

**Props:**
- source (board name)
- isPremium (boolean)

**Displays:**
- Small badge showing job source
- Premium indicator
- Board logo icon

### 5. OneClickApplyButton
**Location:** `frontend/src/components/Jobs/OneClickApplyButton.tsx`

**Features:**
- Single click to apply
- Shows cover letter preview
- Edit before submit option
- Loading state
- Success confirmation

### 6. ApplicationTimeline
**Location:** `frontend/src/components/Applications/ApplicationTimeline.tsx`

**Displays:**
- Vertical timeline
- All status changes with dates
- Email responses
- Interview events
- User notes
- Expandable details

### 7. EmailResponseCard
**Location:** `frontend/src/components/Applications/EmailResponseCard.tsx`

**Displays:**
- Email subject and sender
- Classification (interview/rejection/offer)
- Sentiment indicator
- Email preview
- Quick reply button
- Full email view

### 8. SaveJobButton
**Location:** `frontend/src/components/Jobs/SaveJobButton.tsx`

**Features:**
- Heart icon toggle
- Save/unsave job
- Add to folder option
- Saved count display

---

## Components to Enhance

### JobCard (already exists)
**Add:**
- Source badge
- Save button
- One-click apply
- Premium indicator

### ApplicationCard (already exists)
**Add:**
- Timeline preview
- Latest response display
- Quick actions menu
- Status history

### Dashboard (already exists)
**Add:**
- Daily scan widget
- Saved jobs widget
- Application stats
- Board connections widget

---

Next file will have detailed implementation steps...
