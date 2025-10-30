# API Smoke Tests
Assume http://localhost:3000

- GET /api/applications (authed) → 200 JSON
- GET /api/applications/:id (authed) → has job/cv if server includes
- GET /api/responses/:id (authed) → has application with job/cv if includes
- GET /api/interviews/:id (authed) → has application with job/cv if includes