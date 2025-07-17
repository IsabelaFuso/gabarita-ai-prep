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

async function addSubjects() {
  const subjectsToInsert = [
    { name: 'Língua Francesa', code: 'FRA', area: 'Linguagens' },
    { name: 'Artes', code: 'ART', area: 'Linguagens' },
    { name: 'Educação Física', code: 'EDF', area: 'Ciências Humanas' },
    { name: 'Espanhol', code: 'ESP', area: 'Linguagens' }, // Adicionado Espanhol
  ];

  console.log('Attempting to insert missing subjects...');

  for (const subject of subjectsToInsert) {
    const { data, error } = await supabase
      .from('subjects')
      .insert(subject)
      .select('id')
      .single();

    if (error && error.code !== '23505') { // 23505 is unique_violation, meaning it already exists
      console.error(`Error inserting subject ${subject.name}:`, error.message);
    } else if (error && error.code === '23505') {
      console.log(`Subject '${subject.name}' already exists. Skipping.`);
    } else {
      console.log(`Successfully inserted subject: ${subject.name} (ID: ${data?.id})`);
    }
  }
  console.log('Finished attempting to insert subjects.');
}

addSubjects();