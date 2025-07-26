
import dotenv from 'dotenv';
dotenv.config(); // Carrega as variáveis do .env para process.env

import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Tool, FunctionDeclaration } from '@google/generative-ai';
import axios from 'axios';

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
  description: "Fornece uma explicação detalhada para uma questão de múltipla escolha, incluindo a justificativa da resposta correta e por que as outras opções estão incorretas. Usado quando o aluno pede a explicação completa.",
  parameters: {
    type: "OBJECT",
    properties: {
      questionText: { type: "STRING", description: "O texto completo da questão." },
      options: { type: "ARRAY", items: { type: "STRING" }, description: "As opções de resposta da questão." },
      correctAnswerIndex: { type: "NUMBER", description: "O índice da resposta correta." },
      explanation: { type: "STRING", description: "A explicação pré-existente no banco de dados para a questão." },
    },
    required: ["questionText", "options", "correctAnswerIndex", "explanation"],
  },
};

// 4. Provide Hint Tool
const provideHint: FunctionDeclaration = {
  name: "provideHint",
  description: "Oferece uma dica ou um caminho para resolver uma questão, sem revelar a resposta diretamente. Deve guiar o aluno a pensar.",
  parameters: {
    type: "OBJECT",
    properties: {
      questionText: { type: "STRING", description: "O texto completo da questão para a qual a dica é solicitada." },
      topic: { type: "STRING", description: "O tópico principal da questão para focar a dica." },
    },
    required: ["questionText", "topic"],
  },
};

// 5. Analyze Quiz Performance Tool
const analyzeQuizPerformance: FunctionDeclaration = {
  name: "analyzeQuizPerformance",
  description: "Analisa o desempenho detalhado do usuário em um quiz ou simulado, identificando matérias e tópicos com maior dificuldade para sugerir um plano de estudos. Esta ferramenta deve ser usada quando o contexto for 'quizResults'.",
  parameters: {
    type: "OBJECT",
    properties: {
      quizResults: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            question: { type: "OBJECT", description: "O objeto completo da questão, incluindo matéria e tópico." },
            userAnswer: { type: "STRING" },
            isCorrect: { type: "BOOLEAN" },
          },
          required: ["question", "userAnswer", "isCorrect"],
        },
        description: "Um array de objetos, cada um contendo a questão completa, a resposta do usuário e se a resposta estava correta.",
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
  const youtubeApiKey = process.env.YOUTUBE_API_KEY;
  if (!youtubeApiKey || youtubeApiKey === 'SUA_CHAVE_API_AQUI') {
    console.error("YouTube API Key not configured.");
    return { error: "A busca de vídeos não está configurada." };
  }

  const searchUrl = `https://www.googleapis.com/youtube/v3/search`;
  const videosUrl = `https://www.googleapis.com/youtube/v3/videos`;

  try {
    // Etapa 1: Buscar por vídeos candidatos (custo: 100 unidades)
    const searchResponse = await axios.get(searchUrl, {
      params: {
        part: 'snippet',
        q: `${query} aula documentário resumo`,
        type: 'video',
        maxResults: 5,
        key: youtubeApiKey,
        relevanceLanguage: 'pt',
      },
    });

    if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
      return { foundVideo: false, reason: "Nenhum vídeo encontrado na busca." };
    }

    // Etapa 2: Filtrar por relevância e verificar o status real de cada um
    const keywords = ['aula', 'documentário', 'resumo', 'explicação', 'história', ...query.toLowerCase().split(' ')];
    
    for (const item of searchResponse.data.items) {
      const title = item.snippet.title.toLowerCase();
      const videoId = item.id.videoId;

      // Pula para o próximo se o título não for relevante
      const isRelevant = keywords.some(keyword => title.includes(keyword));
      if (!isRelevant) {
        continue;
      }

      // Etapa 3: Verificar o status do vídeo relevante (custo: 1 unidade)
      const videoDetailsResponse = await axios.get(videosUrl, {
        params: { part: 'status', id: videoId, key: youtubeApiKey },
      });

      const videoStatus = videoDetailsResponse.data.items[0]?.status;

      // Se o vídeo for público, incorporável e não deletado, encontramos nosso vencedor!
      if (videoStatus && videoStatus.privacyStatus === 'public' && videoStatus.embeddable && videoStatus.uploadStatus !== 'deleted') {
         return {
           foundVideo: true,
           videoId,
           title: item.snippet.title,
           url: `https://www.youtube.com/watch?v=${videoId}`,
         };
      }
    }

    // Se o loop terminar sem encontrar um vídeo válido
    return { foundVideo: false, reason: "Não encontrei um vídeo relevante e disponível que possa ser incorporado." };

  } catch (error) {
    console.error("Error searching YouTube:", error);
    return { error: "Erro ao buscar vídeo no YouTube." };
  }
};

const explainQuestionLogic = async (questionText: string, options: string[], correctAnswerIndex: number, explanation: string) => {
  // A IA agora pode usar a explicação existente para dar uma resposta mais rica.
  const correctAnswer = options[correctAnswerIndex];
  let fullExplanation = `A resposta correta é a alternativa "${correctAnswer}".\n\n**Justificativa:**\n${explanation}`;
  return { explanation: fullExplanation };
};

const provideHintLogic = async (questionText: string, topic: string) => {
  // A IA pode usar o tópico para dar uma dica mais focada.
  return { hint: `Para resolver esta questão, concentre-se no conceito de **${topic}**. Tente lembrar das regras ou fórmulas principais relacionadas a ele. Qual o primeiro passo que você daria?` };
};

const analyzeQuizPerformanceLogic = async (quizResults: any[]) => {
  const errors = quizResults.filter(r => !r.isCorrect);
  const correctCount = quizResults.length - errors.length;
  const totalQuestions = quizResults.length;
  const percentage = (correctCount / totalQuestions) * 100;

  const topicsToReview: Record<string, { count: number, subject: string }> = {};
  errors.forEach(error => {
    const topic = error.question.topic;
    const subject = error.question.subject;
    if (!topicsToReview[topic]) {
      topicsToReview[topic] = { count: 0, subject: subject };
    }
    topicsToReview[topic].count++;
  });

  // Ordena os tópicos por contagem de erros
  const sortedTopics = Object.entries(topicsToReview)
    .sort(([, a], [, b]) => b.count - a.count)
    .map(([topic, data]) => ({ topic, subject: data.subject, errors: data.count }));

  let feedback = `Você acertou ${correctCount} de ${totalQuestions} questões (${percentage.toFixed(1)}%).\n\n`;
  if (sortedTopics.length > 0) {
    feedback += "Aqui estão os tópicos que mais precisam da sua atenção, baseados nos seus erros:\n";
    sortedTopics.forEach(item => {
      feedback += `- **${item.topic}** (em ${item.subject}): ${item.errors} erro(s)\n`;
    });
  } else {
    feedback += "Parabéns, você não errou nenhuma questão! Excelente desempenho!";
  }

  return {
    analysis: feedback,
    topicsForReview: sortedTopics, // Retorna a lista estruturada para a IA
  };
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

  let basePersona = `
    Você é o "Tutor Gabarita-Prep", um assistente de estudos amigável, motivador e prestativo. Seu principal objetivo é ajudar os alunos a se prepararem para o vestibular de forma interativa e personalizada.

    **Ferramentas Especiais:**
    - Você pode buscar resumos de desempenho geral no banco de dados.
    - Você DEVE usar a ferramenta 'searchYouTube' sempre que um aluno pedir ajuda em um tópico que possa ser explicado com um vídeo.
    - Você pode analisar os resultados de um quiz para criar um plano de estudos.

    **Instrução Crítica para Vídeos:**
    Quando a ferramenta 'searchYouTube' retornar um resultado com 'foundVideo: true', formule uma resposta amigável para o aluno. Na sua resposta, é OBRIGATÓRIO incluir a seguinte tag para que a interface mostre o vídeo: [YOUTUBE_VIDEO](videoId, "title")
    Use o 'videoId' e o 'title' exatos retornados pela ferramenta.
  `;

  let contextSpecificInstruction = "";
  // Adjust persona and prompt based on context type
  if (context.type === "redacao") {
    contextSpecificInstruction = `\nO contexto atual da conversa é uma redação sobre o tema: "${context.tema}". Ajude o aluno a estruturar o texto, mas continue pronto para usar suas outras ferramentas se ele pedir.`;
  } else if (context.type === "question") {
    const topic = context.topic || "tópico desconhecido";
    const subject = context.subject || "matéria desconhecida";
    contextSpecificInstruction = `
      \n**Contexto Crítico: Ajuda em uma Questão**
      O aluno está resolvendo uma questão e pediu sua ajuda. A questão é sobre o tópico "${topic}" da matéria de "${subject}".
      Sua tarefa é ser um **guia pedagógico**, não uma folha de respostas.
      1.  **NUNCA** dê a resposta correta de primeira.
      2.  Comece perguntando o que o aluno já tentou ou qual é a sua principal dúvida sobre a questão.
      3.  Use a ferramenta 'provideHint' para dar uma dica focada no tópico da questão.
      4.  Se o aluno continuar com dificuldades, faça perguntas que o ajudem a raciocinar. Ex: "Qual das alternativas parece mais relacionada ao conceito de ${topic}?", "Vamos analisar a alternativa C, por que você acha que ela poderia estar certa ou errada?".
      5.  Use a ferramenta 'explainQuestion' **APENAS** se o aluno explicitamente pedir a resposta e a explicação completa.
      6.  Se o aluno pedir um vídeo sobre o assunto, use a ferramenta 'searchYouTube' com o tópico da questão.
    `;
  } else if (context.type === "quizResults") {
    contextSpecificInstruction = `
      **Contexto Crítico: Análise de Simulado**
      O aluno acabou de completar um simulado. A ferramenta 'analyzeQuizPerformance' JÁ FOI EXECUTADA e o resumo está disponível.
      Sua tarefa é iniciar a conversa de forma proativa e engajadora:
      1.  Apresente o resumo da análise de forma clara e amigável. Use os dados de acertos e a lista de tópicos para revisar.
      2.  **SEMPRE** seja encorajador, mesmo que o resultado seja baixo. Diga que erros são oportunidades de aprendizado.
      3.  **SEMPRE** termine sua primeira mensagem com uma pergunta aberta, convidando o aluno a criar um plano de estudos. Ex: "O que você acha de montarmos um plano de revisão focado nesses pontos? Por qual tópico você gostaria de começar?".
      4.  Esteja pronto para usar a ferramenta 'searchYouTube' se o aluno pedir uma videoaula sobre um dos tópicos listados.
      5.  Esteja pronto para oferecer um novo quiz focado nos tópicos de dificuldade se o aluno pedir para praticar mais.
    `;
  }

  const tutorPersona = basePersona + contextSpecificInstruction;

  let promptForAI = userMessage || 'Olá';

  // If no specific user message in question context, prompt for hint/explanation
  if (context.type === "question" && !userMessage) {
      const topic = context.topic || "desconhecido";
      const alternatives = (context.options || []).map((opt: string, i: number) => `- ${String.fromCharCode(65 + i)}: ${opt}`).join('\n');
      promptForAI = `
        Estou com dúvida na seguinte questão sobre "${topic}" e gostaria de uma ajuda para começar. Não me dê a resposta, apenas uma dica.

        **Questão:** ${context.questionText || 'Não informado'}
        **Alternativas:**
        ${alternatives}
      `;
  } else if (context.type === 'quizResults' && !userMessage) {
      // Primeira mensagem após o quiz é gerada pela IA com base na análise
      promptForAI = `Por favor, analise os resultados do meu simulado e inicie a conversa.`;
  }
  // Note: quizResults context is now handled directly above, so no need for it here

  console.log("Generated promptForAI:", promptForAI);
  console.log("Generated System Persona:", tutorPersona);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: tutorPersona,
    tools: tools,
  });

  const chat = model.startChat({
    history: history.length > 1 ? history.slice(0, -1) : [],
  });

  let geminiMessage = userMessage;

  // For quiz results, the initial "message" is the context itself for the tool
  if (context.type === 'quizResults' && !userMessage) {
      geminiMessage = "Analise estes resultados de quiz, por favor.";
  }

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
        // A resposta da função agora é um objeto estruturado
        const youtubeResult = await searchYouTubeVideos(query);
        // A IA usará este objeto para construir a frase final
        apiResponse = youtubeResult;
      } else if (call.name === 'explainQuestion') {
        const { questionText, options, correctAnswer, userAnswer } = call.args;
        apiResponse = await explainQuestionLogic(questionText, options, correctAnswer, userAnswer);
      } else if (call.name === 'provideHint') {
        const { questionText, options } = call.args;
        apiResponse = await provideHintLogic(questionText, options);
      } else if (call.name === 'analyzeQuizPerformance') {
        // A chamada da ferramenta agora usa o contexto diretamente
        apiResponse = await analyzeQuizPerformanceLogic(context.quizResults);
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
