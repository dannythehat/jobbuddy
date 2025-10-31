// Model associations setup
// This file defines all Sequelize model relationships

import { Application } from './Application';
import { Job } from './Job';
import { CV } from './CV';
import { Response } from './Response';
import { Interview } from './Interview';
import { User } from './User';

export function setupAssociations() {
  // Application associations
  Application.belongsTo(Job, {
    foreignKey: 'jobId',
    as: 'job'
  });

  Application.belongsTo(CV, {
    foreignKey: 'cvId',
    as: 'cv'
  });

  Application.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });

  // Response associations
  Response.belongsTo(Application, {
    foreignKey: 'applicationId',
    as: 'application'
  });

  Application.hasMany(Response, {
    foreignKey: 'applicationId',
    as: 'responses'
  });

  // Interview associations
  Interview.belongsTo(Application, {
    foreignKey: 'applicationId',
    as: 'application'
  });

  Interview.belongsTo(Response, {
    foreignKey: 'responseId',
    as: 'response'
  });

  Application.hasMany(Interview, {
    foreignKey: 'applicationId',
    as: 'interviews'
  });

  // Job associations
  Job.hasMany(Application, {
    foreignKey: 'jobId',
    as: 'applications'
  });

  // User associations
  User.hasMany(Application, {
    foreignKey: 'userId',
    as: 'applications'
  });

  User.hasMany(CV, {
    foreignKey: 'userId',
    as: 'cvs'
  });

  User.hasMany(Response, {
    foreignKey: 'userId',
    as: 'responses'
  });

  User.hasMany(Interview, {
    foreignKey: 'userId',
    as: 'interviews'
  });

  // CV associations
  CV.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });

  CV.hasMany(Application, {
    foreignKey: 'cvId',
    as: 'applications'
  });
}
