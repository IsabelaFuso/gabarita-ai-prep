
import { useState } from 'react';
import { useAuth } from './useAuth';

// Define a estrutura da mensagem do chat
export interface TutorMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

// O hook principal que gerencia o estado e a comunicação do chat
export const useTutor = (initialContext: string) => {
  const { user } = useAuth(); // Pega o usuário logado do contexto de autenticação
  const [history, setHistory] = useState<TutorMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (message: string) => {
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

    try {
      // Envia o histórico e o contexto para o nosso backend
      const response = await fetch('http://localhost:3001/api/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          history: updatedHistory,
          userId: user.id, // Envia o ID do usuário para o backend
          initialContext: message, // A mensagem atual do usuário é o contexto
        }),
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
  
  // Função para iniciar o chat com uma mensagem de boas-vindas
  const startChat = () => {
      const welcomeMessage: TutorMessage = {
          role: 'model',
          parts: [{ text: `Olá! Sou seu tutor de IA. O contexto da nossa conversa é: "${initialContext}". Como posso te ajudar?` }]
      };
      setHistory([welcomeMessage]);
  };

  return { history, loading, error, sendMessage, startChat };
};
