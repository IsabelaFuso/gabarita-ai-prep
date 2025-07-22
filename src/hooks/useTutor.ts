
import { useState } from 'react';
import { useAuth } from './useAuth';

// Define a estrutura da mensagem do chat
export interface TutorMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

// O hook principal que gerencia o estado e a comunicação do chat
export const useTutor = (context: Record<string, any>) => {
  const { user } = useAuth(); // Pega o usuário logado do contexto de autenticação
  const [history, setHistory] = useState<TutorMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState<TutorMessage | null>(null);

  const fetchQuizAnalysis = async () => {
    if (!user) {
      setError("Usuário não autenticado.");
      return;
    }
    setLoading(true);
    setError(null);
    setWelcomeMessage(null); // Ensure no welcome message is shown

    const payload = {
      history: [], // No history needed for initial analysis
      userId: user.id,
      context: context,
      userMessage: '', // No user message for initial analysis
    };

    console.log("Fetching quiz analysis from API:", payload);

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Falha ao buscar análise do simulado.');
      }

      const data = await response.json();
      const analysisMessage: TutorMessage = { role: 'model', parts: [{ text: data.message }] };
      setHistory([analysisMessage]); // Set the analysis as the first message

    } catch (err) {
      console.error("Error fetching quiz analysis:", err);
      const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message: string, currentContext: Record<string, any>) => {
    if (!user) {
      setError("Usuário não autenticado.");
      return;
    }

    setLoading(true);
    setError(null);

    // Adiciona a mensagem do usuário ao histórico local imediatamente
    const newUserMessage: TutorMessage = { role: 'user', parts: [{ text: message }] };
    const updatedHistory = [...history, newUserMessage];
    setHistory(updatedHistory);

    const payload = {
      history: updatedHistory,
      userId: user.id,
      context: currentContext,
      userMessage: message,
    };

    // Log para depuração no console do navegador
    console.log("Enviando para a API do Tutor:", payload);

    try {
      // Envia o histórico e o contexto para o nosso backend
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Falha na comunicação com o servidor do tutor.');
      }

      const data = await response.json();
      
      // Adiciona a resposta do modelo (IA) ao histórico
      const modelMessage: TutorMessage = { role: 'model', parts: [{ text: data.message }] };
      setHistory([...updatedHistory, modelMessage]);

    } catch (err) {
      console.error("Error sending message:", err);
      const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
      setError(errorMessage);
      // Opcional: reverte a adição da mensagem do usuário se a chamada falhar
      setHistory(history);
    } finally {
      setLoading(false);
    }
  };
  
  // Função para iniciar o chat
  const startChat = () => {
    if (context?.type === 'quizResults') {
      fetchQuizAnalysis();
    } else {
      const message: TutorMessage = {
          role: 'model',
          parts: [{ text: `Olá! Sou seu tutor de IA. O contexto da nossa conversa é: ${JSON.stringify(context)}. Como posso te ajudar?` }]
      };
      setWelcomeMessage(message);
      setHistory([]); // Limpa o histórico para garantir que não seja enviado
    }
  };

  return { history, loading, error, welcomeMessage, sendMessage, startChat };
};
