import { useState, useEffect } from 'react';
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

  // Efeito para iniciar a conversa proativamente
  useEffect(() => {
    const startProactiveChat = () => {
      if (!user) return;
      // Only start proactive chat if the context is question or quizResults
      if (context?.type === 'quizResults' || context?.type === 'question') {
        setLoading(true);
        setError(null);
        setHistory([]); // Limpa o histórico para uma nova análise/questão

        // A mensagem inicial é vazia para acionar a lógica proativa do backend
        sendMessage('', context, true);
      }
    };
    startProactiveChat();
  }, [user, context.type, context.questionId]); // Re-inicia quando o tipo ou ID da questão muda, or when user logs in

  const sendMessage = async (message: string, currentContext: Record<string, any>, isProactive = false) => {
    if (!user) {
      setError("Usuário não autenticado.");
      return;
    }

    setLoading(true);
    setError(null);

    let updatedHistory = [...history];
    if (!isProactive) {
      const newUserMessage: TutorMessage = { role: 'user', parts: [{ text: message }] };
      updatedHistory.push(newUserMessage);
      setHistory(updatedHistory);
    }

    const payload = {
      // Garante que o histórico enviado para a API sempre comece com 'user' se não estiver vazio
      history: updatedHistory.length > 0 && updatedHistory[0].role === 'model' ? updatedHistory.slice(1) : updatedHistory,
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
        const errorBody = await response.text();
        console.error("Erro do servidor:", errorBody);
        throw new Error('Falha na comunicação com o servidor do tutor.');
      }

      const data = await response.json();
      
      // Adiciona a resposta do modelo (IA) ao histórico
      const modelMessage: TutorMessage = { role: 'model', parts: [{ text: data.message }] };
      
      // If the history was empty (proactive start), the first message is the model's response
      if (isProactive) {
          setHistory([modelMessage]);
      } else {
          setHistory([...updatedHistory, modelMessage]);
      }

    } catch (err) {
      console.error("Error sending message:", err);
      const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
      setError(errorMessage);
      // Opcional: reverte a adição da mensagem do usuário se a chamada falhar
      if (!isProactive) {
        setHistory(history);
      }
    } finally {
      setLoading(false);
    }
  };

  return { history, loading, error, sendMessage };
};