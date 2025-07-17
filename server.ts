
import dotenv from 'dotenv';
dotenv.config(); // Carrega as variáveis do .env para process.env

import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Tool, FunctionDeclaration } from '@google/generative-ai';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase Admin Client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL and Service Key are required.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Gemini AI
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error('Gemini API Key is required.');
}
const genAI = new GoogleGenerativeAI(geminiApiKey);

// --- AI TOOLS DEFINITION ---

// 1. Database Query Tool
const getUserPerformanceSummary: FunctionDeclaration = {
  name: "getUserPerformanceSummary",
  description: "Busca o resumo de desempenho do usuário no banco de dados para identificar pontos fortes e fracos. Retorna uma lista de matérias e tópicos com a porcentagem de acertos.",
  parameters: {
    type: "OBJECT",
    properties: {
      userId: {
        type: "STRING",
        description: "O ID do usuário para buscar o desempenho.",
      },
    },
    required: ["userId"],
  },
};

// 2. YouTube Search Tool
const searchYouTube: FunctionDeclaration = {
    name: "searchYouTube",
    description: "Busca videoaulas no YouTube sobre um tópico específico para ajudar o aluno.",
    parameters: {
        type: "OBJECT",
        properties: {
            query: {
                type: "STRING",
                description: "O tópico ou assunto a ser pesquisado no YouTube. Ex: 'videoaula sobre Revolução Francesa'",
            },
        },
        required: ["query"],
    },
};

const tools: Tool[] = [{
    functionDeclarations: [getUserPerformanceSummary, searchYouTube],
}];

// --- TOOL IMPLEMENTATION ---

const getPerformanceData = async (userId: string) => {
  const { data, error } = await supabase.rpc('get_user_performance_summary', { p_user_id: userId });
  if (error) {
    console.error("Error fetching performance data:", error);
    return { error: "Erro ao buscar dados de desempenho." };
  }
  return data;
};

const searchYouTubeVideos = async (query: string) => {
    // In a real-world scenario, you would use the YouTube Data API.
    // For this prototype, we'll return a mocked search result.
    console.log(`Mock YouTube search for: ${query}`);
    return [
        { title: `Videoaula Completa sobre ${query}`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}` },
        { title: `Resumo Rápido de ${query}`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}+resumo` },
    ];
};


// --- API ENDPOINT ---

app.post('/api/tutor', async (req, res) => {
  const { history, initialContext, userId } = req.body;

  if (!history || !userId) {
    return res.status(400).json({ error: 'Histórico e userId são obrigatórios.' });
  }

  const tutorPersona = `
    Você é o "Tutor Gabarita-Prep"... (Sua persona completa aqui)
    Você tem acesso a duas ferramentas:
    1. 'getUserPerformanceSummary(userId)': Use esta função para ver o desempenho do aluno e fazer recomendações personalizadas.
    2. 'searchYouTube(query)': Use esta função para encontrar e recomendar vídeos do YouTube sobre um tópico.
    Seja proativo. Se um aluno está com dificuldade, verifique seu desempenho e sugira um vídeo.
  `;

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: tutorPersona,
    tools: tools,
  });

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(initialContext || 'Olá');

  const response = result.response;

  if (response.functionCalls) {
    const functionCalls = response.functionCalls;
    for (const call of functionCalls) {
      let apiResponse;
      if (call.name === 'getUserPerformanceSummary') {
        const { userId } = call.args;
        apiResponse = await getPerformanceData(userId);
      } else if (call.name === 'searchYouTube') {
        const { query } = call.args;
        apiResponse = await searchYouTubeVideos(query);
      }

      const result2 = await chat.sendMessage([
        {
          functionResponse: {
            name: call.name,
            response: apiResponse,
          },
        },
      ]);
      res.json({ message: result2.response.text() });
      return;
    }
  }
  
  res.json({ message: response.text() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor do tutor rodando na porta ${PORT}`);
});
