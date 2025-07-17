import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs/promises';
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

// Mapping for inconsistent subject names in questions.json to database names
const subjectNameMapping: { [key: string]: string } = {
  "Interpretação de Texto": "Português",
  "Língua Portuguesa": "Português",
  "Língua Espanhola": "Espanhol",
  "Língua Inglesa": "Inglês",
  // Add other mappings if necessary
};

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

    // Fetch existing institutions, subjects, and topics to get their UUIDs
    const { data: institutions, error: instError } = await supabase.from('institutions').select('id, name');
    if (instError) throw instError;
    const institutionMap = new Map(institutions.map(inst => [inst.name, inst.id]));

    const { data: subjects, error: subjError } = await supabase.from('subjects').select('id, name');
    if (subjError) throw subjError;
    const subjectMap = new Map(subjects.map(subj => [subj.name, subj.id]));

    const { data: topics, error: topicError } = await supabase.from('topics').select('id, name, subject_id');
    if (topicError) throw topicError;
    const topicMap = new Map(topics.map(topic => [`${topic.name}-${topic.subject_id}`, topic.id]));

    const dataToInsert = questionsToInsert.map((q: any) => {
      const institution_id = institutionMap.get(q.institution);
      
      // Apply subject mapping
      const mappedSubjectName = subjectNameMapping[q.subject] || q.subject;
      const subject_id = subjectMap.get(mappedSubjectName);
      
      const topic_id = q.topic ? topicMap.get(`${q.topic}-${subject_id}`) : null; // Topic depends on subject

      if (!institution_id) {
        console.warn(`Institution not found for: ${q.institution}. Skipping question.`);
        return null;
      }
      if (!subject_id) {
        console.warn(`Subject not found for: ${q.subject} (mapped to ${mappedSubjectName}). Skipping question.`);
        return null;
      }

      let correct_answer_text = null;
      let alternatives_array: string[] = [];

      // Handle alternatives and correct answer based on the structure
      if (Array.isArray(q.alternatives) && q.alternatives.length > 0) {
        alternatives_array = q.alternatives.map((alt: any) => alt.text || alt);

        // If correct_answers is an array, take the first one
        if (Array.isArray(q.correct_answers) && q.correct_answers.length > 0) {
          const correctIndex = q.correct_answers[0];
          if (alternatives_array[correctIndex] !== undefined) {
            correct_answer_text = alternatives_array[correctIndex];
          } else {
            console.warn(`Correct answer index ${correctIndex} out of bounds for question ID ${q.id}. Skipping correct answer text.`);
          }
        } else if (typeof q.correctAnswer === 'number' && alternatives_array[q.correctAnswer] !== undefined) {
          // Fallback to single correctAnswer if correct_answers array is not present
          correct_answer_text = alternatives_array[q.correctAnswer];
        } else {
          console.warn(`Could not determine correct answer for question ID ${q.id}.`);
        }
      } else {
        console.warn(`No valid alternatives found for question ID ${q.id}. Skipping question.`);
        return null;
      }

      return {
        institution_id,
        subject_id,
        topic_id,
        year: q.year,
        question_number: q.questionNumber || null,
        type: q.type || 'multipla_escolha',
        difficulty: q.difficulty || 'medio',
        statement: q.statement,
        alternatives: alternatives_array, // This will be stored as JSONB array
        correct_answer: correct_answer_text,
        explanation: q.explanation || null,
        image_url: q.image || null,
        tags: q.tags || [],
        competencies: q.competencies || [],
        skills: q.skills || [],
      };
    }).filter(Boolean); // Filter out any nulls from skipped questions

    if (dataToInsert.length === 0) {
      console.log('No valid questions to insert after mapping. Exiting.');
      return;
    }

    console.log(`Attempting to insert ${dataToInsert.length} questions into the "questions" table...`);

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