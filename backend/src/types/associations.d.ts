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
    responses?: ResponseModel[];
    interviews?: Interview[];
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
    response?: ResponseModel | null;
  }
}

declare module '../models/Job' {
  interface Job {
    applications?: Application[];
  }
}

declare module '../models/CV' {
  interface CV {
    applications?: Application[];
  }
}
