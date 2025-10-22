import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ParsedCVData {
  personalInfo: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
  };
  summary?: string;
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  certifications?: string[];
  languages?: string[];
}

// Extract text from PDF
async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

// Extract text from DOC/DOCX (placeholder - would need mammoth.js for full implementation)
async function extractTextFromDoc(filePath: string): Promise<string> {
  // For now, return a placeholder
  // In production, you'd use mammoth.js or similar library
  return 'Document text extraction not implemented yet. Please use PDF format.';
}

// Parse CV text using OpenAI
async function parseWithOpenAI(text: string): Promise<ParsedCVData> {
  try {
    const prompt = `
Parse the following CV/Resume text and extract structured information. Return a JSON object with the following structure:

{
  "personalInfo": {
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "phone number",
    "location": "city, country",
    "linkedin": "linkedin profile url",
    "github": "github profile url"
  },
  "summary": "Professional summary or objective",
  "skills": ["skill1", "skill2", "skill3"],
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Start Date - End Date",
      "description": "Job description and achievements"
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "University/School Name",
      "year": "Graduation Year"
    }
  ],
  "certifications": ["certification1", "certification2"],
  "languages": ["language1", "language2"]
}

CV Text:
${text}

Please extract as much information as possible. If a field is not found, omit it or use null. Focus especially on extracting all technical skills, programming languages, frameworks, and tools mentioned.
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional CV parser. Extract structured information from CV text and return valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    const parsedData = JSON.parse(content);
    return parsedData;
  } catch (error) {
    console.error('Error parsing CV with OpenAI:', error);
    throw new Error('Failed to parse CV content');
  }
}

// Main CV parsing function
export async function parseCV(filePath: string, fileType: string): Promise<ParsedCVData> {
  let text: string;

  // Extract text based on file type
  switch (fileType.toLowerCase()) {
    case 'application/pdf':
      text = await extractTextFromPDF(filePath);
      break;
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      text = await extractTextFromDoc(filePath);
      break;
    default:
      throw new Error('Unsupported file type');
  }

  // Parse with OpenAI
  const parsedData = await parseWithOpenAI(text);
  
  return parsedData;
}

// Extract skills from parsed data
export function extractSkills(parsedData: ParsedCVData): string[] {
  const skills = new Set<string>();
  
  // Add skills from skills section
  if (parsedData.skills) {
    parsedData.skills.forEach(skill => skills.add(skill.toLowerCase().trim()));
  }
  
  // Extract skills from experience descriptions
  if (parsedData.experience) {
    parsedData.experience.forEach(exp => {
      // Simple skill extraction from description
      const commonSkills = [
        'javascript', 'typescript', 'python', 'java', 'react', 'node.js', 'express',
        'mongodb', 'postgresql', 'mysql', 'aws', 'docker', 'kubernetes', 'git',
        'html', 'css', 'angular', 'vue', 'php', 'laravel', 'django', 'flask',
        'redis', 'elasticsearch', 'graphql', 'rest api', 'microservices'
      ];
      
      const description = exp.description.toLowerCase();
      commonSkills.forEach(skill => {
        if (description.includes(skill)) {
          skills.add(skill);
        }
      });
    });
  }
  
  return Array.from(skills);
}

export default { parseCV, extractSkills };