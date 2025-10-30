# 🤖 AI Workflow - Standard Operating Procedures

**📍 Share this with any AI:** `https://github.com/dannythehat/jobbuddy/blob/main/AI-WORKFLOW.md`

---

## 🎯 Core Principles

### 1. **Always Work in Number Order**
- Follow task lists sequentially (1 → 2 → 3)
- Complete each step fully before moving to next
- Never skip ahead or work out of order

### 2. **Always Document What Has Been Done**
- Update status files after each completed task
- Mark items as ✅ when complete
- Add timestamps and commit references
- Update CONTEXT.md with progress

### 3. **Always Apply Changes in Small Batches**
- **GitHub file size limit:** Cannot update large files in single batch
- Break large updates into small, incremental changes
- Update one section at a time
- Use multiple commits for large changes
- Test each batch before proceeding

### 4. **Document Everything**
- This file exists so Danny doesn't need to repeat instructions
- Reference this workflow in every session
- Update this file if workflow improves

---

## 📋 Standard Task Execution Flow

### Step 1: Check Current Status
```bash
1. Read CONTEXT.md for overall project state
2. Read PROJECT-STATUS.md for current priorities
3. Identify the next numbered task
```

### Step 2: Execute Task
```bash
1. Work on ONE task at a time
2. Make small, incremental changes
3. Commit after each logical unit of work
4. Verify changes were applied correctly
```

### Step 3: Document Completion
```bash
1. Mark task as ✅ in relevant status file
2. Add completion timestamp
3. Update CONTEXT.md if needed
4. Note any blockers or issues encountered
```

### Step 4: Move to Next Task
```bash
1. Identify next numbered task
2. Repeat process
```

---

## 🚨 Critical Constraints

### GitHub File Updates
- ⚠️ **Cannot update large files in single batch**
- ✅ Update one section at a time
- ✅ Use multiple commits for large files
- ✅ Keep each change focused and small

### Task Management
- ⚠️ **Never skip tasks in numbered lists**
- ✅ Complete in order: 1 → 2 → 3
- ✅ Mark each as complete before moving on
- ✅ Document blockers if task cannot be completed

---

## 📝 Documentation Standards

### When Completing Tasks
```markdown
- ✅ Task description (Completed: Oct 30, 2025 - Commit: abc123)
```

### When Encountering Blockers
```markdown
- ⏸️ Task description (Blocked: Reason - Oct 30, 2025)
```

### When Starting New Work
```markdown
- 🔄 Task description (In Progress: Oct 30, 2025)
```

---

## 🔄 File Update Strategy

### For Small Files (<100 lines)
- Update entire file in one commit

### For Medium Files (100-500 lines)
- Update in 2-3 batches
- Group related sections together

### For Large Files (>500 lines)
- Update one section at a time
- Commit after each section
- Verify each update before proceeding

---

## 📊 Progress Tracking

### Always Update These Files
1. **CONTEXT.md** - Overall project status
2. **PROJECT-STATUS.md** - Current priorities and progress
3. **Task-specific files** - Mark items complete

### Commit Message Format
```
[Task #X] Brief description of what was done

- Specific change 1
- Specific change 2
```

---

## 🎯 Example Workflow

```
Danny: "Continue with the cleanup tasks"

AI Response:
1. ✅ Check CONTEXT.md - Current priority: Run cleanup script
2. 🔄 Execute task #4: Run cleanup script
3. ✅ Document completion in PROJECT-STATUS.md
4. ✅ Update CONTEXT.md progress percentage
5. 🔄 Move to task #5: Update README.md
```

---

## 🚀 Quick Reference

**Before Starting Any Work:**
- [ ] Read CONTEXT.md
- [ ] Read PROJECT-STATUS.md
- [ ] Identify next numbered task

**During Work:**
- [ ] Work in small batches
- [ ] Commit frequently
- [ ] Verify each change

**After Completing Task:**
- [ ] Mark as ✅ in status files
- [ ] Add timestamp and commit reference
- [ ] Update CONTEXT.md if needed
- [ ] Move to next numbered task

---

## 📅 Last Updated

**Date:** October 30, 2025  
**Purpose:** Establish standard workflow to avoid repeating instructions

---

**🤖 AI Instructions:**
1. Read this file at the start of every session
2. Follow these procedures for all work
3. Reference this file when Danny asks to "continue" or "proceed"
4. Update this file if workflow improvements are identified
