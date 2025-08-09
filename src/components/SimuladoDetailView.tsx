import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AlertCircle, ArrowLeft, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Question } from "@/data/types";
import { cn } from "@/lib/utils";

interface SimuladoDetails {
  id: string;
  finished_at: string;
  title: string;
  score: number;
  total_questions: number;
  user_attempts: {
    question_id: string;
    user_answer: string;
    is_correct: boolean;
    question: {
      statement: string;
      alternatives: string[];
      correct_answer: string;
      explanation: string;
    }
  }[];
}

interface SimuladoDetailViewProps {
  simuladoId: string;
  onBack: () => void;
}

export const SimuladoDetailView = ({ simuladoId, onBack }: SimuladoDetailViewProps) => {
  const { user } = useAuth();
  const [details, setDetails] = useState<SimuladoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!user || !simuladoId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('simulados')
          .select(`
            id,
            finished_at,
            title,
            score,
            total_questions,
            user_attempts (
              question_id,
              user_answer,
              is_correct,
              question:questions (
                statement,
                alternatives,
                correct_answer,
                explanation
              )
            )
          `)
          .eq('id', simuladoId)
          .eq('user_id', user.id)
          .single();

        if (error) {
          throw new Error("Não foi possível carregar os detalhes do simulado.");
        }
        
        setDetails(data as unknown as SimuladoDetails);
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [user, simuladoId]);

  const renderQuestionAnalysis = () => {
    if (!details) return null;

    return details.user_attempts.map((attempt, index) => {
      const question = attempt.question;
      const correctAnswerIndex = question.alternatives.indexOf(question.correct_answer);
      const userAnswerIndex = question.alternatives.indexOf(attempt.user_answer);

      return (
        <div key={attempt.question_id} className="p-4 border rounded-lg space-y-3">
          <div className="flex justify-between items-start">
            <p className="font-semibold">Questão {index + 1}: {question.statement}</p>
            {attempt.is_correct ? (
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
            ) : (
              <X className="w-5 h-5 text-red-500 flex-shrink-0" />
            )}
          </div>
          <div className="space-y-2">
            {question.alternatives.map((alt, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "p-2 rounded-md text-sm",
                  idx === correctAnswerIndex && "bg-green-100 dark:bg-green-900 border border-green-500",
                  idx === userAnswerIndex && !attempt.is_correct && "bg-red-100 dark:bg-red-900 border border-red-500"
                )}
              >
                <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                {alt}
              </div>
            ))}
          </div>
          {!attempt.is_correct && (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-md text-sm">
              <h4 className="font-semibold mb-1">Explicação:</h4>
              <p className="text-muted-foreground">{question.explanation || "Nenhuma explicação disponível."}</p>
            </div>
          )}
        </div>
      );
    });
  };

  const renderContent = () => {
    if (loading) {
      return <Skeleton className="h-64 w-full" />;
    }

    if (error || !details) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-10 bg-destructive/10 rounded-lg">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <p className="text-lg font-semibold text-destructive">Ocorreu um erro</p>
          <p className="text-muted-foreground">{error || "Não foi possível encontrar os detalhes."}</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{details.title}</h2>
            <p className="text-muted-foreground">
              Realizado em {format(new Date(details.finished_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Nota Final</p>
            <Badge variant={details.score >= 0.7 ? 'default' : details.score >= 0.5 ? 'secondary' : 'destructive'} className="text-2xl">
              {Math.round(details.score * 100)}%
            </Badge>
          </div>
        </div>
        <div className="space-y-4">
          {renderQuestionAnalysis()}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <CardTitle>Detalhes do Simulado</CardTitle>
            <CardDescription>Análise completa da sua performance.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};
