#!/bin/bash

# Phase 6.1 Stage 2 - Apply JobsPage Integration
# This script applies the three required changes to JobsPage.tsx

FILE="frontend/src/pages/JobsPage.tsx"

echo "🚀 Applying Phase 6.1 Stage 2 Integration..."

# Backup original file
cp "$FILE" "$FILE.backup"
echo "✅ Created backup: $FILE.backup"

# Step 1: Add import after line 1
sed -i '1 a import NaturalLanguageSearch from '"'"'../components/NaturalLanguageSearch'"'"';' "$FILE"
echo "✅ Step 1: Added NaturalLanguageSearch import"

# Step 2: Add handler function after clearFilters function (around line 223)
# Find the line with "fetchAllJobs();" inside clearFilters and add the handler after the closing brace
sed -i '/const clearFilters = /,/^  };$/a\
\
  const handleNaturalLanguageSearch = (query: string, data: any) => {\
    if (data.jobs && data.jobs.length > 0) {\
      setJobs(data.jobs);\
      setActiveTab(1);\
      setSuccess(`Found ${data.jobs.length} jobs matching: "${query}"`);\
    } else {\
      setError('"'"'No jobs found matching your search'"'"');\
    }\
  };' "$FILE"
echo "✅ Step 2: Added handleNaturalLanguageSearch function"

# Step 3: Add component before Tabs
# Find the line with "<Tabs value={activeTab}" and add the component before it
sed -i '/<Tabs value={activeTab}/i\
        {/* Natural Language Search */}\
        <NaturalLanguageSearch onSearch={handleNaturalLanguageSearch} />\
' "$FILE"
echo "✅ Step 3: Added NaturalLanguageSearch component"

echo ""
echo "🎉 Integration complete!"
echo ""
echo "Next steps:"
echo "1. Review the changes: git diff $FILE"
echo "2. Test the natural language search feature"
echo "3. If there are issues, restore backup: mv $FILE.backup $FILE"
