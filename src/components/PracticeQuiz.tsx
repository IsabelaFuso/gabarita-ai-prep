import { QuestionCard } from "@/components/QuestionCard";
import { type Question } from "@/data/questionsBank";

interface PracticeQuizProps {
  currentQuestionIndex: number;
  showExplanation: boolean;
  score: { correct: number; total: number };
  practiceQuestions: Question[];
  onAnswer: (selectedIndex: number) => void;
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
  return (
    <div className="space-y-6">
      {/* Current Session Progress */}
      {score.total > 0 && (
        <div className="bg-card p-4 rounded-lg border shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Progresso: {score.total}/{practiceQuestions.length} questões
            </span>
            <span className="text-sm font-medium">
              {Math.round((score.correct / score.total) * 100)}% de acerto
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${(score.total / practiceQuestions.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {practiceQuestions.length > 0 && (
        <QuestionCard
          question={practiceQuestions[currentQuestionIndex]}
          onAnswer={onAnswer}
          showExplanation={showExplanation}
          onNext={onNext}
          isLastQuestion={currentQuestionIndex === practiceQuestions.length - 1}
          onReset={onReset}
        />
      )}
    </div>
  );
};