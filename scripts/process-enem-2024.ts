import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://muswjsloobcxgsconuag.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Gabarito ENEM 2024 - Caderno 1 Azul
const GABARITO_2024_AZUL = {
  // Questões de Inglês (1-5)
  1: 'C', 2: 'A', 3: 'A', 4: 'A', 5: 'E',
  // Linguagens e Códigos (6-45)
  6: 'E', 7: 'C', 8: 'B', 9: 'E', 10: 'C',
  11: 'E', 12: 'D', 13: 'D', 14: 'C', 15: 'B',
  16: 'D', 17: 'E', 18: 'D', 19: 'D', 20: 'C',
  21: 'E', 22: 'C', 23: 'B', 24: 'D', 25: 'C',
  26: 'B', 27: 'C', 28: 'E', 29: 'A', 30: 'D',
  31: 'B', 32: 'B', 33: 'D', 34: 'B', 35: 'D',
  36: 'D', 37: 'C', 38: 'B', 39: 'E', 40: 'D',
  41: 'A', 42: 'D', 43: 'E', 44: 'E', 45: 'B',
  // Ciências Humanas (46-90)
  46: 'C', 47: 'E', 48: 'C', 49: 'E', 50: 'B',
  51: 'E', 52: 'B', 53: 'C', 54: 'D', 55: 'B',
  56: 'A', 57: 'D', 58: 'D', 59: 'E', 60: 'B',
  61: 'B', 62: 'A', 63: 'B', 64: 'C', 65: 'D',
  66: 'C', 67: 'A', 68: 'E', 69: 'C', 70: 'E',
  71: 'D', 72: 'A', 73: 'D', 74: 'B', 75: 'A',
  76: 'E', 77: 'A', 78: 'B', 79: 'E', 80: 'A',
  81: 'D', 82: 'C', 83: 'E', 84: 'D', 85: 'A',
  86: 'D', 87: 'A', 88: 'C', 89: 'B', 90: 'C'
};

async function uploadPDFToStorage(filePath: string, fileName: string): Promise<string> {
  console.log(`Fazendo upload do arquivo ${fileName}...`);
  
  const fileBuffer = fs.readFileSync(filePath);
  const storagePath = `enem-2024/${fileName}`;
  
  const { data, error } = await supabase.storage
    .from('question-pdfs')
    .upload(storagePath, fileBuffer, {
      contentType: 'application/pdf',
      upsert: true
    });
  
  if (error) {
    throw new Error(`Erro ao fazer upload: ${error.message}`);
  }
  
  console.log(`✓ Upload concluído: ${storagePath}`);
  return storagePath;
}

async function registerPDFInDatabase(filePath: string, fileName: string, fileSize: number): Promise<string> {
  console.log('Registrando PDF no banco de dados...');
  
  const { data, error } = await supabase
    .from('pdf_question_sources')
    .insert({
      file_name: fileName,
      file_path: filePath,
      file_size: fileSize,
      institution_name: 'ENEM',
      exam_year: 2024,
      description: 'ENEM 2024 - 1º Dia - Caderno 1 Azul - Linguagens e Ciências Humanas',
      processed: false,
      questions_extracted: 0
    })
    .select()
    .single();
  
  if (error) {
    throw new Error(`Erro ao registrar no banco: ${error.message}`);
  }
  
  console.log(`✓ PDF registrado com ID: ${data.id}`);
  return data.id;
}

async function extractTextFromPDF(pdfId: string): Promise<string> {
  console.log('Extraindo texto do PDF...');
  
  // Buscar informações do PDF
  const { data: pdfData, error: pdfError } = await supabase
    .from('pdf_question_sources')
    .select('*')
    .eq('id', pdfId)
    .single();
  
  if (pdfError) {
    throw new Error(`Erro ao buscar PDF: ${pdfError.message}`);
  }
  
  // Baixar PDF do storage
  const { data: fileData, error: downloadError } = await supabase.storage
    .from('question-pdfs')
    .download(pdfData.file_path);
  
  if (downloadError) {
    throw new Error(`Erro ao baixar PDF: ${downloadError.message}`);
  }
  
  // Extrair texto usando edge function
  const formData = new FormData();
  const blob = new Blob([await fileData.arrayBuffer()], { type: 'application/pdf' });
  formData.append('pdf', blob, pdfData.file_name);
  
  const { data: extractData, error: extractError } = await supabase.functions.invoke('pdf-extract-text', {
    body: formData
  });
  
  if (extractError) {
    throw new Error(`Erro ao extrair texto: ${extractError.message}`);
  }
  
  console.log(`✓ Texto extraído com sucesso (${extractData.extractedText.length} caracteres)`);
  return extractData.extractedText;
}

async function processQuestionsWithAI(text: string): Promise<any> {
  console.log('Processando questões com Lovable AI...');
  
  const { data, error } = await supabase.functions.invoke('process-question-ai', {
    body: {
      content: text,
      isImage: false,
      processType: 'extract_questions'
    }
  });
  
  if (error) {
    throw new Error(`Erro ao processar com IA: ${error.message}`);
  }
  
  console.log(`✓ ${data.questions.length} questões extraídas pela Lovable AI`);
  return data;
}

async function getInstitutionId(name: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('institutions')
    .select('id')
    .eq('name', name)
    .single();
  
  if (error || !data) return null;
  return data.id;
}

async function getSubjectId(name: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('subjects')
    .select('id')
    .eq('name', name)
    .single();
  
  if (error || !data) return null;
  return data.id;
}

async function saveQuestionsToDatabase(questions: any[], pdfId: string): Promise<void> {
  console.log(`Salvando ${questions.length} questões no banco de dados...`);
  
  const institutionId = await getInstitutionId('ENEM');
  let savedCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const questionNumber = i + 1;
    
    // Obter resposta correta do gabarito
    const correctAnswer = GABARITO_2024_AZUL[questionNumber as keyof typeof GABARITO_2024_AZUL];
    
    try {
      // Determinar matéria com base no número da questão
      let subjectName = '';
      if (questionNumber <= 5) {
        subjectName = 'Inglês';
      } else if (questionNumber <= 45) {
        subjectName = 'Linguagens, Códigos e suas Tecnologias';
      } else {
        subjectName = 'Ciências Humanas e suas Tecnologias';
      }
      
      const subjectId = await getSubjectId(subjectName);
      
      const questionData = {
        statement: question.statement || `Questão ${questionNumber}`,
        type: 'multipla_escolha' as const,
        difficulty: 'medio' as const,
        alternatives: question.alternatives || question.options || {},
        correct_answer: correctAnswer,
        explanation: null,
        institution_id: institutionId,
        subject_id: subjectId,
        year: 2024,
        question_number: questionNumber.toString()
      };
      
      const { error } = await supabase
        .from('questions')
        .insert(questionData);
      
      if (error) {
        console.error(`✗ Erro ao salvar questão ${questionNumber}: ${error.message}`);
        errorCount++;
      } else {
        savedCount++;
        console.log(`✓ Questão ${questionNumber} salva com sucesso`);
      }
    } catch (err) {
      console.error(`✗ Erro ao processar questão ${questionNumber}:`, err);
      errorCount++;
    }
  }
  
  // Atualizar registro do PDF
  await supabase
    .from('pdf_question_sources')
    .update({
      processed: true,
      questions_extracted: savedCount
    })
    .eq('id', pdfId);
  
  console.log(`\n✓ Processo concluído: ${savedCount} questões salvas, ${errorCount} erros`);
}

async function main() {
  try {
    console.log('=== PROCESSAMENTO DA PROVA ENEM 2024 ===\n');
    
    // Definir caminho dos arquivos (ajuste conforme necessário)
    const provaPDF = path.join(__dirname, '..', 'user-uploads', '2024_PV_impresso_D1_CD1.pdf');
    
    if (!fs.existsSync(provaPDF)) {
      console.error('Arquivo da prova não encontrado:', provaPDF);
      console.log('Por favor, verifique o caminho do arquivo.');
      return;
    }
    
    // 1. Upload do PDF para storage
    const fileSize = fs.statSync(provaPDF).size;
    const storagePath = await uploadPDFToStorage(provaPDF, '2024_PV_impresso_D1_CD1.pdf');
    
    // 2. Registrar no banco
    const pdfId = await registerPDFInDatabase(storagePath, '2024_PV_impresso_D1_CD1.pdf', fileSize);
    
    // 3. Extrair texto
    const extractedText = await extractTextFromPDF(pdfId);
    
    // 4. Processar com IA
    const aiResults = await processQuestionsWithAI(extractedText);
    
    // 5. Salvar questões no banco
    await saveQuestionsToDatabase(aiResults.questions, pdfId);
    
    console.log('\n✓ Processo completo finalizado com sucesso!');
    
  } catch (error) {
    console.error('\n✗ Erro durante o processamento:', error);
    process.exit(1);
  }
}

main();
