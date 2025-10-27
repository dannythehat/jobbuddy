#!/bin/bash

# Phase 6.1 Integration Script
# Applies Natural Language Search to JobsPage.tsx

set -e

echo "🚀 Phase 6.1 Integration Script"
echo "================================"
echo ""

FILE="frontend/src/pages/JobsPage.tsx"

# Check if file exists
if [ ! -f "$FILE" ]; then
    echo "❌ Error: $FILE not found!"
    exit 1
fi

# Create backup
echo "📦 Creating backup..."
cp "$FILE" "${FILE}.backup-$(date +%Y%m%d-%H%M%S)"
echo "✅ Backup created"
echo ""

# Step 1: Add import
echo "Step 1: Adding import statement..."
sed -i "1 a import NaturalLanguageSearch from '../components/NaturalLanguageSearch';" "$FILE"
echo "✅ Import added"
echo ""

# Step 2: Add handler function (after clearFilters function)
echo "Step 2: Adding handler function..."
# Find the line number of clearFilters closing brace and add after it
LINE_NUM=$(grep -n "fetchAllJobs();" "$FILE" | tail -1 | cut -d: -f1)
LINE_NUM=$((LINE_NUM + 2))

HANDLER="
  const handleNaturalLanguageSearch = (query: string, data: any) => {
    if (data.jobs && data.jobs.length > 0) {
      setJobs(data.jobs);
      setActiveTab(1);
      setSuccess(\`Found \${data.jobs.length} jobs matching: \\\"\${query}\\\"\`);
    } else {
      setError('No jobs found matching your search');
    }
  };
"

sed -i "${LINE_NUM}i\\${HANDLER}" "$FILE"
echo "✅ Handler function added"
echo ""

# Step 3: Add component (before Tabs)
echo "Step 3: Adding NaturalLanguageSearch component..."
# Find the line with <Tabs and add before it
LINE_NUM=$(grep -n "<Tabs value={activeTab}" "$FILE" | cut -d: -f1)
LINE_NUM=$((LINE_NUM - 1))

COMPONENT="        <NaturalLanguageSearch onSearch={handleNaturalLanguageSearch} />"

sed -i "${LINE_NUM}i\\${COMPONENT}" "$FILE"
sed -i "${LINE_NUM}i\\" "$FILE"  # Add blank line
echo "✅ Component added"
echo ""

echo "🎉 Integration complete!"
echo ""
echo "Next steps:"
echo "1. cd frontend && npm start"
echo "2. Test with: 'Find remote React jobs in London'"
echo "3. Verify results appear in 'All Jobs' tab"
echo ""
echo "To rollback: cp ${FILE}.backup-* $FILE"
