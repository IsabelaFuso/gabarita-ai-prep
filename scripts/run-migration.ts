import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error("Supabase URL or Service Key is not defined in .env file.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function runManualMigration() {
  try {
    console.log("Reading migration file for 'get_user_performance_summary'...");
    const migrationSql = fs.readFileSync(
      path.resolve(process.cwd(), 'supabase/migrations/20250715143000_create_performance_summary_function.sql'),
      'utf-8'
    );

    console.log("Executing SQL script on the database via rpc...");
    // This is a more direct way that might bypass some permission issues with the 'exec' helper
    const { error } = await supabase.rpc('eval', { 'query': migrationSql });

    if (error) {
      if (error.message.includes("already exists")) {
        console.log("Function 'get_user_performance_summary' already exists. Skipping creation.");
      } else {
        throw error;
      }
    } else {
      console.log("Successfully applied migration and created/updated the function 'get_user_performance_summary'.");
    }

  } catch (err: any) {
    console.error("An error occurred during manual migration:", err.message);
  }
}

runManualMigration();
