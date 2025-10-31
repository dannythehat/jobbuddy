#!/bin/bash
# Script to fix Job model status -> isActive

# Fix jobMatcher.ts
sed -i "s/status: 'active'/isActive: true/g" backend/src/services/jobMatcher.ts

# Fix jobController.ts - only the Job model queries, not response status
sed -i "62s/status: 'active'/isActive: true/" backend/src/controllers/jobController.ts
sed -i "156s/status: 'active'/isActive: true/" backend/src/controllers/jobController.ts
sed -i "171s/status: 'active'/isActive: true/" backend/src/controllers/jobController.ts
sed -i "186s/status: 'active'/isActive: true/" backend/src/controllers/jobController.ts
sed -i "201s/status: 'active'/isActive: true/" backend/src/controllers/jobController.ts
sed-i "216s/status: 'active'/isActive: true/" backend/src/controllers/jobController.ts
sed -i "236s/where: { status: 'active' }/where: { isActive: true }/" backend/src/controllers/jobController.ts
sed -i "244s/where: { status: 'active' }/where: { isActive: true }/" backend/src/controllers/jobController.ts
sed -i "254s/where: { status: 'active' }/where: { isActive: true }/" backend/src/controllers/jobController.ts

echo "Fixed Job model references from status to isActive"
