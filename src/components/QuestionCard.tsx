import { useState, useEffect } from "react";
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Lightbulb, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TutorView } from "./TutorView";

// This should be kept in sync with the backend types
interface Question {
  id: string;
  institution?: { name: string };
  year?: number;
  subject: { name: string };
  topic?: { name: string };
  statement: string;
  type: 'multipla_escolha' | 'summation';
  options: { [key: string]: string } | { text: string; value: number }[];
  correct_answers: { answer?: string; sum?: number };
  correct_sum?: number;
  explanation?: string;
  image_url?: string;
}

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string | number) => void;
  showExplanation: boolean;
  onNext: () => void;
  isLastQuestion: boolean;
  onReset: () => void;
  userAnswer: string | number | null;
}

export const QuestionCard = ({
  question,
  onAnswer,
  showExplanation,
  onNext,
  isLastQuestion,
  onReset,
  userAnswer,
}: QuestionCardProps) => {
  const [selectedAlternative, setSelectedAlternative] = useState<string | null>(null);
  const [sumValue, setSumValue] = useState<string>('');
  const [isTutorOpen, setIsTutorOpen] = useState(false);

  useEffect(() => {
    setSelectedAlternative(null);
    setSumValue('');
  }, [question]);

  const handleMultipleChoiceSelect = (alternativeKey: string) => {
    if (showExplanation) return;
    setSelectedAlternative(alternativeKey);
    onAnswer(alternativeKey);
  };

  const handleSumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (showExplanation) return;
    const value = e.target.value.replace(/\D/g, ''); // Allow only digits
    setSumValue(value);
  };
  
  const handleSumSubmit = () => {
    if (showExplanation || !sumValue) return;
    onAnswer(parseInt(sumValue, 10));
  };


  const handleNext = () => {
    setIsTutorOpen(false);
    onNext();
  };

  const handleReset = () => {
    setIsTutorOpen(false);
    onReset();
  };

  const getAlternativeStyle = (key: string) => {
    if (!showExplanation) {
      return selectedAlternative === key
        ? "border-primary bg-accent"
        : "border-border hover:border-primary/50 hover:bg-accent/50";
    }

    if (key === question.correct_answers.answer) {
      return "border-success bg-success/10 text-success-foreground";
    }
    if (selectedAlternative === key && key !== question.correct_answers.answer) {
      return "border-destructive bg-destructive/10 text-destructive-foreground";
    }
    return "border-muted bg-muted/30";
  };

  const getAlternativeIcon = (key: string) => {
    if (!showExplanation) return null;
    
    if (key === question.correct_answers.answer) {
      return <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />;
    }
    if (selectedAlternative === key && key !== question.correct_answers.answer) {
      return <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />;
    }
    return null;
  };
  
  const isSumCorrect = showExplanation && typeof userAnswer === 'number' && userAnswer === question.correct_sum;
  const sumInputStyle = showExplanation
    ? (isSumCorrect
        ? "border-success bg-success/10 text-success-foreground"
        : "border-destructive bg-destructive/10 text-destructive-foreground")
    : "";


  const tutorContext = `
    Questão: ${question.statement}
    ${question.type === 'multipla_escolha' ? 'Alternativas:' : 'Afirmativas:'}
    ${Array.isArray(question.options) 
      ? question.options.map(opt => `${opt.value}) ${opt.text}`).join('\n')
      : Object.entries(question.options).map(([key, value]) => `${key}) ${value}`).join('\n')
    }
    ---
    Ajude o aluno a resolver esta questão passo a passo, sem dar a resposta diretamente.
  `;

  return (
    <Card className="shadow-elevated">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline">{question.institution?.name} {question.year}</Badge>
            <Badge variant="secondary">{question.subject?.name}</Badge>
            {question.topic && <Badge variant="secondary">{question.topic.name}</Badge>}
          </div>
        </div>
        <CardTitle className="text-xl leading-relaxed">{question.statement}</CardTitle>
        {question.image_url && (
          <div className="mt-4">
            <img 
              src={question.image_url} 
              alt={`Imagem da questão ${question.id}`}
              className="max-w-full mx-auto rounded-lg border"
            />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {question.type === 'multipla_escolha' && (
          <div className="space-y-3">
            {Object.entries(question.options as { [key: string]: string }).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleMultipleChoiceSelect(key)}
                disabled={showExplanation}
                className={cn(
                  "w-full p-4 text-left rounded-lg border-2 transition-all duration-200",
                  "flex items-center gap-3 min-h-[60px]",
                  getAlternativeStyle(key),
                  showExplanation ? "cursor-default" : "cursor-pointer"
                )}
              >
                <span className="flex-shrink-0 w-6 h-6 bg-muted rounded-full flex items-center justify-center text-sm font-medium">
                  {key}
                </span>
                <span className="flex-1">{value}</span>
                {getAlternativeIcon(key)}
              </button>
            ))}
          </div>
        )}

        {question.type === 'summation' && (
           <div className="space-y-3">
            {(question.options as { text: string; value: number }[]).map((option, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border">
                 <Label className="w-10 text-lg font-bold text-right pt-1">{String(option.value).padStart(2, '0')}</Label>
                 <p className="flex-1 text-base">{option.text}</p>
              </div>
            ))}
            <div className="flex items-center justify-center pt-4">
                <div className="w-40 text-center">
                    <Label htmlFor="sum-input" className="mb-2 block">Soma:</Label>
                    <Input
                        id="sum-input"
                        type="number"
                        value={showExplanation ? userAnswer : sumValue}
                        onChange={handleSumChange}
                        disabled={showExplanation}
                        className={cn("text-2xl h-16 text-center font-bold", sumInputStyle)}
                    />
                    {!showExplanation && (
                      <Button onClick={handleSumSubmit} className="mt-2 w-full">Responder</Button>
                    )}
                     {showExplanation && (
                        <div className="mt-2 font-bold text-lg">
                            {isSumCorrect ? (
                                <span className="text-success flex items-center justify-center gap-2">
                                    <CheckCircle/> Correto!
                                </span>
                            ) : (
                                <span className="text-destructive flex items-center justify-center gap-2">
                                    <XCircle/> Incorreto
                                </span>
                            )}
                            <span> Resposta: {question.correct_sum}</span>
                        </div>
                    )}
                </div>
            </div>
          </div>
        )}

        <Collapsible open={isTutorOpen} onOpenChange={setIsTutorOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full flex items-center gap-2">
              <BrainCircuit className="w-4 h-4" />
              {isTutorOpen ? "Fechar Tutor" : "Pedir ajuda à IA"}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <TutorView context={{
              type: "question",
              questionText: tutorContext,
              questionId: question.id,
              subject: question.subject.name,
              topic: question.topic?.name || ''
            }} />
          </CollapsibleContent>
        </Collapsible>

        {showExplanation && question.explanation && (
          <div className="bg-accent p-4 rounded-lg border mt-4">
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
