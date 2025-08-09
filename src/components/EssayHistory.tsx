import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Essay {
  id: string;
  theme_title: string;
  theme_description: string;
  content: string;
  score: number;
  criteria_scores: any;
  ai_feedback: string;
  created_at: string;
  updated_at: string;
}

interface EssayHistoryProps {
  onEditEssay?: (essay: Essay) => void;
}

export const EssayHistory = ({ onEditEssay }: EssayHistoryProps) => {
  const { user } = useAuth();
  const [essays, setEssays] = useState<Essay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEssays = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('essays')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setEssays(data || []);
      } catch (error) {
        console.error('Error fetching essays:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEssays();
  }, [user]);

  const deleteEssay = async (essayId: string) => {
    try {
      const { error } = await supabase
        .from('essays')
        .delete()
        .eq('id', essayId);

      if (error) throw error;
      setEssays(essays.filter(essay => essay.id !== essayId));
    } catch (error) {
      console.error('Error deleting essay:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (essays.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium mb-2">Nenhuma redação encontrada</p>
          <p className="text-muted-foreground">
            Comece a escrever redações para ver seu histórico aqui.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Histórico de Redações</h2>
      {essays.map((essay) => (
        <Card key={essay.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg">{essay.theme_title}</CardTitle>
                <CardDescription className="mt-1">
                  {essay.theme_description}
                </CardDescription>
                <div className="flex gap-2 mt-2">
                  <Badge variant={essay.score >= 900 ? 'default' : essay.score >= 600 ? 'secondary' : 'destructive'}>
                    {essay.score} pontos
                  </Badge>
                  <Badge variant="outline">
                    {format(new Date(essay.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                {onEditEssay && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditEssay(essay)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteEssay(essay.id)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-2">Texto da redação:</h4>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {essay.content}
                </p>
              </div>
              {essay.ai_feedback && (
                <div>
                  <h4 className="font-medium mb-2">Feedback:</h4>
                  <p className="text-sm text-muted-foreground">
                    {essay.ai_feedback}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};