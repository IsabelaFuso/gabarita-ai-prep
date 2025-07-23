
import dotenv from 'dotenv';
dotenv.config(); // Carrega as variáveis do .env para process.env

import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Tool, FunctionDeclaration } from '@google/generative-ai';

const app = express();

// More robust CORS configuration
app.use(cors({
  origin: '*', // Allow any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow specific methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
}));

app.use(express.json());

// Initialize Supabase Admin Client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

// 3. Explain Question Tool
const explainQuestion: FunctionDeclaration = {
  name: "explainQuestion",
  description: "Fornece uma explicação detalhada para uma questão de múltipla escolha, incluindo a justificativa da resposta correta e por que as outras opções estão incorretas.",
  parameters: {
    type: "OBJECT",
    properties: {
      questionText: {
        type: "STRING",
        description: "O texto completo da questão.",
      },
      options: {
        type: "ARRAY",
        items: { type: "STRING" },
        description: "As opções de resposta da questão.",
      },
      correctAnswer: {
        type: "STRING",
        description: "A resposta correta da questão.",
      },
      userAnswer: {
        type: "STRING",
        description: "A resposta que o usuário forneceu (se houver).",
      },
    },
    required: ["questionText", "options", "correctAnswer"],
  },
};

// 4. Provide Hint Tool
const provideHint: FunctionDeclaration = {
  name: "provideHint",
  description: "Oferece uma dica para ajudar o aluno a resolver uma questão, sem revelar a resposta diretamente.",
  parameters: {
    type: "OBJECT",
    properties: {
      questionText: {
        type: "STRING",
        description: "O texto completo da questão para a qual a dica é solicitada.",
      },
      options: {
        type: "ARRAY",
        items: { type: "STRING" },
        description: "As opções de resposta da questão.",
      },
    },
    required: ["questionText", "options"],
  },
};

// 5. Analyze Quiz Performance Tool
const analyzeQuizPerformance: FunctionDeclaration = {
  name: "analyzeQuizPerformance",
  description: "Analisa o desempenho do usuário em um quiz ou simulado, identificando pontos fortes, fracos e sugerindo tópicos para revisão.",
  parameters: {
    type: "OBJECT",
    properties: {
      quizResults: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            questionText: { type: "STRING" },
            userAnswer: { type: "STRING" },
            correctAnswer: { type: "STRING" },
            isCorrect: { type: "BOOLEAN" },
          },
          required: ["questionText", "userAnswer", "correctAnswer", "isCorrect"],
        },
        description: "Um array de objetos, cada um contendo o texto da questão, a resposta do usuário, a resposta correta e se a resposta do usuário estava correta.",
      },
    },
    required: ["quizResults"],
  },
};

const tools: Tool[] = [{
    functionDeclarations: [getUserPerformanceSummary, searchYouTube, explainQuestion, provideHint, analyzeQuizPerformance],
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

const explainQuestionLogic = async (questionText: string, options: string[], correctAnswer: string, userAnswer?: string) => {
  // This would ideally use a more sophisticated AI call to explain.
  // For now, a simple mock explanation.
  let explanation = `A resposta correta para a questão "${questionText}" é "${correctAnswer}".`;
  if (userAnswer && userAnswer !== correctAnswer) {
    explanation += ` Você respondeu "${userAnswer}", que está incorreta.`;
  }
  explanation += ` As opções eram: ${options.join(", ")}.`;
  explanation += ` A justificativa é que ${correctAnswer} é a única opção que se alinha com o conceito principal da questão.`;
  return { explanation };
};

const provideHintLogic = async (questionText: string, options: string[]) => {
  // This would ideally use a more sophisticated AI call to provide a hint.
  // For now, a simple mock hint.
  return { hint: `Pense cuidadosamente sobre o tópico principal da questão "${questionText}" e como cada opção se relaciona a ele.` };
};

const analyzeQuizPerformanceLogic = async (quizResults: any[]) => {
  // This would ideally use a more sophisticated AI call to analyze performance.
  // For now, a simple mock analysis.
  const correctCount = quizResults.filter(r => r.isCorrect).length;
  const totalQuestions = quizResults.length;
  const percentage = (correctCount / totalQuestions) * 100;

  let feedback = `Você acertou ${correctCount} de ${totalQuestions} questões (${percentage.toFixed(2)}%).`;
  if (percentage < 60) {
    feedback += " Parece que você precisa revisar alguns tópicos. Foco nas questões que você errou.";
  } else if (percentage < 80) {
    feedback += " Bom trabalho! Continue praticando para melhorar ainda mais.";
  } else {
    feedback += " Excelente desempenho! Você demonstrou um ótimo domínio do conteúdo.";
  }
  return { analysis: feedback };
};

// --- API ENDPOINT ---

app.post('/api/tutor', async (req, res) => {
  const { history, context, userMessage, userId } = req.body;

  console.log("API Tutor: Received request.");
  console.log("Context Type Received:", context?.type); // Add this log
  console.log("Context:", JSON.stringify(context, null, 2));
  console.log("User Message:", userMessage);
  console.log("User ID:", userId);

  if (!history || !userId || !context) {
    console.error("API Tutor: Missing required fields.");
    return res.status(400).json({ error: 'Histórico, userId e contexto são obrigatórios.' });
  }

  // --- Direct tool call for quiz results analysis ---
  if (context.type === "quizResults") {
    console.log("API Tutor: Directly calling analyzeQuizPerformanceLogic for quiz results.");
    const analysisResult = await analyzeQuizPerformanceLogic(context.quizResults);
    res.json({ message: analysisResult.analysis });
    return;
  }
  // --- End of direct tool call ---

  let tutorPersona = `
    Você é o "Tutor Gabarita-Prep", um assistente de estudos amigável e prestativo. Seu objetivo é ajudar os alunos a se prepararem para o vestibular, fornecendo explicações, dicas e análises de desempenho. Você tem acesso a ferramentas para buscar informações no banco de dados e no YouTube.
  `;

  let promptForAI = userMessage || 'Olá';

  // Adjust persona and prompt based on context type
  if (context.type === "redacao") {
    tutorPersona += `\nO contexto atual é uma redação sobre o tema: "${context.tema}" e instrução: "${context.instrucao}". Ajude o aluno a estruturar a redação, gerar ideias para argumentos e propostas de intervenção, sem escrever o texto por ele.`;
  } else if (context.type === "question") {
    tutorPersona += `\nO contexto atual é uma questão de múltipla escolha. A questão é: "${context.questionText}". As opções são: ${context.options.join(", ")}.`;
    if (context.userAnswer) {
      tutorPersona += ` O aluno respondeu: "${context.userAnswer}".`;
    }
    // If no specific user message, prompt for hint/explanation
    if (!userMessage) {
      promptForAI = `Com base na questão e nas opções, você pode me dar uma dica ou explicar a resposta?`;
    }
  }
  // Note: quizResults context is now handled directly above, so no need for it here

  console.log("Generated promptForAI:", promptForAI);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: tutorPersona,
    tools: tools,
  });

  const chat = model.startChat({
    history: history.length > 1 ? history.slice(0, -1) : [],
  });

  let geminiMessage = userMessage;

  console.log("API Tutor: Sending to Gemini:", JSON.stringify(geminiMessage, null, 2));

  const result = await chat.sendMessage(geminiMessage);

  const response = result.response;

  console.log("API Tutor: Received response from Gemini.");
  console.log("API Tutor: Response text:", response.text());
  console.log("API Tutor: Function calls detected:", response.functionCalls());

  const functionCalls = response.functionCalls();
  if (functionCalls) {
    for (const call of functionCalls) {
      console.log(`API Tutor: Executing tool: ${call.name} with args:`, JSON.stringify(call.args, null, 2));
      let apiResponse;
      if (call.name === 'getUserPerformanceSummary') {
        const { userId } = call.args;
        apiResponse = await getPerformanceData(userId);
      } else if (call.name === 'searchYouTube') {
        const { query } = call.args;
        apiResponse = await searchYouTubeVideos(query);
      } else if (call.name === 'explainQuestion') {
        const { questionText, options, correctAnswer, userAnswer } = call.args;
        apiResponse = await explainQuestionLogic(questionText, options, correctAnswer, userAnswer);
      } else if (call.name === 'provideHint') {
        const { questionText, options } = call.args;
        apiResponse = await provideHintLogic(questionText, options);
      } else if (call.name === 'analyzeQuizPerformance') {
        const { quizResults } = call.args;
        apiResponse = await analyzeQuizPerformanceLogic(quizResults);
      }

      console.log(`API Tutor: Tool ${call.name} returned:`, JSON.stringify(apiResponse, null, 2));

      const result2 = await chat.sendMessage([
        {
          functionResponse: {
            name: call.name,
            response: apiResponse,
          },
        },
      ]);
      console.log("API Tutor: Final response after tool call:", result2.response.text());
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
