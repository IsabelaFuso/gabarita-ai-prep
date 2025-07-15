import { createClient } from '@supabase/supabase-js';
import { Database } from '../src/integrations/supabase/types';

// Import all question sets
import { enemQuestions } from '../src/data/questions/enem';
import { fuvestQuestions } from '../src/data/questions/fuvest';
import { unicampQuestions } from '../src/data/questions/unicamp';
import { uemQuestions } from '../src/data/questions/uem';
import { extraQuestions } from '../src/data/questions/extras';
import { enem2022Dia1 } from '../src/data/questions/enem-2022-dia1'; // Import new questions
import { enem2022Dia2 } from '../src/data/questions/enem-2022-dia2'; // Import new questions
import { Question } from '../src/data/types';

// WARNING: Use environment variables for sensitive data
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error("Supabase URL or Service Key is not defined. Make sure to create a .env file with SUPABASE_URL and SUPABASE_SERVICE_KEY.");
}

// Create a Supabase client with the service role key
const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY);

console.log("Starting database population script...");

async function populateDatabase() {
  try {
    // 1. Fetch existing data for mapping
    console.log("Fetching existing institutions, subjects, and topics...");
    const { data: institutions, error: instError } = await supabase.from('institutions').select('id, name');
    if (instError) throw new Error(`Error fetching institutions: ${instError.message}`);

    const { data: subjects, error: subjError } = await supabase.from('subjects').select('id, name');
    if (subjError) throw new Error(`Error fetching subjects: ${subjError.message}`);

    const { data: topics, error: topError } = await supabase.from('topics').select('id, name, subject_id');
    if (topError) throw new Error(`Error fetching topics: ${topError.message}`);
    
    // Fetch existing question statements to prevent duplicates
    const { data: existingQuestions, error: qError } = await supabase.from('questions').select('statement');
    if (qError) throw new Error(`Error fetching existing questions: ${qError.message}`);
    const existingStatements = new Set(existingQuestions.map(q => q.statement));

    const institutionMap = new Map(institutions.map(i => [i.name.toUpperCase(), i.id]));
    const subjectMap = new Map(subjects.map(s => [s.name.toUpperCase(), s.id]));
    const topicMap = new Map(topics.map(t => [`${t.name.toUpperCase()}-${t.subject_id}`, t.id]));

    console.log("Maps created successfully.");
    console.log(`Found ${institutionMap.size} institutions, ${subjectMap.size} subjects, ${topicMap.size} topics.`);
    console.log(`Found ${existingStatements.size} existing questions in the database.`);

    // Combine all questions into one array
    const allQuestions: Question[] = [
      ...enemQuestions,
      ...fuvestQuestions,
      ...unicampQuestions,
      ...uemQuestions,
      ...extraQuestions,
      ...enem2022Dia1, // Add new questions to the array
      ...enem2022Dia2  // Add new questions to the array
    ];

    console.log(`Found a total of ${allQuestions.length} questions to process.`);

    const questionsToInsert = [];

    for (const question of allQuestions) {
      // Skip if question statement already exists in the database
      if (existingStatements.has(question.statement)) {
        // console.log(`Skipping question ID ${question.id}: Already exists.`);
        continue;
      }

      const institutionId = institutionMap.get(question.institution.toUpperCase());
      const subjectId = subjectMap.get(question.subject.toUpperCase());

      if (!institutionId) {
        console.warn(`Skipping question ID ${question.id}: Institution "${question.institution}" not found.`);
        continue;
      }
      if (!subjectId) {
        console.warn(`Skipping question ID ${question.id}: Subject "${question.subject}" not found.`);
        continue;
      }

      // 2. Ensure topic exists and get its ID
      let topicId = topicMap.get(`${question.topic.toUpperCase()}-${subjectId}`);
      if (!topicId) {
        console.log(`Topic "${question.topic}" for subject ID ${subjectId} not found. Creating it...`);
        const { data: newTopic, error: newTopError } = await supabase
          .from('topics')
          .insert({ name: question.topic, subject_id: subjectId })
          .select('id')
          .single();
        
        if (newTopError) {
          console.error(`Error creating topic "${question.topic}": ${newTopError.message}`);
          continue;
        }
        
        topicId = newTopic.id;
        topicMap.set(`${question.topic.toUpperCase()}-${subjectId}`, topicId);
        console.log(`Topic "${question.topic}" created with ID ${topicId}.`);
      }

      // 3. Prepare the question for insertion
      const correctAnswerText = question.alternatives[question.correctAnswer];

      questionsToInsert.push({
        institution_id: institutionId,
        subject_id: subjectId,
        topic_id: topicId,
        year: question.year,
        statement: question.statement,
        alternatives: JSON.stringify(question.alternatives),
        correct_answer: correctAnswerText,
        explanation: question.explanation,
        type: 'multipla_escolha',
        difficulty: 'medio',
      });
    }

    // 4. Insert all new questions
    if (questionsToInsert.length > 0) {
      console.log(`Preparing to insert ${questionsToInsert.length} new questions...`);
      const { error: insertError } = await supabase.from('questions').insert(questionsToInsert);

      if (insertError) {
        throw new Error(`Error inserting questions: ${insertError.message}`);
      }
      console.log(`Successfully inserted ${questionsToInsert.length} new questions into the database.`);
    } else {
      console.log("No new questions to insert. The database is already up-to-date.");
    }

  } catch (error) {
    console.error("An error occurred during the script execution:", error);
  }
}

populateDatabase();
