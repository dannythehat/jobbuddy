#!/usr/bin/env python3
"""
Auto-fix script for JobsPage.tsx
Fixes the import statements and Refresh button props
"""

import re

FILE_PATH = "frontend/src/pages/JobsPage.tsx"

def fix_jobspage():
    print("Reading JobsPage.tsx...")
    with open(FILE_PATH, 'r') as f:
        content = f.read()
    
    # Fix 1: Replace malformed imports (lines 1-2)
    # Match any variation of the broken import
    import_pattern = r"import NaturalLanguageSearch from ['\"]\.\.\/components\/NaturalLanguageSearch['\"][\s\n]*;?[\s\n]*import React, \{ useState, useEffect \} from ['\"]react['\"];"
    correct_imports = "import React, { useState, useEffect } from 'react';\nimport NaturalLanguageSearch from '../components/NaturalLanguageSearch';"
    
    content = re.sub(import_pattern, correct_imports, content)
    
    # Fix 2: Restore Refresh button props
    broken_button = r'<Button\s+variant="outlined"\s*>\s*Refresh\s*</Button>'
    correct_button = '''<Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => activeTab === 0 ? fetchMatchedJobs() : fetchAllJobs()}
          >
            Refresh
          </Button>'''
    
    content = re.sub(broken_button, correct_button, content)
    
    print("Writing fixes...")
    with open(FILE_PATH, 'w') as f:
        f.write(content)
    
    print("✅ Fixes applied successfully!")
    print("\nFixed:")
    print("1. Import statements (lines 1-2)")
    print("2. Refresh button props")

if __name__ == "__main__":
    fix_jobspage()
