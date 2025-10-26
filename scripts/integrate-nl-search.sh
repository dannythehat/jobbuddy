#!/bin/bash

# Phase 6.1 Stage 2 - Automated Integration Script
# This script integrates the Natural Language Search component into JobsPage

set -e

echo "🚀 Phase 6.1 Stage 2 - Natural Language Search Integration"
echo "==========================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "frontend/src/pages/JobsPage.tsx" ]; then
    echo "❌ Error: JobsPage.tsx not found. Please run this script from the project root."
    exit 1
fi

# Create backup
echo "📦 Creating backup..."
cp frontend/src/pages/JobsPage.tsx frontend/src/pages/JobsPage.tsx.backup
echo "✅ Backup created: frontend/src/pages/JobsPage.tsx.backup"
echo ""

# Apply changes
echo "🔧 Applying integration changes..."

# Change 1: Add import
echo "  1/3 Adding import statement..."
sed -i "1 a import NaturalLanguageSearch from '../components/NaturalLanguageSearch';" frontend/src/pages/JobsPage.tsx

# Change 2: Add handler function (after clearFilters)
echo "  2/3 Adding handler function..."
HANDLER='
  const handleNaturalLanguageSearch = (query: string, data: any) => {
    if (data.jobs \&\& data.jobs.length > 0) {
      setJobs(data.jobs);
      setActiveTab(1); // Switch to "All Jobs" tab
      setSuccess(\`Found \${data.jobs.length} jobs matching: "\${query}"\`);
    } else {
      setError('\''No jobs found matching your search'\'');
    }
  };
'
sed -i "/clearFilters = () => {/,/};/a\\$HANDLER" frontend/src/pages/JobsPage.tsx

# Change 3: Add component before Tabs
echo "  3/3 Adding Natural Language Search component..."
COMPONENT='
        {/* Natural Language Search */}
        <NaturalLanguageSearch onSearch={handleNaturalLanguageSearch} />
'
sed -i "/<Tabs value={activeTab}/i\\$COMPONENT" frontend/src/pages/JobsPage.tsx

echo ""
echo "✅ Integration complete!"
echo ""
echo "📋 Next Steps:"
echo "  1. Start your development server: cd frontend \&\& npm start"
echo "  2. Navigate to the Jobs page"
echo "  3. Test with: 'Find remote React jobs in London'"
echo ""
echo "🔄 To rollback: mv frontend/src/pages/JobsPage.tsx.backup frontend/src/pages/JobsPage.tsx"
echo ""
