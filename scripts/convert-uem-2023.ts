// scripts/convert-uem-2023.ts
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// --- CONFIGURATION ---
dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Supabase URL or Service Role Key is not defined in your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// --- TYPE DEFINITIONS ---
interface OldQuestion {
  id: number;
  statement: string;
  alternatives: { value: number; text: string }[];
  correctAnswerSum: number | null;
}

interface NewQuestion {
  institution_id: string; // UUID
  subject_id: string;     // UUID
  topic_id: string | null;// UUID
  year: number;
  type: 'multipla_escolha';
  statement: string;
  support_content: string | null;
  alternatives: { text: string }[]; // JSONB array of objects
  correct_answer: string; // Storing indices as a string for now, e.g., "[0, 2]"
  explanation: string;
  image_url: string | null;
}

// --- HELPER FUNCTIONS ---
function findCorrectAnswerIndices(alternatives: { value: number }[], sum: number): number[] {
  const correctIndices: number[] = [];
  let remainingSum = sum;
  const sortedAlts = [...alternatives].sort((a, b) => b.value - a.value);

  for (const alt of sortedAlts) {
    if (remainingSum >= alt.value) {
      remainingSum -= alt.value;
      const originalIndex = alternatives.findIndex(oAlt => oAlt.value === alt.value);
      if (originalIndex !== -1) {
        correctIndices.push(originalIndex);
      }
    }
  }
  if (remainingSum !== 0) return []; // Return empty if sum doesn't match
  return correctIndices.sort((a, b) => a - b);
}

function extractSupportContent(statement: string): { mainStatement: string; supportContent: string | null } {
    const separator = '\n \n';
    const parts = statement.split(separator);
    if (parts.length > 1) {
        const mainStatement = parts.pop()?.trim() || '';
        const supportContent = parts.join(separator).trim();
        return { mainStatement, supportContent };
    }
    return { mainStatement: statement.trim(), supportContent: null };
}

async function getReferenceIds() {
    console.log('Fetching reference IDs from Supabase (institutions, subjects)...');
    const { data: institutions, error: instError } = await supabase.from('institutions').select('id, code');
    if (instError) throw new Error(`Failed to fetch institutions: ${instError.message}`);

    const { data: subjects, error: subError } = await supabase.from('subjects').select('id, name');
    if (subError) throw new Error(`Failed to fetch subjects: ${subError.message}`);
    
    const institutionMap = new Map(institutions.map(i => [i.code, i.id]));
    const subjectMap = new Map(subjects.map(s => [s.name, s.id]));

    console.log('Reference IDs fetched successfully.');
    return { institutionMap, subjectMap };
}

// --- MAIN EXECUTION ---
async function main() {
  try {
    const { institutionMap, subjectMap } = await getReferenceIds();
    const uemId = institutionMap.get('UEM');
    if (!uemId) throw new Error('UEM institution not found in the database.');

    const inputFile = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../vestibular_2023_questions.json');
    const outputFile = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'questions_for_db.json');

    console.log(`Reading old format from: ${inputFile}`);
    const fileContent = await fs.readFile(inputFile, 'utf-8');
    const oldData = JSON.parse(fileContent);

    const newQuestions: NewQuestion[] = [];

    for (const oldQ of oldData.questions as OldQuestion[]) {
      const { mainStatement, supportContent } = extractSupportContent(oldQ.statement);
      const correctIndices = oldQ.correctAnswerSum ? findCorrectAnswerIndices(oldQ.alternatives, oldQ.correctAnswerSum) : [];
      
      // Infer subject based on ID range (simple heuristic for this specific file)
      let subjectName = 'Interpretação de Texto';
      if (oldQ.id >= 15 && oldQ.id <= 20) subjectName = 'Artes';
      if (oldQ.id >= 21 && oldQ.id <= 24) subjectName = 'Filosofia';
      if (oldQ.id >= 25 && oldQ.id <= 30) subjectName = 'Sociologia';
      if (oldQ.id >= 31 && oldQ.id <= 40) subjectName = 'Matemática';
      if (oldQ.id >= 41 && oldQ.id <= 43) subjectName = 'Biologia';
      if (oldQ.id >= 44 && oldQ.id <= 46) subjectName = 'Química';
      if (oldQ.id >= 47 && oldQ.id <= 50) subjectName = 'Física';
      if (oldQ.id >= 8 && oldQ.id <= 10) subjectName = 'Literatura';


      const subjectId = subjectMap.get(subjectName);
      if (!subjectId) {
          console.warn(`Subject "${subjectName}" not found for question ${oldQ.id}. Skipping.`);
          continue;
      }

      const newQ: NewQuestion = {
        institution_id: uemId,
        subject_id: subjectId,
        topic_id: null, // Topics need to be created and linked separately
        year: 2023,
        type: 'multipla_escolha',
        statement: mainStatement,
        support_content: supportContent,
        alternatives: oldQ.alternatives.map(alt => ({ text: alt.text.replace(/^\d+\)\s*/, '').trim() })),
        correct_answer: JSON.stringify(correctIndices), // Store as a JSON string
        explanation: 'Explicação a ser gerada.',
        image_url: null,
      };

      newQuestions.push(newQ);
    }

    console.log(`Successfully converted ${newQuestions.length} questions.`);
    console.log(`Writing to new file: ${outputFile}`);
    await fs.writeFile(outputFile, JSON.stringify(newQuestions, null, 2));
    console.log('Conversion complete! Now run the populate script with this new file.');

  } catch (error) {
    console.error('An error occurred during conversion:', error);
    process.exit(1);
  }
}

main();