// scripts/populate-db.ts
import { createClient } from '@supabase/supabase-js';
import *fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Supabase URL or Service Role Key is not defined in your .env file.');
  process.exit(1);
}

// Initialize Supabase client with service_role key
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function main() {
  try {
    const questionsFilePath = path.resolve(__dirname, 'questions.json');
    
    console.log(`Reading questions from: ${questionsFilePath}`);
    const fileContent = await fs.readFile(questionsFilePath, 'utf-8');
    const questionsToInsert = JSON.parse(fileContent);

    if (!Array.isArray(questionsToInsert) || questionsToInsert.length === 0) {
      console.log('No questions found in questions.json or the file is not an array. Exiting.');
      return;
    }

    console.log(`Found ${questionsToInsert.length} questions to insert.`);

    // The 'alternatives' column in the DB expects a JSONB array of strings.
    // The 'correct_answer' is the 0-based index.
    const dataToInsert = questionsToInsert.map(q => ({
      institution: q.institution,
      year: q.year,
      subject: q.subject,
      topic: q.topic,
      statement: q.statement,
      image: q.image,
      alternatives: JSON.stringify(q.alternatives), // Ensure alternatives are a JSON string
      correct_answer: q.correctAnswer,
      explanation: q.explanation,
    }));

    console.log('Attempting to insert data into the "questions" table...');

    const { data, error } = await supabase.from('questions').insert(dataToInsert).select();

    if (error) {
      console.error('Error inserting data:', error.message);
      if (error.details) console.error('Details:', error.details);
      throw error;
    }

    console.log(`Successfully inserted ${data.length} questions into the database.`);

  } catch (error) {
    console.error('An unexpected error occurred:', error);
    process.exit(1);
  }
}

main();