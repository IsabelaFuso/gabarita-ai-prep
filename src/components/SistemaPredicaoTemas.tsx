import { useState, useEffect } from "react";
import { TrendingUp, History, Brain, Search, Calendar, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

interface TemaPredicao {
  id: string;
  titulo: string;
  probabilidade: number;
  categoria: string;
  baseadoEm: string[];
  tendenciaAtual: boolean;
  historicoRelevante: string[];
  fontes: string[];
  justificativa: string;
  nivel: 'alta' | 'media' | 'baixa';
}

interface TendenciaAtual {
  tema: string;
  relevancia: number;
  fonte: string;
  dataIdentificacao: string;
  categoria: string;
}

interface HistoricoTema {
  ano: number;
  tema: string;
  vestibular: string;
  categoria: string;
  frequencia: number;
}

export const SistemaPredicaoTemas = () => {
  const [predicoes, setPredicoes] = useState<TemaPredicao[]>([]);
  const [tendenciasAtuais, setTendenciasAtuais] = useState<TendenciaAtual[]>([]);
  const [historicoTemas, setHistoricoTemas] = useState<HistoricoTema[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState<string>("");

  // Dados simulados - na implementação real, estes viriam de APIs
  const dadosSimulados = {
    predicoes: [
      {
        id: "pred_001",
        titulo: "Inteligência Artificial e Mercado de Trabalho no Brasil",
        probabilidade: 85,
        categoria: "Tecnologia e Sociedade",
        baseadoEm: ["Tendência: ChatGPT e IA", "Histórico: Tecnologia 2018-2022"],
        tendenciaAtual: true,
        historicoRelevante: ["2018 - Manipulação do comportamento do usuário", "2022 - Desafios da educação digital"],
        fontes: ["Google Trends", "Análise de vestibulares anteriores"],
        justificativa: "IA está em alta discussão pública e impacta diretamente o mercado de trabalho, tema recorrente em vestibulares.",
        nivel: 'alta' as const
      },
      {
        id: "pred_002", 
        titulo: "Desafios da Saúde Mental Pós-Pandemia",
        probabilidade: 78,
        categoria: "Saúde e Sociedade",
        baseadoEm: ["Tendência: Discussões sobre saúde mental", "Histórico: ENEM 2020"],
        tendenciaAtual: true,
        historicoRelevante: ["2020 - Estigma das doenças mentais", "2019 - Democratização do acesso à saúde"],
        fontes: ["Dados OMS", "Análise de mídias sociais"],
        justificativa: "Saúde mental ganhou destaque pós-pandemia e é tema de interesse social crescente.",
        nivel: 'alta' as const
      },
      {
        id: "pred_003",
        titulo: "Desinformação e Democracia Digital",
        probabilidade: 72,
        categoria: "Política e Comunicação",
        baseadoEm: ["Tendência: Fake news", "Histórico: Temas sobre democracia"],
        tendenciaAtual: true,
        historicoRelevante: ["2017 - Formação educacional crítica", "2019 - Democratização do acesso à informação"],
        fontes: ["Análise eleitoral", "Estudos sobre desinformação"],
        justificativa: "Desinformação é tema central nas discussões democráticas contemporâneas.",
        nivel: 'media' as const
      },
      {
        id: "pred_004",
        titulo: "Sustentabilidade e Economia Verde",
        probabilidade: 68,
        categoria: "Meio Ambiente",
        baseadoEm: ["Tendência: ESG e sustentabilidade", "Histórico: Temas ambientais cíclicos"],
        tendenciaAtual: true,
        historicoRelevante: ["2022 - Desmatamento e preservação", "2019 - Mudanças climáticas"],
        fontes: ["Relatórios ambientais", "Tendências corporativas"],
        justificativa: "Sustentabilidade é prioridade global e tema frequente em avaliações educacionais.",
        nivel: 'media' as const
      }
    ],
    tendencias: [
      { tema: "Inteligência Artificial", relevancia: 95, fonte: "Google Trends", dataIdentificacao: "2024-12", categoria: "Tecnologia" },
      { tema: "Saúde Mental", relevancia: 88, fonte: "Twitter Analytics", dataIdentificacao: "2024-12", categoria: "Saúde" },
      { tema: "Desinformação", relevancia: 82, fonte: "Análise de mídia", dataIdentificacao: "2024-12", categoria: "Comunicação" },
      { tema: "Sustentabilidade", relevancia: 75, fonte: "LinkedIn Trends", dataIdentificacao: "2024-12", categoria: "Ambiente" }
    ],
    historico: [
      { ano: 2023, tema: "Desafios da inclusão digital", vestibular: "ENEM", categoria: "Tecnologia", frequencia: 3 },
      { ano: 2022, tema: "Desafios da educação digital", vestibular: "ENEM", categoria: "Educação", frequencia: 4 },
      { ano: 2021, tema: "Invisibilidade do trabalho de cuidado", vestibular: "ENEM", categoria: "Trabalho", frequencia: 2 },
      { ano: 2020, tema: "Estigma das doenças mentais", vestibular: "ENEM", categoria: "Saúde", frequencia: 5 },
      { ano: 2019, tema: "Democratização do cinema", vestibular: "ENEM", categoria: "Cultura", frequencia: 2 }
    ]
  };

  useEffect(() => {
    gerarPredicoes();
  }, []);

  const gerarPredicoes = async () => {
    setLoading(true);
    // Simula processamento de dados
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPredicoes(dadosSimulados.predicoes);
    setTendenciasAtuais(dadosSimulados.tendencias);
    setHistoricoTemas(dadosSimulados.historico);
    setLoading(false);
  };

  const categoriasUnicas = [...new Set(predicoes.map(p => p.categoria))];
  
  const predicoesFiltradas = filtroCategoria 
    ? predicoes.filter(p => p.categoria === filtroCategoria)
    : predicoes;

  const getCorNivel = (nivel: string) => {
    switch(nivel) {
      case 'alta': return 'text-green-600';
      case 'media': return 'text-yellow-600';
      case 'baixa': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getBadgeVariant = (nivel: string) => {
    switch(nivel) {
      case 'alta': return 'default';
      case 'media': return 'secondary';
      case 'baixa': return 'destructive';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Brain className="w-12 h-12 animate-pulse text-primary" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Analisando Tendências</h3>
          <p className="text-muted-foreground">Processando dados históricos e tendências atuais...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            Sistema Preditivo de Temas
          </h2>
          <p className="text-muted-foreground">
            Análise baseada em tendências atuais e padrões históricos
          </p>
        </div>
        <Button onClick={gerarPredicoes} disabled={loading}>
          <Search className="w-4 h-4 mr-2" />
          Atualizar Análise
        </Button>
      </div>

      <Tabs defaultValue="predicoes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predicoes">Predições</TabsTrigger>
          <TabsTrigger value="tendencias">Tendências Atuais</TabsTrigger>
          <TabsTrigger value="historico">Análise Histórica</TabsTrigger>
        </TabsList>

        <TabsContent value="predicoes" className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Filtrar por categoria..."
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="max-w-xs"
            />
            {filtroCategoria && (
              <Button variant="outline" onClick={() => setFiltroCategoria("")}>
                Limpar Filtro
              </Button>
            )}
          </div>

          <div className="grid gap-4">
            {predicoesFiltradas.map((predicao) => (
              <Card key={predicao.id} className="shadow-soft">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{predicao.titulo}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={getBadgeVariant(predicao.nivel)}>
                          {predicao.probabilidade}% de probabilidade
                        </Badge>
                        <Badge variant="outline">{predicao.categoria}</Badge>
                        {predicao.tendenciaAtual && (
                          <Badge variant="secondary">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Em alta
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Progress value={predicao.probabilidade} className="h-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{predicao.justificativa}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Baseado em:</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {predicao.baseadoEm.map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2">Histórico Relevante:</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {predicao.historicoRelevante.map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Fontes:</h4>
                    <div className="flex flex-wrap gap-1">
                      {predicao.fontes.map((fonte, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {fonte}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tendencias" className="space-y-4">
          <div className="grid gap-4">
            {tendenciasAtuais.map((tendencia, idx) => (
              <Card key={idx} className="shadow-soft">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{tendencia.tema}</h3>
                    <Badge variant="secondary">{tendencia.categoria}</Badge>
                  </div>
                  <Progress value={tendencia.relevancia} className="h-2 mb-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Relevância: {tendencia.relevancia}%</span>
                    <span>Fonte: {tendencia.fonte}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="historico" className="space-y-4">
          <div className="grid gap-4">
            {historicoTemas.map((tema, idx) => (
              <Card key={idx} className="shadow-soft">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">{tema.ano}</span>
                    </div>
                    <Badge variant="outline">{tema.vestibular}</Badge>
                  </div>
                  <h3 className="font-medium mb-1">{tema.tema}</h3>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Categoria: {tema.categoria}</span>
                    <span>Frequência: {tema.frequencia}x</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};