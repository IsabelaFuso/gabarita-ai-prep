import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  PlayCircle, 
  Clock, 
  Target, 
  BookOpen, 
  Trophy,
  Users,
  Timer,
  CheckCircle,
  Star,
  Zap
} from "lucide-react";

interface SimuladosViewProps {
  selectedConfig: {
    university: string;
    firstChoice: string;
    secondChoice: string;
  };
  onStartSimulado: () => void;
}

export const SimuladosView = ({ selectedConfig, onStartSimulado }: SimuladosViewProps) => {
  const simuladoTypes = [
    {
      title: "Simulado Completo",
      description: "Prova completa seguindo o padrão oficial",
      icon: BookOpen,
      duration: "4h 30min",
      questions: 90,
      difficulty: "Oficial",
      badge: "Recomendado",
      badgeVariant: "default" as const,
      features: ["Todas as matérias", "Cronômetro oficial", "Correção detalhada"]
    },
    {
      title: "Simulado Rápido",
      description: "Versão reduzida para treino diário",
      icon: Zap,
      duration: "1h",
      questions: 30,
      difficulty: "Moderado",
      badge: "Popular",
      badgeVariant: "secondary" as const,
      features: ["Questões essenciais", "Feedback instantâneo", "Foco na velocidade"]
    },
    {
      title: "Simulado por Área",
      description: "Concentre-se em matérias específicas",
      icon: Target,
      duration: "2h",
      questions: 45,
      difficulty: "Personalizável",
      badge: "Flexível",
      badgeVariant: "outline" as const,
      features: ["Escolha as matérias", "Nível adaptativo", "Análise detalhada"]
    }
  ];

  const recentSimulados = [
    { date: "Hoje", type: "Simulado Rápido", score: 84, time: "48min", status: "completed" },
    { date: "Ontem", type: "Simulado por Área - Exatas", score: 78, time: "1h 32min", status: "completed" },
    { date: "2 dias atrás", type: "Simulado Completo", score: 71, time: "4h 12min", status: "completed" },
    { date: "3 dias atrás", type: "Simulado Rápido", score: 89, time: "42min", status: "completed" }
  ];

  const challenges = [
    {
      title: "Desafio Semanal",
      description: "Complete 5 simulados rápidos esta semana",
      progress: 3,
      total: 5,
      reward: "Badge Dedicação",
      icon: Trophy
    },
    {
      title: "Maratona do Mês",
      description: "Alcance 85% de média em simulados completos",
      progress: 78.5,
      total: 85,
      reward: "Certificado Excelência",
      icon: Star
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Simulados {selectedConfig.university.toUpperCase()}
        </h2>
        <p className="text-muted-foreground">
          Prepare-se com simulados personalizados para {selectedConfig.firstChoice}
        </p>
      </div>

      {/* Simulado Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {simuladoTypes.map((simulado) => (
          <Card key={simulado.title} className="shadow-soft hover:shadow-elevated transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="flex items-center justify-between">
                <simulado.icon className="w-8 h-8 text-primary" />
                <Badge variant={simulado.badgeVariant}>{simulado.badge}</Badge>
              </div>
              <CardTitle className="text-xl">{simulado.title}</CardTitle>
              <CardDescription>{simulado.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="space-y-1">
                  <Clock className="w-4 h-4 mx-auto text-muted-foreground" />
                  <p className="text-xs font-medium">{simulado.duration}</p>
                </div>
                <div className="space-y-1">
                  <BookOpen className="w-4 h-4 mx-auto text-muted-foreground" />
                  <p className="text-xs font-medium">{simulado.questions} questões</p>
                </div>
                <div className="space-y-1">
                  <Target className="w-4 h-4 mx-auto text-muted-foreground" />
                  <p className="text-xs font-medium">{simulado.difficulty}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {simulado.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-xs text-muted-foreground">
                    <CheckCircle className="w-3 h-3 mr-2 text-success" />
                    {feature}
                  </div>
                ))}
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={onStartSimulado}
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Iniciar {simulado.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Challenges */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            Desafios Ativos
          </CardTitle>
          <CardDescription>
            Complete desafios e ganhe recompensas especiais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {challenges.map((challenge, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <challenge.icon className="w-6 h-6 text-primary" />
                  <div>
                    <h4 className="font-medium">{challenge.title}</h4>
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                  </div>
                </div>
                <Badge variant="outline">{challenge.reward}</Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progresso</span>
                  <span>{challenge.progress}/{challenge.total}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Simulados */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Histórico Recente
          </CardTitle>
          <CardDescription>
            Seus últimos resultados em simulados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentSimulados.map((simulado, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <div>
                    <p className="font-medium text-sm">{simulado.type}</p>
                    <p className="text-xs text-muted-foreground">{simulado.date} • {simulado.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={simulado.score >= 80 ? "default" : simulado.score >= 70 ? "secondary" : "outline"}
                  >
                    {simulado.score}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};