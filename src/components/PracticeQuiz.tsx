import { QuestionCard } from "@/components/QuestionCard";
import { type Question } from "@/data/types";
import { Progress } from "./ui/progress";

interface PracticeQuizProps {
  currentQuestionIndex: number;
  showExplanation: boolean;
  score: { correct: number; total: number };
  practiceQuestions: Question[];
  userAnswers: (string | number | null)[];
  onAnswer: (answer: string | number, isCorrect: boolean) => void;
  onNext: () => void;
  onReset: () => void;
}

export const PracticeQuiz = ({
  currentQuestionIndex,
  showExplanation,
  score,
  practiceQuestions,
  userAnswers,
  onAnswer,
  onNext,
  onReset
}: PracticeQuizProps) => {
  const currentQuestion = practiceQuestions[currentQuestionIndex];
  const userAnswer = userAnswers[currentQuestionIndex];

  const handleAnswer = (answer: string | number) => {
    let isCorrect = false;
    if (currentQuestion.type === 'summation') {
      isCorrect = answer === currentQuestion.correct_sum;
    } else {
      isCorrect = answer === currentQuestion.correct_answers.answer;
    }
    onAnswer(answer, isCorrect);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8 space-y-6 lg:space-y-0">
      {/* Coluna da Esquerda: Questão e Progresso */}
      <div className="flex flex-col gap-6">
        {/* Progresso da Sessão */}
        {score.total > 0 && (
          <div className="bg-card p-4 rounded-lg border shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Progresso: {score.total}/{practiceQuestions.length} questões
              </span>
              <span className="text-sm font-medium">
                {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}% de acerto
              </span>
            </div>
            <Progress value={(score.total / practiceQuestions.length) * 100} className="h-2" />
          </div>
        )}

        {/* Card da Questão */}
        {practiceQuestions.length > 0 && currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            showExplanation={showExplanation}
            onNext={onNext}
            isLastQuestion={currentQuestionIndex === practiceQuestions.length - 1}
            onReset={onReset}
            userAnswer={userAnswer}
          />
        )}
      </div>
    </div>
  );
};
