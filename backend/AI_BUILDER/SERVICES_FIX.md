# Services Fix (Align to Models)

Remove references to missing fields (e.g., skillsRequired). Use only fields that exist:
Job: id,title,company,location,(salaryMin?),(salaryMax?),(description?)
Application: id,userId,jobId,cvId,status,notes,(statusHistory[]),(communications[]),(followUpDates[]),(submissionDate?),(responseDate?),(interviewDate?)
CV: id,userId,filename,isDefault

Files to review: src/services/applicationGenerator.ts, interviewScheduler.ts, jobBoardSyncService.ts, jobMatcher.ts, jobBoard/*
Goals: compile cleanly; guard nulls for cv/job; no `any` added.