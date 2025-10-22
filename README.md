# JobBuddy: Automated Job Application System

An intelligent job application automation platform that streamlines the entire job search process from CV management to interview preparation.

## Overview

JobBuddy helps job seekers automate and optimize their job application process through:

- CV processing and skill extraction
- Personalized job matching based on preferences
- Automated application generation and submission
- Response tracking and interview preparation
- Continuous learning and optimization

## Technology Stack

- **Frontend**: React with TypeScript, Material UI
- **Backend**: Node.js/Express, TypeScript
- **Database**: PostgreSQL with Sequelize ORM
- **Automation**: n8n workflows
- **AI Integration**: OpenAI for content generation and analysis

## Current Status

🚧 **Phase 1: Foundation** - In Progress

### Completed:
- ✅ GitHub repository setup
- ✅ Project structure configuration
- ✅ CI/CD pipeline with GitHub Actions
- ✅ Basic frontend components (Layout, Header, Footer)
- ✅ Authentication context and protected routes
- ✅ Backend Express server with security middleware
- ✅ Database models (User, CV, JobPreference, Job, Application)
- ✅ Authentication API endpoints

### In Progress:
- 🔄 Frontend pages implementation
- 🔄 CV upload and management
- 🔄 n8n integration

## Development Roadmap

### Phase 1: Foundation (Week 1-2)
- Project setup and repository configuration
- Basic frontend and backend implementation
- Authentication system
- n8n integration

### Phase 2: Core Functionality (Week 3-4)
- CV processing system
- Job preference collection
- Job search integration
- Application generator

### Phase 3: Smart Features (Week 5-6)
- Submission system
- Response monitoring
- Learning system
- Intelligence features

### Phase 4: Advanced Features (Week 7-8)
- Interview preparation
- Analytics dashboard
- Self-improvement system
- Admin tools

### Phase 5: Polishing & Launch (Week 9-10)
- Security hardening
- Performance optimization
- Documentation
- Launch preparation

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- PostgreSQL
- n8n instance

### Installation
```bash
# Clone the repository
git clone https://github.com/dannythehat/jobbuddy.git

# Navigate to project directory
cd jobbuddy

# Install backend dependencies
cd backend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Install frontend dependencies
cd ../frontend
npm install

# Start development servers
# Terminal 1 (Backend)
cd backend
npm run dev

# Terminal 2 (Frontend)
cd frontend
npm start
```

## Project Structure

```
jobbuddy/
├── frontend/           # React frontend application
│   ├── public/         # Static files
│   ├── src/            # Source code
│   │   ├── components/ # Reusable components
│   │   ├── contexts/   # React contexts
│   │   ├── pages/      # Page components
│   │   ├── styles/     # Global styles
│   │   └── ...
├── backend/            # Node.js/Express backend
│   ├── src/            # Source code
│   │   ├── config/     # Configuration files
│   │   ├── controllers/# Request handlers
│   │   ├── middleware/ # Express middleware
│   │   ├── models/     # Database models
│   │   ├── routes/     # API routes
│   │   └── ...
├── n8n-workflows/      # n8n workflow templates
├── docs/               # Documentation
└── scripts/            # Utility scripts
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Danny Allan - dannythetruther@gmail.com

Project Link: [https://github.com/dannythehat/jobbuddy](https://github.com/dannythehat/jobbuddy)