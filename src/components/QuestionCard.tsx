import { useState } from "react";
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Question {
  id: number;
  institution: string;
  year: number;
  subject: string;
  topic: string;
  statement: string;
  alternatives: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuestionCardProps {
  question: Question;
  onAnswer: (selectedIndex: number) => void;
  showExplanation: boolean;
  onNext: () => void;
  isLastQuestion: boolean;
  onReset: () => void;
}

export const QuestionCard = ({
  question,
  onAnswer,
  showExplanation,
  onNext,
  isLastQuestion,
  onReset,
}: QuestionCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleAnswerSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    onAnswer(index);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    onNext();
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    onReset();
  };

  const getAlternativeStyle = (index: number) => {
    if (!showExplanation) {
      return selectedAnswer === index
        ? "border-primary bg-accent"
        : "border-border hover:border-primary/50 hover:bg-accent/50";
    }

    // Show explanation styles
    if (index === question.correctAnswer) {
      return "border-success bg-success/10 text-success-foreground";
    }
    if (selectedAnswer === index && index !== question.correctAnswer) {
      return "border-destructive bg-destructive/10 text-destructive-foreground";
    }
    return "border-muted bg-muted/30";
  };

  const getAlternativeIcon = (index: number) => {
    if (!showExplanation) return null;
    
    if (index === question.correctAnswer) {
      return <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />;
    }
    if (selectedAnswer === index && index !== question.correctAnswer) {
      return <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />;
    }
    return null;
  };

  return (
    <Card className="shadow-elevated">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{question.institution} {question.year}</Badge>
            <Badge variant="secondary">{question.subject}</Badge>
            <Badge variant="secondary">{question.topic}</Badge>
          </div>
        </div>
        <CardTitle className="text-xl leading-relaxed">{question.statement}</CardTitle>
        {question.image && (
          <div className="mt-4">
            <img 
              src={question.image} 
              alt={`Imagem da questão ${question.id}`} 
              className="max-w-full mx-auto rounded-lg border"
            />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Alternatives */}
        <div className="space-y-3">
          {question.alternatives.map((alternative, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showExplanation}
              className={cn(
                "w-full p-4 text-left rounded-lg border-2 transition-all duration-200",
                "flex items-center gap-3 min-h-[60px]",
                getAlternativeStyle(index),
                showExplanation ? "cursor-default" : "cursor-pointer"
              )}
            >
              <span className="flex-shrink-0 w-6 h-6 bg-muted rounded-full flex items-center justify-center text-sm font-medium">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1">{alternative}</span>
              {getAlternativeIcon(index)}
            </button>
          ))}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="bg-accent p-4 rounded-lg border">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-primary mb-2">Explicação:</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {question.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {showExplanation && (
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reiniciar
            </Button>

            {!isLastQuestion ? (
              <Button onClick={handleNext} className="flex items-center gap-2">
                Próxima Questão
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleReset}
                variant="default"
                className="flex items-center gap-2"
              >
                Finalizar Quiz
                <CheckCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};