import { User } from './User';
import { CV } from './CV';
import { JobPreference } from './JobPreference';
import { Job } from './Job';
import { Application } from './Application';
import { Certificate } from './Certificate';
import { Response } from './Response';
import { Interview } from './Interview';
import { setupAssociations } from './associations';

// Setup model associations
setupAssociations();

// Export all models
export {
  User,
  CV,
  JobPreference,
  Job,
  Application,
  Certificate,
  Response,
  Interview,
};
