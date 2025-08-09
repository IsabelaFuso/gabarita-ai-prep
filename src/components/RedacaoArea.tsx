import { useState, useEffect } from "react";
import { Clock, FileText, Send, RotateCcw, CheckCircle, AlertCircle, BookOpen, BrainCircuit, Star, ChevronDown, TrendingUp, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TutorView } from "./TutorView";
import { SistemaPredicaoTemas } from "./SistemaPredicaoTemas";
import { EssayHistory } from "./EssayHistory";
import { useAppState } from "@/hooks/useAppState";
import temasRedacao from "@/data/redacao-themes.json";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { supabase } from "@/integrations/supabase/client";

interface RedacaoTema {
  id: number;
  titulo: string;
  descricao: string;
  textoMotivador: string;
  instrucao: string;
  ano: number;
  vestibular: string;
  tipo: 'regular' | 'preditivo';
  probabilidade?: number;
  status?: string;
  justificativa?: string;
  fontes?: string;
}

// Banco de temas adicionais para simular a descoberta de novos temas
const novosTemasPreditivos: RedacaoTema[] = [
  {
    id: 9,
    titulo: "A importância da valorização de comunidades e povos tradicionais",
    descricao: "Tema Preditivo 2025",
    textoMotivador: "O conhecimento ancestral e a cultura de povos indígenas e quilombolas são fundamentais para a identidade nacional e para a preservação da biodiversidade. No entanto, esses grupos enfrentam constantes ameaças a seus territórios e modos de vida.",
    instrucao: "Discuta a importância da valorização dos povos tradicionais para o desenvolvimento sustentável e a diversidade cultural do Brasil.",
    ano: 2025,
    vestibular: "Preditivo",
    tipo: 'preditivo',
    probabilidade: 80,
    status: "Relevante",
    justificativa: "Pauta social e ambiental que ganha força em discussões sobre direitos humanos e sustentabilidade.",
    fontes: "FUNAI, Relatórios de ONGs, Mídia"
  },
  {
    id: 10,
    titulo: "Os desafios da inclusão digital na terceira idade",
    descricao: "Tema Preditivo 2025",
    textoMotivador: "Enquanto a sociedade se torna cada vez mais digital, parte da população idosa encontra dificuldades de acesso e uso das novas tecnologias, o que pode gerar exclusão social e dificultar o acesso a serviços.",
    instrucao: "Analise os desafios da inclusão digital para a população idosa no Brasil e proponha ações para mitigar esse problema.",
    ano: 2025,
    vestibular: "Preditivo",
    tipo: 'preditivo',
    probabilidade: 78,
    status: "Estável",
    justificativa: "Com o envelhecimento da população, a inclusão digital dos idosos se torna um tema social cada vez mais pertinente.",
    fontes: "Pesquisas de Inclusão Digital, IBGE"
  }
];

interface CriterioAvaliacao {
  nome: string;
  descricao: string;
  peso: number;
  nota: number;
  feedback: string;
}

interface RedacaoAreaProps {
  onBack: () => void;
}

export const RedacaoArea = ({ onBack }: RedacaoAreaProps) => {
  const { triggerConfetti, triggerAchievementNotification } = useAppState();
  const [todosOsTemas, setTodosOsTemas] = useState<RedacaoTema[]>(temasRedacao.map(tema => ({ ...tema, tipo: tema.tipo as 'regular' | 'preditivo' })));
  const [analisandoTemas, setAnalisandoTemas] = useState(false);
  const [temaTipo, setTemaTipo] = useState<'regular' | 'preditivo'>('regular');
  const [currentView, setCurrentView] = useState<'selection' | 'writing' | 'result' | 'history'>('selection');
  const [temasFiltrados, setTemasFiltrados] = useState<RedacaoTema[]>([]);
  const [temaAtual, setTemaAtual] = useState<RedacaoTema | null>(null);
  const [textoRedacao, setTextoRedacao] = useState("");
  const [tempoRestante, setTempoRestante] = useState(90 * 60);
  const [iniciadoTempo, setIniciadoTempo] = useState(false);
  const [redacaoEnviada, setRedacaoEnviada] = useState(false);
  const [avaliacao, setAvaliacao] = useState<CriterioAvaliacao[] | null>(null);
  const [notaFinal, setNotaFinal] = useState<number | null>(null);
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [showPredicaoTemas, setShowPredicaoTemas] = useState(false);
  const [openCollapsible, setOpenCollapsible] = useState<number | null>(null);

  useEffect(() => {
    const filtered = todosOsTemas.filter(t => t.tipo === temaTipo);
    setTemasFiltrados(filtered);

    if (!temaAtual || !filtered.some(t => t.id === temaAtual.id)) {
        setTemaAtual(filtered.length > 0 ? filtered[0] : null);
    }
  }, [temaTipo, todosOsTemas, temaAtual]);

  const analisarNovosTemas = () => {
    setAnalisandoTemas(true);
    setTimeout(() => {
      const temaJaAdicionadoIds = new Set(todosOsTemas.map(t => t.id));
      const proximoTema = novosTemasPreditivos.find(nt => !temaJaAdicionadoIds.has(nt.id));

      if (proximoTema) {
        setTodosOsTemas(prevTemas => [...prevTemas, proximoTema]);
      }
      setAnalisandoTemas(false);
    }, 1500);
  };

  const formatarTempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}:${segs.toString().padStart(2, '0')}`;
  };

  const iniciarCronometro = () => {
    setIniciadoTempo(true);
    const interval = setInterval(() => {
      setTempoRestante(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          enviarRedacao();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const enviarRedacao = async () => {
    if (textoRedacao.trim().length < 100) {
      alert("A redação deve ter pelo menos 100 caracteres.");
      return;
    }

    const criterios: CriterioAvaliacao[] = [
        { nome: "Competência 1", descricao: "Demonstrar domínio da modalidade escrita formal da língua portuguesa", peso: 200, nota: Math.floor(Math.random() * 5) * 40 + 120, feedback: "Apresenta bom domínio da norma culta, com alguns deslizes." },
        { nome: "Competência 2", descricao: "Compreender a proposta de redação e aplicar conceitos das várias áreas de conhecimento", peso: 200, nota: Math.floor(Math.random() * 5) * 40 + 120, feedback: "Demonstra compreensão do tema e articula conhecimentos." },
        { nome: "Competência 3", descricao: "Selecionar, relacionar, organizar e interpretar informações para defender um ponto de vista", peso: 200, nota: Math.floor(Math.random() * 5) * 40 + 120, feedback: "Apresenta informações de forma organizada com argumentação consistente." },
        { nome: "Competência 4", descricao: "Demonstrar conhecimento dos mecanismos linguísticos para a construção da argumentação", peso: 200, nota: Math.floor(Math.random() * 5) * 40 + 120, feedback: "Utiliza conectivos e operadores argumentativos adequadamente." },
        { nome: "Competência 5", descricao: "Elaborar proposta de intervenção para o problema abordado, respeitando os direitos humanos", peso: 200, nota: Math.floor(Math.random() * 5) * 40 + 120, feedback: "Proposta de intervenção clara e bem fundamentada." }
    ];
    const notaTotal = criterios.reduce((sum, c) => sum + c.nota, 0);
    
    setAvaliacao(criterios);
    setNotaFinal(notaTotal);
    setRedacaoEnviada(true);

    // Save essay to database
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && temaAtual) {
        await supabase.from('essays').insert({
          user_id: user.id,
          theme_title: temaAtual.titulo,
          theme_description: temaAtual.descricao,
          content: textoRedacao,
          score: notaTotal,
          criteria_scores: JSON.parse(JSON.stringify(criterios)),
          ai_feedback: "Feedback gerado automaticamente baseado nos critérios de avaliação."
        });

        // Update user stats with essay submission
        const { data: newAchievements } = await supabase.rpc('handle_essay_submission', {
          p_user_id: user.id,
          p_score: notaTotal
        });

        if (newAchievements && newAchievements.length > 0) {
          triggerAchievementNotification(newAchievements);
        }
      }
    } catch (error) {
      console.error('Error saving essay:', error);
    }
    
    triggerConfetti();
  };

  const reiniciarRedacao = () => {
    setTextoRedacao("");
    setTempoRestante(90 * 60);
    setIniciadoTempo(false);
    setRedacaoEnviada(false);
    setAvaliacao(null);
    setNotaFinal(null);
    setIsTutorOpen(false);
    const filtered = todosOsTemas.filter(t => t.tipo === temaTipo);
    setTemasFiltrados(filtered);
    if (filtered.length > 0) {
      setTemaAtual(filtered[0]);
    }
  };

  const contadorPalavras = textoRedacao.trim().split(/\s+/).filter(word => word.length > 0).length;
  const progressoPalavras = Math.min((contadorPalavras / 300) * 100, 100);

  const tutorContext = {
    type: "redacao",
    tema: temaAtual?.titulo || "Nenhum tema selecionado",
    instrucao: temaAtual?.instrucao || "Nenhuma instrução disponível",
  };

  if (redacaoEnviada && avaliacao && notaFinal) {
    return (
        <div className="min-h-screen bg-gradient-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <Button variant="outline" onClick={onBack}>
                ← Voltar ao Dashboard
              </Button>
              <div className="text-center">
                <h1 className="text-2xl font-bold">Avaliação da Redação</h1>
                <p className="text-muted-foreground">{temaAtual?.titulo}</p>
              </div>
              <div></div>
            </div>
            <Card className="mb-8 shadow-elevated">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl">
                  {notaFinal}/1000 pontos
                </CardTitle>
                <CardDescription>
                  {notaFinal >= 800 ? "Excelente!" : notaFinal >= 600 ? "Bom desempenho!" : "Continue praticando!"}
                </CardDescription>
              </CardHeader>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {avaliacao.map((criterio, index) => (
                <Card key={index} className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      {criterio.nome}
                      <Badge variant={criterio.nota >= 160 ? "default" : criterio.nota >= 120 ? "secondary" : "destructive"}>
                        {criterio.nota}/200
                      </Badge>
                    </CardTitle>
                    <CardDescription>{criterio.descricao}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Progress value={(criterio.nota / 200) * 100} className="mb-3" />
                    <p className="text-sm text-muted-foreground">{criterio.feedback}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center gap-4">
              <Button onClick={reiniciarRedacao} className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Nova Redação
              </Button>
              <Button variant="outline" onClick={onBack}>
                Voltar ao Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button variant="outline" onClick={onBack}>
              ← Voltar ao Dashboard
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-bold">Área de Redação</h1>
              <p className="text-muted-foreground">Pratique com temas de vestibulares ou temas preditivos</p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => setShowPredicaoTemas(!showPredicaoTemas)}
                className="flex items-center gap-2"
              >
                <BrainCircuit className="w-4 h-4" />
                {showPredicaoTemas ? "Ocultar" : "Predição de"} Temas
              </Button>
              {iniciadoTempo && (
                <div className={cn(
                  "flex items-center gap-2 font-mono text-lg",
                  tempoRestante < 300 && "text-destructive animate-pulse"
                )}>
                  <Clock className="w-4 h-4" />
                  {formatarTempo(tempoRestante)}
                </div>
              )}
            </div>
          </div>

          {showPredicaoTemas && (
            <div className="mb-8">
              <SistemaPredicaoTemas />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Escolha o Tema
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ToggleGroup 
                    type="single" 
                    value={temaTipo}
                    onValueChange={(value: 'regular' | 'preditivo') => { if(value) setTemaTipo(value) }} 
                    className="w-full grid grid-cols-2"
                  >
                    <ToggleGroupItem value="regular">Temas Anteriores</ToggleGroupItem>
                    <ToggleGroupItem value="preditivo">
                      <Star className="w-4 h-4 mr-2 text-yellow-400" />
                      Temas Preditivos
                    </ToggleGroupItem>
                  </ToggleGroup>

                  {temaTipo === 'preditivo' && (
                    <Card className="bg-accent border-primary/50">
                      <CardHeader>
                        <CardTitle className="text-lg">Sistema Preditivo de Temas</CardTitle>
                        <CardDescription>Análise baseada em tendências atuais e padrões históricos.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button onClick={analisarNovosTemas} disabled={analisandoTemas || !novosTemasPreditivos.some(nt => !todosOsTemas.map(t => t.id).includes(nt.id))} className="w-full">
                          {analisandoTemas ? (
                            <>
                              <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                              Analisando...
                            </>
                          ) : (
                            "Analisar Novos Temas"
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {temasFiltrados.map((tema) => (
                      <Collapsible key={tema.id} open={openCollapsible === tema.id} onOpenChange={() => setOpenCollapsible(prev => prev === tema.id ? null : tema.id)}>
                        <Card className={cn("transition-all", temaAtual?.id === tema.id && "border-primary")}>
                          <CardHeader className="p-4 cursor-pointer" onClick={() => setTemaAtual(tema)}>
                            <div className="font-medium text-sm mb-1">{tema.titulo}</div>
                            <div className="text-xs text-muted-foreground">{tema.descricao}</div>
                          </CardHeader>
                          
                          {tema.tipo === 'preditivo' && tema.probabilidade && (
                            <CardContent className="p-4 pt-0 space-y-3">
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs font-medium">Probabilidade: {tema.probabilidade}%</span>
                                  <Badge variant={tema.probabilidade > 85 ? "default" : "secondary"}>{tema.status}</Badge>
                                </div>
                                <Progress value={tema.probabilidade} className="h-2" />
                              </div>
                              <CollapsibleTrigger className="w-full text-sm flex items-center justify-center text-muted-foreground hover:text-primary">
                                Ver Análise <ChevronDown className="w-4 h-4 ml-1" />
                              </CollapsibleTrigger>
                            </CardContent>
                          )}

                          <CollapsibleContent className="p-4 pt-0 space-y-2">
                            <div className="border-t pt-3">
                              <h4 className="font-semibold text-sm flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary"/> Justificativa</h4>
                              <p className="text-xs text-muted-foreground mt-1">{tema.justificativa}</p>
                            </div>
                            <div className="border-t pt-3">
                              <h4 className="font-semibold text-sm flex items-center gap-2"><Info className="w-4 h-4 text-primary"/> Fontes</h4>
                              <p className="text-xs text-muted-foreground mt-1">{tema.fontes}</p>
                            </div>
                          </CollapsibleContent>
                        </Card>
                      </Collapsible>
                    ))}
                    {temasFiltrados.length === 0 && (
                      <div className="text-center text-muted-foreground py-4">
                        <p>Nenhum tema {temaTipo === 'preditivo' ? 'preditivo' : 'anterior'} encontrado.</p>
                        {temaTipo === 'preditivo' && <p className="text-sm">Clique em "Analisar Novos Temas" para buscar previsões.</p>}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {temaAtual && (
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Instruções</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Texto Motivador:</h4>
                      <p className="text-sm text-muted-foreground">{temaAtual.textoMotivador}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Proposta:</h4>
                      <p className="text-sm text-muted-foreground">{temaAtual.instrucao}</p>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Critérios de Avaliação:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Domínio da norma culta</li>
                        <li>• Compreensão do tema</li>
                        <li>• Organização das ideias</li>
                        <li>• Uso de conectivos</li>
                        <li>• Proposta de intervenção</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-2">
              {temaAtual ? (
                <Card className="shadow-elevated h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        {temaAtual.titulo}
                      </CardTitle>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {contadorPalavras} palavras
                        </span>
                        {!iniciadoTempo && (
                          <Button onClick={iniciarCronometro} size="sm">
                            Iniciar Cronômetro
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {contadorPalavras > 0 && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Progresso</span>
                          <span>{Math.round(progressoPalavras)}%</span>
                        </div>
                        <Progress value={progressoPalavras} className="h-1" />
                      </div>
                    )}
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col">
                    <Textarea
                      placeholder="Comece sua redação aqui..."
                      value={textoRedacao}
                      onChange={(e) => setTextoRedacao(e.target.value)}
                      className="flex-1 resize-none text-base leading-6"
                      disabled={redacaoEnviada}
                    />
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <AlertCircle className="w-4 h-4" />
                        Mínimo: 100 caracteres | Recomendado: 300+ palavras
                      </div>
                      
                      <div className="flex gap-2">
                        {textoRedacao && (
                          <Button variant="outline" onClick={() => setTextoRedacao('')}>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Limpar
                          </Button>
                        )}
                        <Button 
                          onClick={enviarRedacao}
                          disabled={textoRedacao.trim().length < 100}
                          className="flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          Enviar Redação
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  
                  <Collapsible open={isTutorOpen} onOpenChange={setIsTutorOpen} className="m-6">
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
                </Card>
              ) : (
                <Card className="flex items-center justify-center h-full">
                  <CardContent>
                    <p className="text-muted-foreground">Selecione um tipo de tema para começar.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};