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
✅ **Phase 3: Smart Features** - COMPLETED!
✅ **Phase 3+: Enhanced Features** - COMPLETED!
🚀 **Phase 4.1: Response Monitoring** - COMPLETED!

### Phase 4.1 New Features:

#### 📧 **Response Monitoring & Classification**
- ✅ **AI Email Classification**: Automatically classify job application responses using OpenAI
- ✅ **Smart Response Types**: Interview invites, rejections, offers, acknowledgments, follow-ups
- ✅ **Data Extraction**: Extract interview dates, locations, salary mentions, deadlines
- ✅ **Sentiment Analysis**: Positive, neutral, negative sentiment scoring
- ✅ **Action Detection**: Identify responses requiring user action
- ✅ **Confidence Scoring**: AI confidence levels for classification accuracy
- ✅ **Batch Processing**: Process multiple responses efficiently
- ✅ **Response Analytics**: Comprehensive statistics and trends
- ✅ **Auto-Status Updates**: Automatically update application status based on responses
- ✅ **Communication Timeline**: Integrate responses into application history

### Phase 3+ Features:

#### 📜 **Certificates & Awards Management**
- ✅ **File Upload System**: Upload certificates, awards, licenses with file validation
- ✅ **Category Management**: Organize by certificate, award, license, qualification, course, other
- ✅ **Expiry Tracking**: Monitor expiring and expired certificates with alerts
- ✅ **Verification System**: Mark certificates as verified with status tracking
- ✅ **Skills Integration**: Link certificates to specific skills for better job matching
- ✅ **Search & Filter**: Advanced filtering by category, verification status, expiry dates
- ✅ **Statistics Dashboard**: Comprehensive analytics on certificate portfolio

#### 📊 **Comprehensive Job Application History**
- ✅ **Complete Application Tracking**: Full lifecycle from draft to final outcome
- ✅ **Enhanced Status Management**: Draft, submitted, interviewing, offered, accepted, rejected, withdrawn
- ✅ **Communication Timeline**: Track all interactions (email, phone, meetings, messages)
- ✅ **Application Methods**: Track how applications were submitted (LinkedIn, Indeed, direct, etc.)
- ✅ **Referral Tracking**: Monitor referral sources and networking effectiveness
- ✅ **Salary Negotiation**: Track offered salaries and negotiation notes
- ✅ **Rejection Analysis**: Capture rejection reasons and feedback for improvement
- ✅ **Follow-up Management**: Schedule and track follow-up communications
- ✅ **Advanced Analytics**: Response rates, interview rates, offer rates, success metrics

#### 🛡️ **Duplicate Application Prevention**
- ✅ **Smart Detection**: Automatically detect duplicate applications to same job
- ✅ **Warning System**: Alert users before creating duplicate applications
- ✅ **Professional Guidance**: Recommendations for handling existing applications
- ✅ **Override Option**: Allow duplicates when intentionally needed
- ✅ **Application History**: Show existing application details and status

#### 🎯 **Enhanced Application Management**
- ✅ **Status History Tracking**: Complete timeline of all status changes
- ✅ **Communication Logging**: Detailed communication history with timestamps
- ✅ **Job Board Integration**: Track applications across multiple job boards
- ✅ **Advanced Filtering**: Filter by status, method, date ranges, search terms
- ✅ **Pagination Support**: Handle large application volumes efficiently
- ✅ **Timeline Visualization**: Visual timeline of application progress

### Phase 3 Core Features:

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
  - AI-powered application generation and management
  - **NEW**: Certificates and awards management system
  - **NEW**: Comprehensive job application history tracking
  - **NEW**: Duplicate application prevention system
  - **NEW**: Response monitoring and classification system
- ✅ Complete backend API with Node.js/Express
  - Authentication endpoints (register, login, profile)
  - User management endpoints
  - CV upload, parsing, and management endpoints
  - Job preferences with AI-powered generation
  - Job matching algorithm with scoring
  - Job browsing with advanced filtering
  - Application management with AI generation endpoints
  - **NEW**: Certificate management with file upload
  - **NEW**: Enhanced application tracking with timeline
  - **NEW**: Duplicate detection and prevention
  - **NEW**: Response classification and monitoring endpoints
  - Database models for all entities
  - Security middleware and error handling
- ✅ Database schema with PostgreSQL
  - User, CV, JobPreference, Job, Application, Certificate, Response models
  - Proper relationships and constraints
  - **NEW**: Enhanced Application model with comprehensive tracking
  - **NEW**: Certificate model with file management
  - **NEW**: Response model with AI classification
- ✅ AI Services
  - OpenAI integration for CV parsing
  - Intelligent skill extraction
  - Job preference generation from CV data
  - AI-powered application content generation
  - Cover letter variations and optimization
  - **NEW**: Email response classification and data extraction
- ✅ File Processing
  - Multer file upload middleware
  - PDF text extraction
  - File validation and security
  - **NEW**: Certificate file upload and management
- ✅ n8n workflow templates
  - CV parsing workflow with OpenAI integration
  - Job scraping workflow for LinkedIn
- ✅ Development tools and scripts
  - Database initialization script
  - Development environment setup script
  - Comprehensive documentation

### Next Phase Preview:
🔄 **Phase 4.2: Interview Preparation Tools** - Coming Next
- Company research automation
- Interview question generation
- Mock interview practice
- Salary negotiation guidance

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

### Phase 3: Smart Features ✅ COMPLETED
- ✅ Automated application generation with AI
- ✅ Application management system
- ✅ AI-powered content optimization
- ✅ Learning system with analytics

### Phase 3+: Enhanced Features ✅ COMPLETED
- ✅ Certificates and awards management
- ✅ Comprehensive job application history
- ✅ Duplicate application prevention
- ✅ Enhanced tracking and analytics

### Phase 4.1: Response Monitoring ✅ COMPLETED
- ✅ AI-powered email classification
- ✅ Response data extraction
- ✅ Sentiment analysis and confidence scoring
- ✅ Automated status updates
- ✅ Response analytics dashboard

### Phase 4.2: Interview Preparation (Week 7-8)
- Company research automation
- Interview question generation based on job role
- Mock interview practice with AI feedback
- Salary negotiation guidance and market data

### Phase 4.3: Advanced Analytics (Week 8-9)
- Comprehensive analytics dashboard
- Success rate optimization
- Performance insights and recommendations
- Self-improvement suggestions

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
│   │   │   ├── DuplicateApplicationDialog.tsx # Duplicate prevention
│   │   │   └── ...
│   │   ├── contexts/         # React contexts (Auth, etc.)
│   │   ├── pages/           # Page components
│   │   │   ├── CVsPage.tsx          # CV management with upload/parsing
│   │   │   ├── PreferencesPage.tsx  # Job preferences configuration
│   │   │   ├── JobsPage.tsx         # Job matching and browsing
│   │   │   ├── ApplicationsPage.tsx # AI-powered application management
│   │   │   ├── CertificatesPage.tsx # Certificates and awards management
│   │   │   ├── JobHistoryPage.tsx   # Comprehensive application history
│   │   │   ├── ResponsesPage.tsx    # Email response monitoring
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
│   │   │   ├── applicationController.ts  # Enhanced application management
│   │   │   ├── certificateController.ts  # Certificate management
│   │   │   ├── responseController.ts     # Response monitoring
│   │   │   └── ...
│   │   ├── middleware/      # Express middleware
│   │   │   ├── upload.ts    # File upload handling
│   │   │   └── ...
│   │   ├── models/          # Database models
│   │   │   ├── Application.ts # Enhanced with comprehensive tracking
│   │   │   ├── Certificate.ts # Certificate and awards model
│   │   │   ├── Response.ts    # Email response model
│   │   │   └── ...
│   │   ├── routes/          # API routes
│   │   │   ├── applications.ts # Enhanced application routes
│   │   │   ├── certificates.ts # Certificate management routes
│   │   │   ├── responseRoutes.ts # Response monitoring routes
│   │   │   └── ...
│   │   ├── services/        # Business logic
│   │   │   ├── cvParser.ts  # AI-powered CV parsing
│   │   │   ├── jobMatcher.ts # Intelligent job matching
│   │   │   ├── applicationGenerator.ts # AI application generation
│   │   │   ├── responseClassificationService.ts # AI response classification
│   │   │   └── ...
│   │   └── ...
├── uploads/                 # File storage (created automatically)
│   ├── cvs/                # CV files
│   └── certificates/       # Certificate files
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

### Applications (Enhanced)
- `GET /api/applications/check-duplicate` - Check for duplicate applications
- `GET /api/applications` - Get all user applications with filtering and pagination
- `GET /api/applications/stats` - Get enhanced application statistics
- `GET /api/applications/:id` - Get specific application
- `GET /api/applications/:id/timeline` - Get application timeline
- `POST /api/applications` - Create new application with duplicate prevention
- `POST /api/applications/generate` - Generate AI application content
- `POST /api/applications/generate-variations` - Generate cover letter variations
- `PUT /api/applications/:id` - Update application with enhanced tracking
- `POST /api/applications/:id/communication` - Add communication to application
- `POST /api/applications/:id/optimize` - Optimize application with feedback
- `DELETE /api/applications/:id` - Delete application

### Certificates
- `GET /api/certificates` - Get all user certificates with filtering
- `GET /api/certificates/stats` - Get certificate statistics
- `GET /api/certificates/by-skills` - Get certificates by skills
- `GET /api/certificates/:id` - Get specific certificate
- `GET /api/certificates/:id/download` - Download certificate file
- `POST /api/certificates` - Create new certificate with file upload
- `PUT /api/certificates/:id` - Update certificate
- `PUT /api/certificates/:id/verify` - Verify/unverify certificate
- `DELETE /api/certificates/:id` - Delete certificate

### Responses (NEW)
- `GET /api/responses` - Get all user responses with filtering and pagination
- `GET /api/responses/analytics` - Get response analytics and statistics
- `GET /api/responses/:id` - Get specific response
- `POST /api/responses` - Create new response (manual entry)
- `PUT /api/responses/:id` - Update response processing status
- `POST /api/responses/:id/reclassify` - Reclassify response using AI
- `POST /api/responses/batch-process` - Batch process unprocessed responses
- `DELETE /api/responses/:id` - Delete response

## Key Features

### 📧 **Response Monitoring & Classification (NEW)**
- AI-powered email classification with high accuracy
- Automatic data extraction (dates, locations, salaries)
- Sentiment analysis and confidence scoring
- Action detection and user notifications
- Comprehensive response analytics
- Integration with application timeline

### 📜 **Certificates & Awards Management**
- Professional certificate and award portfolio management
- File upload and storage with validation
- Expiry tracking and renewal reminders
- Skills integration for enhanced job matching
- Verification status tracking
- Advanced search and filtering capabilities

### 📊 **Comprehensive Job Application History**
- Complete application lifecycle tracking
- Communication timeline with all interactions
- Application method and referral source tracking
- Salary negotiation and offer management
- Rejection analysis and feedback capture
- Advanced analytics and success metrics

### 🛡️ **Duplicate Application Prevention**
- Smart detection of duplicate applications
- Professional guidance and recommendations
- Warning system with override options
- Application history integration
- User-friendly duplicate handling

### 🤖 **AI-Powered Application Generation**
- Personalized cover letter generation with multiple tone options
- Custom resume tailoring for specific job requirements
- Application content optimization based on feedback
- Multiple variations for A/B testing
- Intelligent job-CV matching analysis

### 📊 **Enhanced Application Management**
- Complete application lifecycle tracking
- Status management and response monitoring
- Application statistics and success rate analysis
- Interview scheduling and notes management
- Comprehensive application history

### 🤖 **AI-Powered CV Parsing**
- Extracts personal information, experience, education, and skills
- Supports PDF, DOC, and DOCX formats
- Real-time parsing status and error handling
- Intelligent skill recognition and categorization

### 🎯 **Smart Job Matching**
- Multi-factor scoring algorithm
- Weighted matching criteria
- Personalized match explanations
- Continuous learning from user preferences

### 📊 **Comprehensive Analytics**
- Match score breakdowns
- Skill gap analysis
- Application success tracking
- Performance optimization insights
- Certificate portfolio analytics
- Response monitoring statistics

### 🔒 **Security & Privacy**
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

## Phase 4.1 Achievement Summary

🎉 **PHASE 4.1 COMPLETED!** 

JobBuddy now has **AI-powered response monitoring** with:
- **Smart Email Classification** using OpenAI for accurate response categorization
- **Intelligent Data Extraction** for interview dates, locations, salaries, and deadlines
- **Sentiment Analysis** with confidence scoring for response quality assessment
- **Automated Status Updates** that sync responses with application lifecycle
- **Comprehensive Analytics** for tracking response patterns and success rates
- **Professional UI** with filtering, search, and detailed response management
- **Batch Processing** for efficient handling of multiple responses
- **Action Detection** to identify responses requiring user attention

**Ready for Phase 4.2: Interview Preparation Tools!** 🚀