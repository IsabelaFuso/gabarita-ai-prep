// Fix all question IDs to be strings instead of numbers
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Array of question file paths
const questionFiles = [
  'src/data/questions/enem.ts',
  'src/data/questions/enem-2022-dia1.ts',
  'src/data/questions/enem-2022-dia2.ts',
  'src/data/questions/extras.ts',
  'src/data/questions/fuvest.ts',
  'src/data/questions/uem.ts',
  'src/data/questions/unicamp.ts'
];

// Function to convert numeric IDs to string IDs
function convertIdsToStrings(content) {
  return content.replace(/id:\s*(\d+),/g, 'id: "$1",');
}

// Process each file
questionFiles.forEach(async (filePath) => {
  try {
    const fullPath = join(process.cwd(), filePath);
    const content = await fs.readFile(fullPath, 'utf8');
    const updatedContent = convertIdsToStrings(content);
    await fs.writeFile(fullPath, updatedContent, 'utf8');
    console.log(`Updated ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
});