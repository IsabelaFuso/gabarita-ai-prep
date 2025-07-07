import { useState } from "react";
import { Clock, FileText, Send, RotateCcw, CheckCircle, AlertCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface RedacaoTema {
  id: number;
  titulo: string;
  descricao: string;
  textoMotivador: string;
  instrucao: string;
  ano: number;
  vestibular: string;
}

interface CriterioAvaliacao {
  nome: string;
  descricao: string;
  peso: number;
  nota: number;
  feedback: string;
}

const temasRedacao: RedacaoTema[] = [
  {
    id: 1,
    titulo: "Desafios para a formação educacional de surdos no Brasil",
    descricao: "Tema ENEM 2017",
    textoMotivador: "A educação inclusiva é um direito garantido pela Constituição Federal de 1988. No entanto, pessoas surdas ainda enfrentam diversos obstáculos para ter acesso a uma formação educacional de qualidade.",
    instrucao: "Com base na leitura dos textos motivadores e nos conhecimentos construídos ao longo de sua formação, redija texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema 'Desafios para a formação educacional de surdos no Brasil', apresentando proposta de intervenção que respeite os direitos humanos.",
    ano: 2017,
    vestibular: "ENEM"
  },
  {
    id: 2,
    titulo: "Democratização do acesso ao cinema no Brasil",
    descricao: "Tema ENEM 2019",
    textoMotivador: "O cinema brasileiro tem grande potencial, mas ainda enfrenta desafios para democratizar o acesso da population à sétima arte, especialmente em regiões mais afastadas dos grandes centros urbanos.",
    instrucao: "Com base na leitura dos textos motivadores e nos conhecimentos construídos ao longo de sua formação, redija texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema 'Democratização do acesso ao cinema no Brasil', apresentando proposta de intervenção que respeite os direitos humanos.",
    ano: 2019,
    vestibular: "ENEM"
  },
  {
    id: 3,
    titulo: "O estigma associado às doenças mentais na sociedade brasileira",
    descricao: "Tema ENEM 2020",
    textoMotivador: "As doenças mentais afetam milhões de brasileiros, mas ainda existe muito preconceito e desinformação sobre o tema, dificultando o tratamento e a inclusão social dessas pessoas.",
    instrucao: "Com base na leitura dos textos motivadores e nos conhecimentos construídos ao longo de sua formação, redija texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema 'O estigma associado às doenças mentais na sociedade brasileira', apresentando proposta de intervenção que respeite os direitos humanos.",
    ano: 2020,
    vestibular: "ENEM"
  }
];

interface RedacaoAreaProps {
  onBack: () => void;
  selectedConfig: {
    university: string;
    firstChoice: string;
    secondChoice: string;
  };
}

export const RedacaoArea = ({ onBack, selectedConfig }: RedacaoAreaProps) => {
  const [temaAtual, setTemaAtual] = useState<RedacaoTema>(temasRedacao[0]);
  const [textoRedacao, setTextoRedacao] = useState("");
  const [tempoRestante, setTempoRestante] = useState(90 * 60); // 90 minutos em segundos
  const [iniciadoTempo, setIniciadoTempo] = useState(false);
  const [redacaoEnviada, setRedacaoEnviada] = useState(false);
  const [avaliacao, setAvaliacao] = useState<CriterioAvaliacao[] | null>(null);
  const [notaFinal, setNotaFinal] = useState<number | null>(null);

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

  const enviarRedacao = () => {
    if (textoRedacao.trim().length < 100) {
      alert("A redação deve ter pelo menos 100 caracteres.");
      return;
    }

    // Simulação de avaliação automática
    const criterios: CriterioAvaliacao[] = [
      {
        nome: "Competência 1",
        descricao: "Demonstrar domínio da modalidade escrita formal da língua portuguesa",
        peso: 200,
        nota: Math.floor(Math.random() * 5) * 40 + 120,
        feedback: "Apresenta bom domínio da norma culta, com alguns deslizes."
      },
      {
        nome: "Competência 2", 
        descricao: "Compreender a proposta de redação e aplicar conceitos das várias áreas de conhecimento",
        peso: 200,
        nota: Math.floor(Math.random() * 5) * 40 + 120,
        feedback: "Demonstra compreensão do tema e articula conhecimentos."
      },
      {
        nome: "Competência 3",
        descricao: "Selecionar, relacionar, organizar e interpretar informações para defender um ponto de vista",
        peso: 200,
        nota: Math.floor(Math.random() * 5) * 40 + 120,
        feedback: "Apresenta informações de forma organizada com argumentação consistente."
      },
      {
        nome: "Competência 4",
        descricao: "Demonstrar conhecimento dos mecanismos linguísticos para a construção da argumentação",
        peso: 200,
        nota: Math.floor(Math.random() * 5) * 40 + 120,
        feedback: "Utiliza conectivos e operadores argumentativos adequadamente."
      },
      {
        nome: "Competência 5",
        descricao: "Elaborar proposta de intervenção para o problema abordado, respeitando os direitos humanos",
        peso: 200,
        nota: Math.floor(Math.random() * 5) * 40 + 120,
        feedback: "Proposta de intervenção clara e bem fundamentada."
      }
    ];

    const notaTotal = criterios.reduce((sum, c) => sum + c.nota, 0);
    
    setAvaliacao(criterios);
    setNotaFinal(notaTotal);
    setRedacaoEnviada(true);
  };

  const reiniciarRedacao = () => {
    setTextoRedacao("");
    setTempoRestante(90 * 60);
    setIniciadoTempo(false);
    setRedacaoEnviada(false);
    setAvaliacao(null);
    setNotaFinal(null);
  };

  const contadorPalavras = textoRedacao.trim().split(/\s+/).filter(word => word.length > 0).length;
  const progressoPalavras = Math.min((contadorPalavras / 30) * 100, 100); // Meta: 30 linhas ≈ 400-500 palavras

  if (redacaoEnviada && avaliacao && notaFinal) {
    return (
      <div className="min-h-screen bg-gradient-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <Button variant="outline" onClick={onBack}>
                ← Voltar ao Dashboard
              </Button>
              <div className="text-center">
                <h1 className="text-2xl font-bold">Avaliação da Redação</h1>
                <p className="text-muted-foreground">{temaAtual.titulo}</p>
              </div>
              <div></div>
            </div>

            {/* Nota Final */}
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

            {/* Avaliação por Competência */}
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

            {/* Ações */}
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
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button variant="outline" onClick={onBack}>
              ← Voltar ao Dashboard
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-bold">Área de Redação</h1>
              <p className="text-muted-foreground">Pratique redação dissertativo-argumentativa</p>
            </div>
            <div className="flex items-center gap-4">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tema e Instruções */}
            <div className="lg:col-span-1 space-y-6">
              {/* Seletor de Tema */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Tema da Redação
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {temasRedacao.map((tema) => (
                    <button
                      key={tema.id}
                      onClick={() => setTemaAtual(tema)}
                      className={cn(
                        "w-full p-3 text-left rounded-lg border transition-all",
                        temaAtual.id === tema.id
                          ? "border-primary bg-accent"
                          : "border-muted hover:border-primary/50"
                      )}
                    >
                      <div className="font-medium text-sm mb-1">{tema.titulo}</div>
                      <div className="text-xs text-muted-foreground">{tema.descricao}</div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Instruções */}
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
            </div>

            {/* Editor de Texto */}
            <div className="lg:col-span-2">
              <Card className="shadow-elevated h-full">
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

                <CardContent className="flex-1">
                  <Textarea
                    placeholder="Comece sua redação aqui... Lembre-se de seguir a estrutura: introdução, desenvolvimento e conclusão com proposta de intervenção."
                    value={textoRedacao}
                    onChange={(e) => setTextoRedacao(e.target.value)}
                    className="min-h-[500px] resize-none text-base leading-6"
                    disabled={redacaoEnviada}
                  />
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="w-4 h-4" />
                      Mínimo: 100 caracteres | Recomendado: 400-500 palavras
                    </div>
                    
                    <div className="flex gap-2">
                      {textoRedacao && (
                        <Button variant="outline" onClick={reiniciarRedacao}>
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
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};