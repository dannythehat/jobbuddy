/* eslint-disable */
import { Application } from '../models/Application';
import { Job } from '../models/Job';
import { CV } from '../models/CV';
import { Response as ResponseModel } from '../models/Response';
import { Interview } from '../models/Interview';

declare module '../models/Application' {
  interface Application {
    job?: Job | null;
    cv?: CV | null;
  }
}
declare module '../models/Response' {
  interface Response {
    application?: Application | null;
  }
}
declare module '../models/Interview' {
  interface Interview {
    application?: Application | null;
  }
}