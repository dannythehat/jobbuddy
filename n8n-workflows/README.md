# n8n Workflows

This directory contains workflow templates for n8n integration with JobBuddy.

## Overview

n8n is used in JobBuddy to automate various processes including:
- CV parsing and skill extraction
- Job scraping from multiple sources
- Application generation and submission
- Response monitoring and classification
- Interview preparation

## Workflow Templates

### CV Processing
- `cv-parser.json` - Extract structured data from uploaded CVs
- `skill-extractor.json` - Use AI to identify skills from CV content

### Job Search
- `job-scraper-linkedin.json` - Scrape job listings from LinkedIn
- `job-scraper-indeed.json` - Scrape job listings from Indeed
- `job-matcher.json` - Match jobs to user preferences

### Application Automation
- `cover-letter-generator.json` - Generate personalized cover letters
- `company-research.json` - Gather information about target companies
- `application-packager.json` - Prepare complete application packages
- `application-submitter.json` - Submit applications to job portals

### Response Handling
- `email-monitor.json` - Monitor for responses to applications
- `response-classifier.json` - Classify responses (rejection, interview, etc.)
- `notification-sender.json` - Send notifications to users

### Interview Preparation
- `interview-scheduler.json` - Manage interview scheduling
- `question-generator.json` - Generate practice interview questions
- `company-research-deep.json` - Detailed company research for interviews

## Installation

1. Import these workflow templates into your n8n instance
2. Configure the credentials for each node as needed
3. Activate the workflows

## Credentials Required

- Email (SMTP/IMAP)
- OpenAI API
- Web scraping services
- Job portal APIs (if available)

## Usage

Each workflow is designed to be triggered either:
- Via webhook from the JobBuddy backend
- On a schedule
- Manually by an administrator

## Development

When creating new workflows:
1. Export your workflow as JSON
2. Add it to this directory
3. Document its purpose and configuration in this README