import { createClient } from '@supabase/supabase-js';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Supabase URL or Service Role Key is not defined in your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function listSubjects() {
  console.log('Fetching subjects from database...');
  const { data, error } = await supabase.from('subjects').select('id, name, code, area');

  if (error) {
    console.error('Error fetching subjects:', error.message);
    return;
  }

  if (data && data.length > 0) {
    console.log('Subjects in database:');
    data.forEach(subject => {
      console.log(`- Name: ${subject.name}, Code: ${subject.code}, Area: ${subject.area}, ID: ${subject.id}`);
    });
  } else {
    console.log('No subjects found in the database.');
  }
}

listSubjects();