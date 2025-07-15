import { createClient } from '@supabase/supabase-js';
import { Database } from '../src/integrations/supabase/types';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error("Supabase URL or Service Key is not defined in .env file.");
}

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function addSpanishSubject() {
  console.log("Attempting to add 'Espanhol' subject...");

  const { data, error } = await supabase
    .from('subjects')
    .insert({
      name: 'Espanhol',
      code: 'ESP',
      area: 'Linguagens'
    })
    .select();

  if (error) {
    if (error.code === '23505') { // unique_violation
      console.log("'Espanhol' subject already exists.");
    } else {
      console.error("Error adding subject:", error.message);
    }
  } else {
    console.log("Successfully added 'Espanhol' subject:", data);
  }
}

addSpanishSubject();
