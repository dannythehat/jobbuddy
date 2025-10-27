// Add this handler function after the clearFilters function (around line 223)

const handleNaturalLanguageSearch = (query: string, data: any) => {
  if (data.jobs && data.jobs.length > 0) {
    setJobs(data.jobs);
    setActiveTab(1); // Switch to "All Jobs" tab
    setSuccess(`Found ${data.jobs.length} jobs matching: "${query}"`);
  } else {
    setError('No jobs found matching your search');
  }
};
