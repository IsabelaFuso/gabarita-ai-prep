import { QuestionCard } from "@/components/QuestionCard";
import { type Question } from "@/data/questionsBank";
import { useState } from 'react';
import { TutorView } from '@/components/TutorView';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from '@/components/ui/button';
import { BrainCircuit } from 'lucide-react';

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
  const [isTutorOpen, setIsTutorOpen] = useState(false);

  const currentQuestion = practiceQuestions[currentQuestionIndex];

  const tutorContext = {
    type: "question",
    questionText: currentQuestion?.question || '',
    options: currentQuestion?.options.map(opt => opt.text) || [],
    correctAnswer: currentQuestion?.options.find(opt => opt.isCorrect)?.text || '',
    // userAnswer: showExplanation ? currentQuestion?.options[currentQuestion?.userAnswerIndex]?.text : undefined,
  };

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
          question={currentQuestion}
          onAnswer={onAnswer}
          showExplanation={showExplanation}
          onNext={onNext}
          isLastQuestion={currentQuestionIndex === practiceQuestions.length - 1}
          onReset={onReset}
        />
      )}

      {currentQuestion && (
        <Collapsible open={isTutorOpen} onOpenChange={setIsTutorOpen} className="mt-6">
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full flex items-center gap-2">
              <BrainCircuit className="w-4 h-4" />
              {isTutorOpen ? "Fechar Tutor" : "Pedir ajuda à IA"}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <TutorView context={tutorContext} />
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};