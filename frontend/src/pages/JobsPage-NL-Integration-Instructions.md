// Add this import at the top with other imports
import NaturalLanguageSearch from '../components/NaturalLanguageSearch';

// Add this state variable with other useState declarations (around line 75)
const [nlSearchResults, setNlSearchResults] = useState<Job[]>([]);
const [showNlResults, setShowNlResults] = useState(false);

// Add this handler function after the other handler functions (around line 230)
const handleNaturalLanguageSearch = (results: any) => {
  // Transform NL search results to match Job interface
  const transformedJobs = results.map((result: any) => ({
    id: result.job.id,
    title: result.job.title,
    company: result.job.company,
    location: result.job.location,
    jobType: result.job.jobType,
    salaryMin: result.job.salaryMin,
    salaryMax: result.job.salaryMax,
    salaryCurrency: result.job.salaryCurrency,
    description: result.job.description,
    requiredSkills: result.job.requiredSkills,
    experienceLevel: result.job.experienceLevel,
    postedDate: result.job.postedDate,
    applicationUrl: result.job.applicationUrl,
    status: result.job.status,
  }));
  
  setNlSearchResults(transformedJobs);
  setShowNlResults(true);
  setActiveTab(1); // Switch to "All Jobs" tab to show results
  setSuccess(`Found ${transformedJobs.length} jobs matching your search!`);
};

// Add the NaturalLanguageSearch component right after the success/error alerts
// and before the action buttons (around line 250)
{/* Natural Language Search */}
<NaturalLanguageSearch onSearch={handleNaturalLanguageSearch} />
