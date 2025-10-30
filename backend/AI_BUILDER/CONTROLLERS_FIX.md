# Controllers Fix

Alias imports to avoid Express vs Sequelize Response clash:
  import { Request, Response as ExpressResponse } from 'express'
  import { Response as ResponseModel } from '../models/Response'

When reading association props, do BOTH:
  (1) Include with correct `as` in the query
  (2) Access with optional chaining

Patterns:
  // Application with cv/job
  Application.findByPk(id, {
    include: [{ model: CV, as: 'cv' }, { model: Job, as: 'job' }]
  })

  // Response with application -> job/cv
  ResponseModel.findByPk(id, {
    include: [{ model: Application, as: 'application',
      include: [{ model: Job, as: 'job' }, { model: CV, as: 'cv' }] }]
  })