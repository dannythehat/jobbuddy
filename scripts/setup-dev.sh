#!/bin/bash

# JobBuddy Development Setup Script

echo "🚀 Setting up JobBuddy development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed. Please install PostgreSQL and create a database named 'jobbuddy'"
    echo "   You can skip this if you plan to use a remote database."
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
if [ ! -f package.json ]; then
    echo "❌ Backend package.json not found"
    exit 1
fi

npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your database credentials and API keys"
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
if [ ! -f package.json ]; then
    echo "❌ Frontend package.json not found"
    exit 1
fi

npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

echo "✅ Dependencies installed successfully!"
echo ""
echo "🔧 Next steps:"
echo "1. Edit backend/.env with your database credentials"
echo "2. Set up your PostgreSQL database"
echo "3. Run 'node scripts/init-db.js' to initialize the database"
echo "4. Start the development servers:"
echo "   - Backend: cd backend && npm run dev"
echo "   - Frontend: cd frontend && npm start"
echo ""
echo "🎉 Setup complete! Happy coding!"