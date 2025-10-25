# Natural Language Search API Testing

## Test Endpoints

### 1. Parse Query (No Search)
```bash
curl -X POST http://localhost:5000/api/nl/search/parse \
  -H "Content-Type: application/json" \
  -d '{"query": "Find remote React jobs in London"}'
```

### 2. Natural Language Search
```bash
curl -X POST http://localhost:5000/api/nl/search/natural \
  -H "Content-Type: application/json" \
  -d '{"query": "Senior Python developer positions paying over $80k"}'
```

### 3. Get Search Suggestions
```bash
curl http://localhost:5000/api/nl/search/suggestions
```

## Test Cases

### Basic Queries
- "React developer jobs"
- "Find remote positions"
- "Senior engineer roles"

### Location-Based
- "Jobs in London"
- "Remote React developer"
- "New York data analyst"

### Salary-Based
- "Jobs paying over $100k"
- "Positions with £50k+ salary"
- "High paying developer roles"

### Complex Queries
- "Find remote React jobs in London paying over £50k"
- "Senior Python developer at tech startups"
- "Part-time frontend developer internships"

## Expected Response Format

```json
{
  "status": "success",
  "data": {
    "jobs": [...],
    "parsedQuery": {
      "keywords": ["React", "developer"],
      "location": "London",
      "remote": true,
      "confidence": 0.9
    },
    "searchParams": {...},
    "validation": {
      "isValid": true,
      "suggestions": []
    },
    "totalResults": 5
  }
}
```

## Backend Testing Complete ✅
All three endpoints tested and working.