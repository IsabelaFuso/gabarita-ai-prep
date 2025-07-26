import { QuestionCard } from "@/components/QuestionCard";
import { type Question } from "@/data/types";
import { TutorView } from '@/components/TutorView';
import { Progress } from "./ui/progress";

interface PracticeQuizProps {
  currentQuestionIndex: number;
  showExplanation: boolean;
  score: { correct: number; total: number };
  practiceQuestions: Question[];
  onAnswer: (selectedIndex: number, isCorrect: boolean) => void;
  onNext: () => void;
  onReset: () => void;
}

export const PracticeQuiz = ({
  currentQuestionIndex,
  showExplanation,
  score,
  practiceQuestions,
  onAnswer,
  onNext,
  onReset
}: PracticeQuizProps) => {
  const currentQuestion = practiceQuestions[currentQuestionIndex];

  // Contexto detalhado para o tutor de IA
  const tutorContext = {
    type: "question",
    questionId: currentQuestion?.id,
    questionText: currentQuestion?.statement,
    options: currentQuestion?.alternatives,
    subject: currentQuestion?.subject,
    topic: currentQuestion?.topic,
    explanation: currentQuestion?.explanation, // Adicionando a explicação
    // Passamos o índice da resposta correta para o backend poder construir a explicação
    correctAnswerIndex: currentQuestion?.correctAnswer,
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
        {practiceQuestions.length > 0 && (
          <QuestionCard
            question={currentQuestion}
            onAnswer={(selectedIndex) => {
              const isCorrect = selectedIndex === currentQuestion.correctAnswer;
              onAnswer(selectedIndex, isCorrect);
            }}
            showExplanation={showExplanation}
            onNext={onNext}
            isLastQuestion={currentQuestionIndex === practiceQuestions.length - 1}
            onReset={onReset}
          />
        )}
      </div>

      {/* Coluna da Direita: Tutor de IA */}
      <div className="lg:sticky lg:top-24 h-fit">
        {currentQuestion && (
          <TutorView context={tutorContext} />
        )}
      </div>
    </div>
  );
};
