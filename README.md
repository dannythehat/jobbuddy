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

✅ **Phase 1: Foundation** - COMPLETED!

### Completed Features:
- ✅ GitHub repository setup with professional structure
- ✅ CI/CD pipeline with GitHub Actions
- ✅ Complete frontend application with React/TypeScript
  - Responsive layout with Material UI
  - Authentication system with protected routes
  - Dashboard with statistics and activity tracking
  - All main pages (Home, Login, Register, Dashboard, Profile, CVs, Jobs, Applications)
- ✅ Complete backend API with Node.js/Express
  - Authentication endpoints (register, login, profile)
  - User management endpoints
  - CV management endpoints
  - Database models for all entities
  - Security middleware and error handling
- ✅ Database schema with PostgreSQL
  - User, CV, JobPreference, Job, Application models
  - Proper relationships and constraints
- ✅ n8n workflow templates
  - CV parsing workflow with OpenAI integration
  - Job scraping workflow for LinkedIn
- ✅ Development tools and scripts
  - Database initialization script
  - Development environment setup script
  - Comprehensive documentation

### Next Phase Preview:
🔄 **Phase 2: Core Functionality** - Starting Soon
- File upload system for CVs
- Job preference collection interface
- Real job scraping implementation
- Application generation system

## Development Roadmap

### Phase 1: Foundation ✅ COMPLETED
- Project setup and repository configuration
- Basic frontend and backend implementation
- Authentication system
- n8n integration templates

### Phase 2: Core Functionality (Week 3-4)
- CV processing system with file uploads
- Job preference collection and management
- Job search integration with real sources
- Application generator with AI

### Phase 3: Smart Features (Week 5-6)
- Automated submission system
- Response monitoring and classification
- Learning system with analytics
- AI-powered intelligence features

### Phase 4: Advanced Features (Week 7-8)
- Interview preparation tools
- Comprehensive analytics dashboard
- Self-improvement and optimization
- Admin tools and monitoring

### Phase 5: Polishing & Launch (Week 9-10)
- Security hardening and testing
- Performance optimization
- Complete documentation
- Production deployment and launch

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- PostgreSQL
- n8n instance (optional for development)

### Quick Setup
```bash
# Clone the repository
git clone https://github.com/dannythehat/jobbuddy.git
cd jobbuddy

# Run the setup script
chmod +x scripts/setup-dev.sh
./scripts/setup-dev.sh

# Initialize the database
node scripts/init-db.js

# Start development servers
# Terminal 1 (Backend)
cd backend && npm run dev

# Terminal 2 (Frontend)
cd frontend && npm start
```

### Manual Setup
```bash
# Install backend dependencies
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration

# Install frontend dependencies
cd ../frontend
npm install

# Initialize database
cd ..
node scripts/init-db.js
```

## Project Structure

```
jobbuddy/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React contexts (Auth, etc.)
│   │   ├── pages/           # Page components
│   │   ├── styles/          # Global styles and themes
│   │   └── ...
├── backend/                  # Node.js/Express backend
│   ├── src/
│   │   ├── config/          # Database and app configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   └── ...
├── n8n-workflows/           # Automation workflow templates
├── docs/                    # Documentation
├── scripts/                 # Utility and setup scripts
└── .github/workflows/       # CI/CD pipelines
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - User logout

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/account` - Delete user account

### CVs
- `GET /api/cvs` - Get all user CVs
- `POST /api/cvs` - Upload new CV
- `GET /api/cvs/:id` - Get specific CV
- `PUT /api/cvs/:id` - Update CV
- `DELETE /api/cvs/:id` - Delete CV

## Contributing

We welcome contributions! Please see our [Contributing Guide](docs/contributing.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

**Danny Allan** - dannythetruther@gmail.com

**Project Link**: [https://github.com/dannythehat/jobbuddy](https://github.com/dannythehat/jobbuddy)

---

*Built with ❤️ for job seekers everywhere*