<div align="center">

![JobBuddi Logo](https://client-uploads.nyc3.digitaloceanspaces.com/images/731d7eb6-98fd-4f14-8af6-386d93ba0e57/2025-10-24T03-50-17-074Z-0b544258.jpg)

# JobBuddi: Automated Job Application System

*Your AI-Powered Career Assistant* 🤖

</div>

---

An intelligent job application automation platform that streamlines the entire job search process from CV management to interview preparation.

## 🚀 What is JobBuddi?

JobBuddi is the world's first truly intelligent job application assistant that helps job seekers automate and optimize their entire job search process through:

- **🤖 AI-Powered CV Parsing** - Extracts skills, experience, education automatically
- **🎯 Smart Job Matching** - Multi-factor scoring with personalized recommendations  
- **📝 Automated Application Generation** - AI-generated cover letters and tailored resumes
- **📧 Response Monitoring** - AI classification of job application responses
- **📅 Complete Interview Automation** - From email detection to calendar scheduling
- **📜 Certificate Management** - Professional portfolio with expiry tracking
- **📊 Comprehensive Analytics** - Success rates, patterns, and optimization insights

## 🎯 Current Status

✅ **Phase 1: Foundation** - COMPLETED!  
✅ **Phase 2: Core Functionality** - COMPLETED!  
✅ **Phase 3: Smart Features** - COMPLETED!  
✅ **Phase 3+: Enhanced Features** - COMPLETED!  
✅ **Phase 4.1: Response Monitoring** - COMPLETED!  
🚀 **Phase 4.2: Interview Automation** - COMPLETED!  

**Ready for Phase 4.3: Advanced Analytics & Insights!** 📊

## 🛠️ Technology Stack

- **Frontend**: React with TypeScript, Material UI
- **Backend**: Node.js/Express, TypeScript  
- **Database**: PostgreSQL with Sequelize ORM
- **Automation**: n8n workflows
- **AI Integration**: OpenAI for content generation and analysis
- **File Processing**: PDF parsing, document analysis
- **Calendar Integration**: Google Calendar API

## ⭐ Key Features

### 🤖 **Complete Interview Automation (NEW)**
- AI-powered interview detection and scheduling
- Google Calendar integration with automatic event creation
- Smart email response generation with multiple tones
- Conflict detection and resolution
- Customizable reminders and notifications
- Post-interview tracking and outcome management

### 📧 **Response Monitoring & Classification**
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

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- PostgreSQL
- OpenAI API key
- Google Calendar API credentials (optional)
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

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Start development servers
# Terminal 1 (Backend)
cd backend && npm run dev

# Terminal 2 (Frontend)  
cd frontend && npm start
```

## 📊 Project Structure

```
jobbuddy/
├── frontend/                 # React frontend application
├── backend/                  # Node.js/Express backend
├── assets/                   # Brand assets and logos
├── uploads/                  # File storage
├── n8n-workflows/           # Automation workflow templates
├── docs/                    # Documentation
├── scripts/                 # Utility and setup scripts
└── .github/workflows/       # CI/CD pipelines
```

## 🔗 API Endpoints

### Core Features
- **Authentication**: Register, login, profile management
- **CVs**: Upload, parse, manage with AI extraction
- **Job Preferences**: AI-powered preference generation
- **Jobs**: Smart matching and advanced filtering
- **Applications**: Enhanced tracking with duplicate prevention
- **Certificates**: Portfolio management with file upload
- **Responses**: AI classification and monitoring
- **Interviews**: Complete automation and scheduling

## 🎉 Phase 4.2 Achievement Summary

**PHASE 4.2 COMPLETED!** 

JobBuddi now has **complete interview automation** with:
- **Smart Interview Detection** that automatically identifies interview invitations
- **Interactive Scheduling UI** with beautiful alerts for accept/decline/reschedule
- **Google Calendar Integration** with OAuth authentication and automatic event creation
- **AI Email Response Generation** with professional, contextual responses
- **Conflict Detection** to prevent double-booking and scheduling issues
- **Customizable Reminders** with email and push notifications
- **Interview Management Dashboard** for tracking all interviews and outcomes
- **Post-Interview Tracking** with notes, feedback, and follow-up management
- **Complete Automation Pipeline** from email detection to calendar scheduling

**The world's first truly intelligent job application assistant!** 🚀

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/contributing.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Danny Allan** - dannythetruther@gmail.com

**Project Link**: [https://github.com/dannythehat/jobbuddy](https://github.com/dannythehat/jobbuddy)

---

<div align="center">

*Built with ❤️ for job seekers everywhere*

**Ready for Phase 4.3: Advanced Analytics & Insights!** 📊

</div>