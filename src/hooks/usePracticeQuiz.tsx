import { useState } from "react";
import { type Question } from "@/data/questionsBank";

export const usePracticeQuiz = (generateQuestions: (count?: number, excludeUsed?: boolean) => Question[]) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [practiceQuestions, setPracticeQuestions] = useState<Question[]>([]);
  const [showQuestions, setShowQuestions] = useState(false);

  const handleAnswer = (selectedIndex: number) => {
    const isCorrect = selectedIndex === practiceQuestions[currentQuestionIndex].correctAnswer;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < practiceQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setShowExplanation(false);
    setScore({ correct: 0, total: 0 });
    const newQuestions = generateQuestions(10);
    setPracticeQuestions(newQuestions);
  };

  const startPractice = () => {
    const newQuestions = generateQuestions(10);
    setPracticeQuestions(newQuestions);
    setShowQuestions(true);
    setCurrentQuestionIndex(0);
    setShowExplanation(false);
    setScore({ correct: 0, total: 0 });
  };

  return {
    currentQuestionIndex,
    showExplanation,
    score,
    practiceQuestions,
    showQuestions,
    handleAnswer,
    nextQuestion,
    resetQuiz,
    startPractice,
    setShowQuestions
  };
};