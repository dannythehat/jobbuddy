# Associations Spec (Sequelize + Aliases)

Application.belongsTo(Job, { as: 'job', foreignKey: 'jobId' })
Application.belongsTo(CV,  { as: 'cv',  foreignKey: 'cvId'  })
Application.belongsTo(User,{ as: 'user',foreignKey: 'userId'})  // if not present

Response.belongsTo(Application, { as: 'application', foreignKey: 'applicationId' })
Interview.belongsTo(Application,{ as: 'application', foreignKey: 'applicationId' })

Type augmentation file to add: src/types/associations.d.ts (see below)