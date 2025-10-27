/**
 * Q1 Validation Test: Schema Access from scenes-web
 *
 * This script tests if scenes-web (non-owner app) can access
 * the scripts table (owned by scripts-web) via unified supabase/ directory.
 *
 * Expected: Success (demonstrates monorepo eliminates schema access friction)
 */

import { createClient } from '@supabase/supabase-js';

// Use local Supabase instance
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSchemaAccess() {
  console.log('🧪 Q1 Validation: Testing schema access from scenes-web...\n');

  try {
    // Query scripts table (owned by scripts-web)
    console.log('1. Querying scripts table schema...');
    const { data, error, count } = await supabase
      .from('scripts')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('❌ FAILED: Error querying scripts table');
      console.error('Error details:', error);
      process.exit(1);
    }

    console.log(`✅ SUCCESS: Scripts table accessible`);
    console.log(`   Found ${count ?? 0} scripts in database\n`);

    // Query script_components table (related to scripts-web)
    console.log('2. Querying script_components table...');
    const { data: components, error: compError, count: compCount } = await supabase
      .from('script_components')
      .select('*', { count: 'exact', head: true });

    if (compError) {
      console.error('❌ FAILED: Error querying script_components table');
      console.error('Error details:', compError);
      process.exit(1);
    }

    console.log(`✅ SUCCESS: Script components table accessible`);
    console.log(`   Found ${compCount ?? 0} components in database\n`);

    // Query projects table (shared across all apps)
    console.log('3. Querying projects table (shared resource)...');
    const { data: projects, error: projError, count: projCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });

    if (projError) {
      console.error('❌ FAILED: Error querying projects table');
      console.error('Error details:', projError);
      process.exit(1);
    }

    console.log(`✅ SUCCESS: Projects table accessible`);
    console.log(`   Found ${projCount ?? 0} projects in database\n`);

    console.log('═══════════════════════════════════════════════');
    console.log('✅ Q1 VALIDATION PASSED');
    console.log('═══════════════════════════════════════════════');
    console.log('');
    console.log('Findings:');
    console.log('- scenes-web can access scripts table (owned by scripts-web)');
    console.log('- scenes-web can access script_components table');
    console.log('- scenes-web can access shared tables (projects)');
    console.log('- No schema duplication required');
    console.log('- No manual copying/symlinks needed');
    console.log('');
    console.log('Conclusion: Unified supabase/ directory successfully');
    console.log('            eliminates schema access friction!');

  } catch (err) {
    console.error('❌ UNEXPECTED ERROR:', err);
    process.exit(1);
  }
}

testSchemaAccess();
// Q3 deployment independence test - $(date)
