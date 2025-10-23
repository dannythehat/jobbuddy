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
🚀 **Phase 3: Smart Features** - IN PROGRESS!

### Phase 3 New Features:

#### 🤖 **AI-Powered Application Generation**
- ✅ **Smart Cover Letters**: AI-generated personalized cover letters with multiple tone options
- ✅ **Content Variations**: Generate multiple cover letter variations for A/B testing
- ✅ **Custom Resume**: AI-tailored resume optimization for specific job requirements
- ✅ **Application Analysis**: Intelligent job-CV matching analysis with key insights
- ✅ **Optimization Engine**: Feedback-based application improvement system

#### 📋 **Application Management System**
- ✅ **Complete Lifecycle**: Track applications from draft to final outcome
- ✅ **Status Management**: Comprehensive status tracking (draft, submitted, interviewing, etc.)
- ✅ **Analytics Dashboard**: Application statistics and success rate tracking
- ✅ **Response Tracking**: Monitor application responses and interview scheduling
- ✅ **Notes & Documentation**: Detailed application notes and interview tracking

#### 🎯 **Advanced Generation Options**
- ✅ **Tone Control**: Professional, enthusiastic, conversational, or formal tones
- ✅ **Length Options**: Short, medium, or long application content
- ✅ **Focus Areas**: Customizable emphasis on specific skills or experiences
- ✅ **Multi-format Support**: Cover letters, custom resumes, and application notes
- ✅ **Copy & Export**: Easy content copying and export functionality

### Phase 2 Features:

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
  - Advanced CV management with upload and parsing
  - Comprehensive job preferences configuration
  - Intelligent job matching and browsing interface
  - **NEW**: AI-powered application generation and management
- ✅ Complete backend API with Node.js/Express
  - Authentication endpoints (register, login, profile)
  - User management endpoints
  - CV upload, parsing, and management endpoints
  - Job preferences with AI-powered generation
  - Job matching algorithm with scoring
  - Job browsing with advanced filtering
  - **NEW**: Application management with AI generation endpoints
  - Database models for all entities
  - Security middleware and error handling
- ✅ Database schema with PostgreSQL
  - User, CV, JobPreference, Job, Application models
  - Proper relationships and constraints
- ✅ AI Services
  - OpenAI integration for CV parsing
  - Intelligent skill extraction
  - Job preference generation from CV data
  - **NEW**: AI-powered application content generation
  - **NEW**: Cover letter variations and optimization
- ✅ File Processing
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
🔄 **Phase 4: Advanced Features** - Coming Next
- Response monitoring and classification
- Interview preparation tools
- Comprehensive analytics dashboard
- Self-improvement and optimization

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

### Phase 3: Smart Features 🚀 IN PROGRESS
- ✅ Automated application generation with AI
- ✅ Application management system
- ✅ AI-powered content optimization
- 🔄 Learning system with analytics (Next)

### Phase 4: Advanced Features (Week 7-8)
- Response monitoring and classification
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
│   │   │   ├── ApplicationsPage.tsx # AI-powered application management
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
│   │   │   ├── applicationController.ts  # Application management
│   │   │   └── ...
│   │   ├── middleware/      # Express middleware
│   │   │   ├── upload.ts    # File upload handling
│   │   │   └── ...
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   │   ├── cvParser.ts  # AI-powered CV parsing
│   │   │   ├── jobMatcher.ts # Intelligent job matching
│   │   │   ├── applicationGenerator.ts # AI application generation
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

### CVs
- `GET /api/cvs` - Get all user CVs
- `POST /api/cvs` - Upload and parse new CV
- `GET /api/cvs/:id` - Get specific CV
- `GET /api/cvs/:id/status` - Get CV parsing status
- `PUT /api/cvs/:id` - Update CV
- `DELETE /api/cvs/:id` - Delete CV

### Job Preferences
- `GET /api/preferences` - Get user job preferences
- `POST /api/preferences` - Create/update job preferences
- `POST /api/preferences/generate` - Generate preferences from CV
- `DELETE /api/preferences` - Delete job preferences

### Jobs
- `GET /api/jobs/matches` - Get matched jobs for user
- `GET /api/jobs` - Get all jobs with filtering
- `GET /api/jobs/stats` - Get job statistics
- `GET /api/jobs/:id` - Get specific job
- `POST /api/jobs/sample` - Create sample jobs (development)

### Applications (NEW)
- `GET /api/applications` - Get all user applications
- `GET /api/applications/stats` - Get application statistics
- `GET /api/applications/:id` - Get specific application
- `POST /api/applications` - Create new application
- `POST /api/applications/generate` - Generate AI application content
- `POST /api/applications/generate-variations` - Generate cover letter variations
- `PUT /api/applications/:id` - Update application
- `POST /api/applications/:id/optimize` - Optimize application with feedback
- `DELETE /api/applications/:id` - Delete application

## Key Features

### 🤖 AI-Powered Application Generation (NEW)
- Personalized cover letter generation with multiple tone options
- Custom resume tailoring for specific job requirements
- Application content optimization based on feedback
- Multiple variations for A/B testing
- Intelligent job-CV matching analysis

### 📊 Application Management (NEW)
- Complete application lifecycle tracking
- Status management and response monitoring
- Application statistics and success rate analysis
- Interview scheduling and notes management
- Comprehensive application history

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

## Phase 3 Achievement Summary

🎉 **MAJOR MILESTONE REACHED!** 

JobBuddy now has **AI-powered application generation** with:
- **Intelligent Cover Letters** that adapt to job requirements and user preferences
- **Application Management System** with complete lifecycle tracking
- **AI Content Optimization** based on feedback and performance
- **Professional UI/UX** with advanced generation options and content management
- **Comprehensive Analytics** for application success tracking

**Ready for Phase 4: Advanced Features!** 🚀