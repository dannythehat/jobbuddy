#!/bin/bash
# Phase 6.1 Stage 2 - Apply JobsPage Integration

echo "🚀 Applying Phase 6.1 Stage 2 fixes to JobsPage.tsx..."

FILE="frontend/src/pages/JobsPage.tsx"

# Backup original file
cp "$FILE" "${FILE}.backup"
echo "✅ Created backup: ${FILE}.backup"

# Change 1: Add import after line 1
sed -i "1 a import NaturalLanguageSearch from '../components/NaturalLanguageSearch';" "$FILE"
echo "✅ Added NaturalLanguageSearch import"

# Change 2: Add handler function before return statement (after clearFilters function)
# This is more complex, so we'll use a here-doc approach
cat >> /tmp/handler.txt << 'EOF'

  const handleNaturalLanguageSearch = (query: string, data: any) => {
    if (data.jobs && data.jobs.length > 0) {
      setJobs(data.jobs);
      setActiveTab(1); // Switch to All Jobs tab
      setSuccess(`Found ${data.jobs.length} jobs matching: "${query}"`);
    } else {
      setError('No jobs found matching your search');
    }
  };
EOF

# Insert handler after clearFilters function
sed -i '/fetchAllJobs();$/r /tmp/handler.txt' "$FILE"
echo "✅ Added handleNaturalLanguageSearch handler"

# Change 3: Add component before Tabs
sed -i 's/<Tabs value={activeTab}/<NaturalLanguageSearch onSearch={handleNaturalLanguageSearch} \/>\n\n        <Tabs value={activeTab}/' "$FILE"
echo "✅ Added NaturalLanguageSearch component"

echo ""
echo "🎉 All changes applied successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Review changes: git diff $FILE"
echo "2. Test the integration"
echo "3. Commit: git add $FILE && git commit -m 'Complete Phase 6.1 Stage 2: Integrate NL search'"
echo ""
echo "💾 Backup saved at: ${FILE}.backup"
