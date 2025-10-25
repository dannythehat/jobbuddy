#!/usr/bin/env node
// Phase 7.1: Run Job Board Providers Migration
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'jobbuddy',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting job board providers migration...\n');
    
    // Read migration file
    const migrationPath = path.join(__dirname, '../migrations/007_add_job_board_providers.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute migration
    await client.query('BEGIN');
    await client.query(migrationSQL);
    await client.query('COMMIT');
    
    console.log('✅ Migration completed successfully!\n');
    
    // Verify providers
    const result = await client.query(`
      SELECT id, display_name, supported_countries, rate_limit_per_hour, is_active
      FROM job_board_providers
      ORDER BY display_name
    `);
    
    console.log('📊 Registered Job Board Providers:\n');
    console.log('┌─────────────────────────────────────────────────────────────────┐');
    console.log('│ Provider          │ Countries │ Rate Limit │ Status            │');
    console.log('├─────────────────────────────────────────────────────────────────┤');
    
    result.rows.forEach(row => {
      const provider = row.display_name.padEnd(17);
      const countries = row.supported_countries.length.toString().padEnd(9);
      const rateLimit = `${row.rate_limit_per_hour}/hr`.padEnd(10);
      const status = (row.is_active ? '✅ Active' : '❌ Inactive').padEnd(17);
      console.log(`│ ${provider} │ ${countries} │ ${rateLimit} │ ${status} │`);
    });
    
    console.log('└─────────────────────────────────────────────────────────────────┘\n');
    
    console.log(`✨ Total providers registered: ${result.rows.length}\n`);
    
    // Show regional breakdown
    const regionalQuery = await client.query(`
      SELECT 
        UNNEST(supported_countries) as country,
        COUNT(*) as provider_count
      FROM job_board_providers
      WHERE is_active = true
      GROUP BY country
      ORDER BY provider_count DESC, country
      LIMIT 10
    `);
    
    console.log('🌍 Top Regions by Provider Coverage:\n');
    regionalQuery.rows.forEach(row => {
      console.log(`   ${row.country}: ${row.provider_count} providers`);
    });
    
    console.log('\n🎉 Job board providers are ready to use!\n');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migration
runMigration().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
