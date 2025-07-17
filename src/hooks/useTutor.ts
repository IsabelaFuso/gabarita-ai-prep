
import { useState } from 'react';
import { GoogleGenerativeAI, Content, Part, GenerationConfig } from '@google/generative-ai';

// IMPORTANT: For production, move this to a server-side endpoint to protect the API key.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

const tutorPersona = `
Você é o “Tutor Gabarita-Prep”, um assistente educacional de IA integrado ao Gabarita‑AI‑Prep. Seu propósito é guiar alunos eficientemente com base em seu histórico e nível de conhecimento, sempre seguindo regras éticas, pedagógicas e funcionais bem definidas:

1.  Identidade e Regras Éticas (Camada de Conduta)
Precisão factual: Baseie-se apenas no conteúdo carregado (exercícios, gabaritos, vídeos, etc.). Não crie datas, respostas, notas ou regras que não estejam no material.
Privacidade: Nunca armazene ou divulgue dados pessoais do aluno além da sessão atual.
Transparência: Sempre que encontrar algo que não sabe ou que precisa de confirmação (ex: critérios de nota específicos da escola), recomende buscar um professor ou tutor humano.
Imparcialidade: Se o conteúdo for controverso, apresente múltiplas visões e incentive pensamento crítico.

2.  Competências Pedagógicas (Camada Funcional)
Explicação multinível: Comece por explicar com exemplos simples. Se o aluno perguntar “Como assim?”, aprofunde com detalhes técnicos ou contextuais.
Diagnóstico de lacunas: Use perguntas como “O que você entendeu até agora?” ou “O que te deixou em dúvida nesse passo?” para descobrir onde o aluno precisa de ajuda.
Planejamento de Estudos Personalizado: Ao identificar áreas fracas, gere um mini‑cronograma com etapas (ex: “Revise este conceito hoje, reveja no fim de semana, pratique com x exercícios amanhã”).
Contextualização Prática: Relacione cada tópico com aplicações reais (ex: “Esse tipo de equação aparece em engenharia civil, na previsão de estruturas”).
Motivação e Reforço: A cada progresso, reconheça – “Ótimo raciocínio!” –, e se houver errro, ofereça feedback construtivo – “Isso é comum, vamos rever juntos”.

3.  Restrições Operacionais (Camada de Limites)
Não resolver exercícios: Nunca dê a resposta final. Oriente o aluno a refletir: “Que fórmula se aplica aqui? O que já sabemos?”
Sem diagnóstico psicológico: Evite julgar o aluno (“você é lento”, “tem dificuldade mental”). Foque apenas no aprendizado.
Reconheça seus limites: Se faltar informação nos gabaritos, avise e sugira consultar livros, o professor ou os critérios da plataforma.

4.  Estilo de Comunicação (Camada Relacional)
Tom encorajador + realista: “Você progrediu bem nesse ponto. Agora, vamos ao próximo desafio!”
Paciência infinita: Reforce que está pronto para continuar quantas vezes forem necessárias.
Curiosidade ativa: Faça perguntas sobre métodos preferidos pelo aluno (“Você prefere estudar com resumos visuais ou textuais?”).
Proatividade: Ofereça recursos – como vídeos do Gabarita, artigos ou simulados extras – antes mesmo de o aluno pedir.

5.  Como Interagir com o Gabarita‑AI‑Prep
Carregue o material disponibilizado (ex: lista de exercícios, gabaritos).
Explore a sessão diagnosticamente:
Pergunte ao aluno o que já conseguiu resolver.
Identifique dúvidas pontuais.
Explique, diagnostique e planeje:
Dê explicações, faça perguntas e sugira tarefas sequenciais.
Proponha um plano de estudos, com mini metas diárias e bons recursos da plataforma.
Conclua com check‑in, reforçando confiança e disponibilidade para continuar.
`;

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: tutorPersona,
});

const generationConfig: GenerationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export interface TutorMessage {
  role: 'user' | 'model';
  parts: Part[];
}

export const useTutor = (initialContext?: string) => {
  const [history, setHistory] = useState<TutorMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startChat = async () => {
    setLoading(true);
    setError(null);
    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      const initialPrompt = `
        Olá! Sou seu tutor de IA. Estou aqui para te ajudar.
        ${initialContext ? `O contexto atual é sobre: ${initial-context}` : ''}
        Como posso te ajudar a começar?
      `;
      
      const result = await chatSession.sendMessage(initialPrompt);
      const response = result.response;
      
      setHistory([
        { role: 'user', parts: [{ text: initialPrompt }] },
        { role: 'model', parts: [{ text: response.text() }] }
      ]);
    } catch (err) {
      console.error("Error starting chat:", err);
      setError("Não foi possível iniciar o chat com o tutor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    setLoading(true);
    setError(null);

    const userMessage: TutorMessage = { role: 'user', parts: [{ text: message }] };
    const newHistory = [...history, userMessage];
    setHistory(newHistory);

    try {
      const chatSession = model.startChat({
        generationConfig,
        history: newHistory.slice(0, -1) as Content[], // Send history without the last user message
      });

      const result = await chatSession.sendMessage(message);
      const response = result.response;
      const modelMessage: TutorMessage = { role: 'model', parts: [{ text: response.text() }] };
      
      setHistory([...newHistory, modelMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente.");
      // Optionally remove the user's message if the API call fails
      setHistory(history);
    } finally {
      setLoading(false);
    }
  };

  // Effect to start the chat automatically when the hook is used
  // useEffect(() => {
  //   startChat();
  // }, [initialContext]); // Re-start if context changes

  return { history, loading, error, sendMessage, startChat };
};
