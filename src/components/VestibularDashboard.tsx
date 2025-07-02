import { useState } from "react";
import { BookOpen, Target, Trophy, TrendingUp, PlayCircle, Users, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface VestibularDashboardProps {
  selectedConfig: {
    university: string;
    firstChoice: string;
    secondChoice: string;
  };
}

export const VestibularDashboard = ({ selectedConfig }: VestibularDashboardProps) => {
  const hasSelection = selectedConfig.university && selectedConfig.firstChoice;

  if (!hasSelection) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Configure sua Preparação</h3>
        <p className="text-muted-foreground">
          Selecione uma instituição e seus cursos de interesse para começar
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Study Session Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-soft hover:shadow-elevated transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questões Hoje</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">47</div>
            <p className="text-xs text-muted-foreground">+23% desde ontem</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-elevated transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Acerto</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">84%</div>
            <p className="text-xs text-muted-foreground">+7% esta semana</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-elevated transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Estudo</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">3h 42m</div>
            <p className="text-xs text-muted-foreground">Meta diária: 4h</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-elevated transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontuação</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">2,847</div>
            <p className="text-xs text-muted-foreground">Top 15% nacional</p>
          </CardContent>
        </Card>
      </div>

      {/* Study Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Simulados Personalizados</CardTitle>
            <CardDescription>
              Baseados nos seus cursos escolhidos e instituição alvo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" size="lg">
              <PlayCircle className="mr-2 h-5 w-5" />
              Simulado Completo - {selectedConfig.university.toUpperCase()}
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Target className="mr-2 h-4 w-4" />
              Foco no Meu Curso
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Clock className="mr-2 h-4 w-4" />
              Simulado Rápido (30 min)
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Banco de Questões</CardTitle>
            <CardDescription>
              Pratique por matéria ou área específica
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <BookOpen className="mr-2 h-4 w-4" />
              Questões por Matéria
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              Minhas Dificuldades
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Questões Comentadas
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance by Subject */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Desempenho por Área</CardTitle>
          <CardDescription>
            Acompanhe seu progresso nas principais matérias do vestibular
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { subject: "Matemática", progress: 88, questions: 142, color: "text-primary" },
            { subject: "Português", progress: 79, questions: 98, color: "text-success" },
            { subject: "Biologia", progress: 85, questions: 76, color: "text-warning" },
            { subject: "Química", progress: 71, questions: 54, color: "text-destructive" },
            { subject: "Física", progress: 66, questions: 67, color: "text-muted-foreground" },
            { subject: "História", progress: 82, questions: 43, color: "text-accent-foreground" }
          ].map((item) => (
            <div key={item.subject} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.subject}</span>
                  <Badge variant="outline">{item.questions} questões</Badge>
                </div>
                <span className={`font-bold ${item.color}`}>{item.progress}%</span>
              </div>
              <Progress value={item.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: "Hoje, 14:30", action: "Completou simulado de Matemática", score: "78%" },
              { time: "Ontem, 16:45", action: "Praticou 25 questões de Biologia", score: "84%" },
              { time: "Ontem, 10:20", action: "Revisou questões de Química", score: "71%" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <Badge variant="secondary">{activity.score}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};