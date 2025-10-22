# JobBuddy: Automated Job Application System

An intelligent job application automation platform that streamlines the entire job search process from CV management to interview preparation.

## Overview

JobBuddy helps job seekers automate and optimize their job application process through:

- CV processing and skill extraction with AI
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
- **File Processing**: PDF parsing, document analysis

## Current Status

✅ **Phase 1: Foundation** - COMPLETED!
✅ **Phase 2: Core Functionality** - COMPLETED!

### Phase 2 New Features:

#### 🚀 **CV Management System**
- ✅ **File Upload**: Drag & drop CV upload (PDF, DOC, DOCX)
- ✅ **AI Parsing**: OpenAI-powered CV parsing and skill extraction
- ✅ **Smart Analysis**: Automatic extraction of personal info, experience, education, skills
- ✅ **Real-time Status**: Live parsing status with progress indicators
- ✅ **CV Library**: Manage multiple CVs with default selection

#### 🎯 **Job Preferences Engine**
- ✅ **Comprehensive Preferences**: Job titles, locations, salary, remote work preferences
- ✅ **AI-Generated Preferences**: Auto-generate preferences from parsed CV data
- ✅ **Smart Suggestions**: Intelligent job title and skill suggestions
- ✅ **Flexible Configuration**: Support for multiple job types, industries, experience levels

#### 🔍 **Intelligent Job Matching**
- ✅ **Advanced Algorithm**: Multi-factor matching with weighted scoring
- ✅ **Match Scoring**: 
  - Title Match (25% weight)
  - Location Match (20% weight) 
  - Skills Match (25% weight)
  - Salary Match (15% weight)
  - Job Type Match (10% weight)
  - Experience Match (5% weight)
- ✅ **Match Explanations**: Clear reasons why jobs match your profile
- ✅ **Personalized Results**: Tailored job recommendations based on CV and preferences

#### 💼 **Job Discovery Platform**
- ✅ **Dual View**: Matched jobs vs. all jobs browsing
- ✅ **Advanced Filtering**: Search by title, location, salary, job type
- ✅ **Rich Job Cards**: Detailed job information with skills, salary, company info
- ✅ **Sample Data**: Development-ready with sample job creation
- ✅ **Direct Application**: One-click external application links

### Completed Features:
- ✅ GitHub repository setup with professional structure
- ✅ CI/CD pipeline with GitHub Actions
- ✅ Complete frontend application with React/TypeScript
  - Responsive layout with Material UI
  - Authentication system with protected routes
  - Dashboard with statistics and activity tracking
  - **NEW**: Advanced CV management with upload and parsing
  - **NEW**: Comprehensive job preferences configuration
  - **NEW**: Intelligent job matching and browsing interface
- ✅ Complete backend API with Node.js/Express
  - Authentication endpoints (register, login, profile)
  - User management endpoints
  - **NEW**: CV upload, parsing, and management endpoints
  - **NEW**: Job preferences with AI-powered generation
  - **NEW**: Job matching algorithm with scoring
  - **NEW**: Job browsing with advanced filtering
  - Database models for all entities
  - Security middleware and error handling
- ✅ Database schema with PostgreSQL
  - User, CV, JobPreference, Job, Application models
  - Proper relationships and constraints
- ✅ **NEW**: AI Services
  - OpenAI integration for CV parsing
  - Intelligent skill extraction
  - Job preference generation from CV data
- ✅ **NEW**: File Processing
  - Multer file upload middleware
  - PDF text extraction
  - File validation and security
- ✅ n8n workflow templates
  - CV parsing workflow with OpenAI integration
  - Job scraping workflow for LinkedIn
- ✅ Development tools and scripts
  - Database initialization script
  - Development environment setup script
  - Comprehensive documentation

### Next Phase Preview:
🔄 **Phase 3: Smart Features** - Starting Soon
- Application generation with AI
- Automated submission system
- Response monitoring and classification
- Learning system with analytics

## Development Roadmap

### Phase 1: Foundation ✅ COMPLETED
- Project setup and repository configuration
- Basic frontend and backend implementation
- Authentication system
- n8n integration templates

### Phase 2: Core Functionality ✅ COMPLETED
- ✅ CV processing system with file uploads and AI parsing
- ✅ Job preference collection and AI-powered generation
- ✅ Intelligent job matching with scoring algorithm
- ✅ Job browsing with advanced filtering and search

### Phase 3: Smart Features (Week 5-6)
- Automated application generation with AI
- Application submission system
- Response monitoring and classification
- Learning system with analytics
- AI-powered application optimization

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
- OpenAI API key
- n8n instance (optional for development)

### Environment Variables
Create a `.env` file in the backend directory:
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/jobbuddy
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jobbuddy
DB_USER=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Server
PORT=5000
NODE_ENV=development
```

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

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

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
│   │   │   ├── CVsPage.tsx          # CV management with upload/parsing
│   │   │   ├── PreferencesPage.tsx  # Job preferences configuration
│   │   │   ├── JobsPage.tsx         # Job matching and browsing
│   │   │   └── ...
│   │   ├── styles/          # Global styles and themes
│   │   └── ...
├── backend/                  # Node.js/Express backend
│   ├── src/
│   │   ├── config/          # Database and app configuration
│   │   ├── controllers/     # Request handlers
│   │   │   ├── cvController.ts           # CV upload and parsing
│   │   │   ├── jobPreferenceController.ts # Job preferences
│   │   │   ├── jobController.ts          # Job matching and browsing
│   │   │   └── ...
│   │   ├── middleware/      # Express middleware
│   │   │   ├── upload.ts    # File upload handling
│   │   │   └── ...
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   │   ├── cvParser.ts  # AI-powered CV parsing
│   │   │   ├── jobMatcher.ts # Intelligent job matching
│   │   │   └── ...
│   │   └── ...
├── uploads/                 # CV file storage (created automatically)
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

### CVs (NEW)
- `GET /api/cvs` - Get all user CVs
- `POST /api/cvs` - Upload and parse new CV
- `GET /api/cvs/:id` - Get specific CV
- `GET /api/cvs/:id/status` - Get CV parsing status
- `PUT /api/cvs/:id` - Update CV
- `DELETE /api/cvs/:id` - Delete CV

### Job Preferences (NEW)
- `GET /api/preferences` - Get user job preferences
- `POST /api/preferences` - Create/update job preferences
- `POST /api/preferences/generate` - Generate preferences from CV
- `DELETE /api/preferences` - Delete job preferences

### Jobs (NEW)
- `GET /api/jobs/matches` - Get matched jobs for user
- `GET /api/jobs` - Get all jobs with filtering
- `GET /api/jobs/stats` - Get job statistics
- `GET /api/jobs/:id` - Get specific job
- `POST /api/jobs/sample` - Create sample jobs (development)

## Key Features

### 🤖 AI-Powered CV Parsing
- Extracts personal information, experience, education, and skills
- Supports PDF, DOC, and DOCX formats
- Real-time parsing status and error handling
- Intelligent skill recognition and categorization

### 🎯 Smart Job Matching
- Multi-factor scoring algorithm
- Weighted matching criteria
- Personalized match explanations
- Continuous learning from user preferences

### 📊 Comprehensive Analytics
- Match score breakdowns
- Skill gap analysis
- Application success tracking
- Performance optimization insights

### 🔒 Security & Privacy
- Secure file upload and storage
- JWT-based authentication
- Data encryption and validation
- GDPR-compliant data handling

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

## Phase 2 Achievement Summary

🎉 **MAJOR MILESTONE REACHED!** 

JobBuddy now has a **fully functional core system** with:
- **AI-powered CV processing** that extracts skills and experience
- **Intelligent job matching** with personalized scoring
- **Professional UI/UX** with Material Design components
- **Real-time features** including parsing status and live updates
- **Comprehensive API** with proper error handling and validation

**Ready for Phase 3: Smart Features!** 🚀