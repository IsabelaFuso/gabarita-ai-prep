import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, AlertTriangle, Target, Youtube, BrainCircuit, Trophy } from "lucide-react";

interface PerformanceSummary {
  subject_name: string;
  topic_name: string;
  total_attempts: number;
  correct_attempts: number;
  accuracy: number;
}

// Mock de dados de vídeo para demonstração
const mockVideos = [
  { id: '1', title: 'Videoaula Completa sobre Análise Combinatória', thumbnail: '/placeholder.svg', url: '#' },
  { id: '2', title: 'Exercícios Resolvidos de Análise Combinatória', thumbnail: '/placeholder.svg', url: '#' },
  { id: '3', title: 'Dicas e Macetes de Análise Combinatória para o ENEM', thumbnail: '/placeholder.svg', url: '#' },
];

export const TutorView = () => {
  const [summary, setSummary] = useState<PerformanceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [isFetchingVideos, setIsFetchingVideos] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const fetchPerformanceSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Usuário não autenticado.");
        return;
      }

      const { data, error: rpcError } = await supabase.rpc('get_user_performance_summary', {
        p_user_id: user.id,
      });

      if (rpcError) throw rpcError;

      setSummary(data);
    } catch (err: any) {
      console.error("Error fetching performance summary:", err);
      setError("Não foi possível carregar seu plano de estudos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const fetchVideos = async (topic: string) => {
    setIsFetchingVideos(true);
    setSelectedTopic(topic);
    setVideos([]); // Limpa vídeos anteriores
    try {
      // TODO: Substituir o mock pela chamada real da ferramenta google_web_search
      // Exemplo: const searchResults = await google_web_search({ query: `videoaula sobre ${topic}` });
      // Em seguida, processe searchResults para extrair os vídeos.
      
      console.log(`Buscando vídeos sobre: ${topic}`);
      // Simula um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setVideos(mockVideos);

    } catch (err) {
      console.error("Erro ao buscar vídeos:", err);
      // Tratar erro na UI, se necessário
    } finally {
      setIsFetchingVideos(false);
    }
  };

  useEffect(() => {
    fetchPerformanceSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
        <h3 className="text-xl text-muted-foreground">Analisando seu desempenho...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-destructive/10 p-6 rounded-lg">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <p className="text-xl font-semibold text-destructive mb-2">Ocorreu um erro</p>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchPerformanceSummary}>Tentar Novamente</Button>
      </div>
    );
  }

  const weakPoints = summary.filter(s => s.accuracy < 0.7).slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <BrainCircuit className="w-12 h-12 mx-auto text-primary" />
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Seu Plano de Estudos Personalizado
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Com base no seu desempenho, identifiquei os tópicos que precisam de mais atenção. Vamos focar neles para maximizar seu aprendizado.
        </p>
      </div>

      {weakPoints.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weakPoints.map((point, index) => (
            <Card key={`${point.subject_name}-${point.topic_name}`} className="shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="destructive">Foco #{index + 1}</Badge>
                  <div className="text-right">
                    <p className="font-bold text-2xl text-destructive">{Math.round(point.accuracy * 100)}%</p>
                    <p className="text-xs text-muted-foreground">de acerto</p>
                  </div>
                </div>
                <CardTitle className="text-xl">{point.topic_name}</CardTitle>
                <CardDescription>{point.subject_name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow flex flex-col justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Você acertou {point.correct_attempts} de {point.total_attempts} questões sobre este tópico.
                  </p>
                  <div className="mt-2">
                    <Progress value={point.accuracy * 100} className="h-2 bg-destructive/20" />
                  </div>
                </div>
                <div className="space-y-2 pt-4">
                   <Button 
                    className="w-full" 
                    onClick={() => fetchVideos(point.topic_name)}
                    disabled={isFetchingVideos && selectedTopic === point.topic_name}
                  >
                    {isFetchingVideos && selectedTopic === point.topic_name ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Youtube className="w-4 h-4 mr-2" />
                    )}
                    Buscar Videoaulas
                  </Button>
                  <Button className="w-full" variant="outline" disabled>
                    <Target className="w-4 h-4 mr-2" />
                    Praticar este tópico (Em breve)
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center p-8 shadow-soft">
          <Trophy className="w-12 h-12 mx-auto text-success mb-4" />
          <h3 className="text-xl font-semibold">Parabéns!</h3>
          <p className="text-muted-foreground">
            Não encontramos pontos fracos com base nas suas tentativas recentes. Continue praticando para manter o bom desempenho!
          </p>
        </Card>
      )}

      {selectedTopic && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Videoaulas sobre {selectedTopic}</CardTitle>
            <CardDescription>Vídeos recomendados para te ajudar a dominar este assunto.</CardDescription>
          </CardHeader>
          <CardContent>
            {isFetchingVideos ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary mr-3" />
                <span className="text-muted-foreground">Buscando as melhores aulas...</span>
              </div>
            ) : videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {videos.map(video => (
                  <a key={video.id} href={video.url} target="_blank" rel="noopener noreferrer" className="block group">
                    <Card className="overflow-hidden h-full hover:border-primary transition-colors">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-32 object-cover" />
                      <div className="p-3">
                        <p className="font-medium text-sm leading-snug group-hover:text-primary transition-colors">{video.title}</p>
                      </div>
                    </Card>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground p-8">Nenhum vídeo encontrado para este tópico.</p>
            )}
          </CardContent>
        </Card>
      )}

      {summary.length > 3 && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Desempenho Completo por Tópico</CardTitle>
            <CardDescription>Sua performance em todas as áreas que você já praticou.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.map(item => (
              <div key={`${item.subject_name}-${item.topic_name}`} className="p-3 border rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.topic_name} <span className="text-sm text-muted-foreground">({item.subject_name})</span></p>
                  <p className="text-xs text-muted-foreground">{item.total_attempts} questões respondidas</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{Math.round(item.accuracy * 100)}%</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};