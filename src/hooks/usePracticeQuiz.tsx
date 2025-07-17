import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { type Question } from "@/data/types";

const fetchPersonalizedQuestions = async (userId: string, count: number): Promise<Question[]> => {
  const { data, error } = await supabase.rpc('get_personalized_questions', {
    p_user_id: userId,
    p_count: count,
  });

  if (error) {
    console.error("Error fetching personalized questions:", error);
    throw error;
  }

  const formattedQuestions: Question[] = data.map((q: any) => ({
    id: q.question_id,
    statement: q.statement,
    alternatives: q.alternatives,
    correctAnswer: q.alternatives.findIndex((alt: string) => alt === q.correct_answer),
    explanation: q.explanation,
    subject: q.subject_name,
    topic: q.topic_name,
    institution: q.institution_name,
    year: q.year,
  }));

  return formattedQuestions;
};

export const usePracticeQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [practiceQuestions, setPracticeQuestions] = useState<Question[]>([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startPractice = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Usuário não autenticado. Faça login para praticar.");
        setLoading(false);
        return;
      }
      const newQuestions = await fetchPersonalizedQuestions(user.id, 10);
      setPracticeQuestions(newQuestions);
      setShowQuestions(true);
      setCurrentQuestionIndex(0);
      setShowExplanation(false);
      setScore({ correct: 0, total: 0 });
    } catch (err) {
      setError("Não foi possível carregar as questões. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAnswer = async (selectedIndex: number) => {
    const question = practiceQuestions[currentQuestionIndex];
    const isCorrect = selectedIndex === question.correctAnswer;

    // Update UI state immediately
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
    setShowExplanation(true);

    // Save attempt to the database in the background
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn("User not authenticated. Cannot save attempt.");
        return;
      }

      const { error: insertError } = await supabase
        .from('user_attempts')
        .insert({
          user_id: user.id,
          question_id: question.id,
          user_answer: question.alternatives[selectedIndex],
          is_correct: isCorrect,
          context: 'pratica'
        });

      if (insertError) {
        throw insertError;
      }
    } catch (err) {
      console.error("Failed to save user attempt:", err);
      // Optionally, inform the user that the attempt could not be saved
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < practiceQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
    }
  };

  const resetQuiz = useCallback(() => {
    startPractice();
  }, [startPractice]);

  return {
    currentQuestionIndex,
    showExplanation,
    score,
    practiceQuestions,
    showQuestions,
    loading,
    error,
    handleAnswer,
    nextQuestion,
    resetQuiz,
    startPractice,
    setShowQuestions
  };
};

export default usePracticeQuiz;
