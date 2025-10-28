#!/bin/bash
# Database Migration Script for GCP Cloud SQL
# This script runs database migrations during deployment

set -e

echo "🔄 Starting database migrations..."

# Check if required environment variables are set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is not set"
    exit 1
fi

# Run migrations using Sequelize CLI or custom migration tool
echo "📦 Running Sequelize migrations..."
npx sequelize-cli db:migrate

# Check migration status
if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully"
else
    echo "❌ Migration failed"
    exit 1
fi

# Optional: Seed database with initial data (only for first deployment)
if [ "$SEED_DATABASE" = "true" ]; then
    echo "🌱 Seeding database..."
    npx sequelize-cli db:seed:all
fi

echo "🎉 Database setup complete!"
