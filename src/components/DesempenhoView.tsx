import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock, 
  Trophy, 
  BookOpen, 
  BarChart3,
  Calendar,
  Award,
  RefreshCw
} from "lucide-react";

interface DesempenhoViewProps {
  selectedConfig: {
    university: string;
    firstChoice: string;
    secondChoice: string;
  };
}

export const DesempenhoView = ({ selectedConfig }: DesempenhoViewProps) => {
  const performanceData = [
    { subject: "Matemática", score: 88, trend: 5, color: "text-primary", questions: 142 },
    { subject: "Português", score: 79, trend: -2, color: "text-success", questions: 98 },
    { subject: "Biologia", score: 85, trend: 8, color: "text-warning", questions: 76 },
    { subject: "Química", score: 71, trend: 3, color: "text-destructive", questions: 54 },
    { subject: "Física", score: 66, trend: -1, color: "text-muted-foreground", questions: 67 },
    { subject: "História", score: 82, trend: 4, color: "text-accent-foreground", questions: 43 }
  ];

  const weeklyData = [
    { day: "Seg", questions: 25, score: 78, time: "2h 30m" },
    { day: "Ter", questions: 32, score: 84, time: "3h 15m" },
    { day: "Qua", questions: 18, score: 71, time: "1h 45m" },
    { day: "Qui", questions: 41, score: 89, time: "4h 20m" },
    { day: "Sex", questions: 29, score: 76, time: "2h 50m" },
    { day: "Sáb", questions: 35, score: 92, time: "3h 40m" },
    { day: "Dom", questions: 22, score: 68, time: "2h 10m" }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">78.5%</div>
            <div className="flex items-center text-xs text-success">
              <TrendingUp className="w-3 h-3 mr-1" />
              +5.2% este mês
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Total</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">127h</div>
            <p className="text-xs text-muted-foreground">Nas últimas 4 semanas</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questões</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">1,247</div>
            <p className="text-xs text-muted-foreground">Total respondidas</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ranking</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">Top 15%</div>
            <p className="text-xs text-muted-foreground">Nacional - {selectedConfig.university.toUpperCase()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance by Subject */}
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Desempenho por Matéria</CardTitle>
              <CardDescription>
                Análise detalhada do seu progresso em cada área
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {performanceData.map((item) => (
            <div key={item.subject} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{item.subject}</span>
                  <Badge variant="outline">{item.questions} questões</Badge>
                  <div className="flex items-center text-xs">
                    {item.trend > 0 ? (
                      <TrendingUp className="w-3 h-3 text-success mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-destructive mr-1" />
                    )}
                    <span className={item.trend > 0 ? "text-success" : "text-destructive"}>
                      {item.trend > 0 ? "+" : ""}{item.trend}%
                    </span>
                  </div>
                </div>
                <span className={`font-bold text-lg ${item.color}`}>{item.score}%</span>
              </div>
              <Progress value={item.score} className="h-3" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Weekly Activity */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Atividade Semanal</CardTitle>
          <CardDescription>
            Acompanhe sua consistência nos estudos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weeklyData.map((day) => (
              <div key={day.day} className="text-center space-y-2">
                <div className="text-xs font-medium text-muted-foreground">{day.day}</div>
                <Card className="p-3 space-y-1">
                  <div className="text-sm font-bold text-primary">{day.questions}</div>
                  <div className="text-xs text-muted-foreground">questões</div>
                  <div className="text-sm font-medium text-success">{day.score}%</div>
                  <div className="text-xs text-muted-foreground">{day.time}</div>
                </Card>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Goals and Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Metas do Mês
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Questões (Meta: 500)</span>
                <span className="font-medium">347/500</span>
              </div>
              <Progress value={69.4} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tempo de Estudo (Meta: 40h)</span>
                <span className="font-medium">28h/40h</span>
              </div>
              <Progress value={70} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Média Geral (Meta: 80%)</span>
                <span className="font-medium">78.5%/80%</span>
              </div>
              <Progress value={98.1} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Conquistas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
              <Trophy className="w-8 h-8 text-success" />
              <div>
                <p className="font-medium text-sm">Sequência de 7 dias!</p>
                <p className="text-xs text-muted-foreground">Parabéns pela consistência</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
              <Target className="w-8 h-8 text-primary" />
              <div>
                <p className="font-medium text-sm">100 questões de Matemática</p>
                <p className="text-xs text-muted-foreground">Marco alcançado!</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-warning/10 rounded-lg">
              <BarChart3 className="w-8 h-8 text-warning" />
              <div>
                <p className="font-medium text-sm">Melhoria em Química</p>
                <p className="text-xs text-muted-foreground">+15% de acertos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};