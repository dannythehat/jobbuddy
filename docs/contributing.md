# Contributing to JobBuddy

Thank you for your interest in contributing to JobBuddy! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis
- OpenAI API key
- Git

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/jobbuddy.git`
3. Follow the [Setup Guide](setup.md) to configure your development environment
4. Create a new branch: `git checkout -b feature/your-feature-name`

## 📋 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing code formatting and structure
- Use meaningful variable and function names
- Add comments for complex logic

### Commit Messages
Use conventional commit format:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

Example: `feat: add natural language job search functionality`

### Pull Request Process
1. Ensure your code follows the project's coding standards
2. Update documentation if needed
3. Add tests for new functionality
4. Ensure all tests pass
5. Update the README if you've added new features
6. Submit a pull request with a clear description

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Integration tests
npm run test:integration
```

### Writing Tests
- Write unit tests for new functions
- Add integration tests for API endpoints
- Include frontend component tests
- Ensure good test coverage

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node.js version, etc.)
- Screenshots if applicable

## 💡 Feature Requests

For new features:
- Check existing issues first
- Provide clear use case and benefits
- Consider implementation complexity
- Discuss with maintainers before starting work

## 📁 Project Structure

```
jobbuddy/
├── backend/          # Node.js/Express API
├── frontend/         # React application
├── docs/            # Documentation
├── scripts/         # Setup and utility scripts
├── n8n-workflows/   # Automation workflows
└── assets/          # Images and resources
```

## 🔄 Development Workflow

1. **Issue Assignment**: Comment on issues you'd like to work on
2. **Branch Creation**: Create feature branches from `main`
3. **Development**: Make changes following guidelines
4. **Testing**: Ensure all tests pass
5. **Documentation**: Update relevant docs
6. **Pull Request**: Submit PR with clear description
7. **Review**: Address feedback from maintainers
8. **Merge**: Approved PRs are merged to `main`

## 🎯 Current Focus Areas

We're currently focusing on:
- **Phase 6.1**: Natural Language Job Search
- Performance optimizations
- UI/UX improvements
- Test coverage expansion
- Documentation improvements

## 📞 Getting Help

- **Issues**: Use GitHub issues for bugs and features
- **Discussions**: Use GitHub discussions for questions
- **Email**: Contact dannythetruther@gmail.com for urgent matters

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors are recognized in:
- GitHub contributors list
- Release notes for significant contributions
- Project documentation

Thank you for helping make JobBuddy better! 🚀