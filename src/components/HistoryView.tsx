import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertCircle, BookOpen } from "lucide-react";

interface SimuladoHistory {
  id: string;
  finished_at: string;
  title: string;
  score: number;
  total_questions: number;
}

interface HistoryViewProps {
  onViewDetails: (simuladoId: string) => void;
}

export const HistoryView = ({ onViewDetails }: HistoryViewProps) => {
  const { user } = useAuth();
  const [history, setHistory] = useState<SimuladoHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('simulados')
          .select('id, finished_at, title, score, total_questions')
          .eq('user_id', user.id)
          .eq('status', 'finalizado')
          .not('finished_at', 'is', null)
          .order('finished_at', { ascending: false });

        if (error) {
          throw new Error("Não foi possível carregar o histórico. Tente novamente mais tarde.");
        }

        setHistory(data || []);
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-10 bg-destructive/10 rounded-lg">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <p className="text-lg font-semibold text-destructive">Ocorreu um erro</p>
          <p className="text-muted-foreground">{error}</p>
        </div>
      );
    }

    if (history.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-10 bg-secondary/50 rounded-lg">
          <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold">Nenhuma atividade encontrada</p>
          <p className="text-muted-foreground">Complete um simulado para ver seu histórico aqui.</p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Simulado</TableHead>
            <TableHead className="text-center">Data</TableHead>
            <TableHead className="text-center hidden md:table-cell">Questões</TableHead>
            <TableHead className="text-right">Nota</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((simulado) => (
            <TableRow key={simulado.id} onClick={() => onViewDetails(simulado.id)} className="cursor-pointer hover:bg-muted/50">
              <TableCell className="font-medium">{simulado.title}</TableCell>
              <TableCell className="text-center">{format(new Date(simulado.finished_at), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
              <TableCell className="text-center hidden md:table-cell">{simulado.total_questions}</TableCell>
              <TableCell className="text-right">
                <Badge variant={simulado.score >= 0.7 ? 'default' : simulado.score >= 0.5 ? 'secondary' : 'destructive'}>
                  {Math.round(simulado.score * 100)}%
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Atividades</CardTitle>
        <CardDescription>Revise seus simulados e atividades anteriores.</CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};
