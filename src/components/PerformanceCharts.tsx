import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, TrendingDown, Target, BookOpen, BarChart3 } from "lucide-react";

interface PerformanceData {
  subject_name: string;
  accuracy: number;
  total_questions: number;
  correct_answers: number;
}

interface PerformanceChartsProps {
  data: PerformanceData[];
  overallScore: number;
  totalAttempts: number;
}

const COLORS = [
  '#3B82F6', // blue
  '#EF4444', // red
  '#10B981', // green
  '#F59E0B', // yellow
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#84CC16'  // lime
];

export const PerformanceCharts = ({ data, overallScore, totalAttempts }: PerformanceChartsProps) => {
  // Prepare data for charts
  const chartData = data.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length]
  }));

  const strengthsAndWeaknesses = data.length > 0 ? {
    strongest: [...data].sort((a, b) => b.accuracy - a.accuracy).slice(0, 2),
    weakest: [...data].sort((a, b) => a.accuracy - b.accuracy).slice(0, 2)
  } : { strongest: [], weakest: [] };

  if (data.length === 0) {
    return (
      <Card className="shadow-soft">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Responda algumas questões para ver análises detalhadas do seu desempenho
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Overall Performance Display */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Desempenho Geral
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{overallScore}%</div>
                  <div className="text-sm text-muted-foreground">acertos</div>
                </div>
              </div>
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke={overallScore >= 70 ? 'hsl(var(--success))' : 
                         overallScore >= 50 ? 'hsl(var(--warning))' : 'hsl(var(--destructive))'}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(overallScore / 100) * 351.86} 351.86`}
                />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">
              {totalAttempts} questões respondidas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Subject Performance Bar Chart */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Desempenho por Matéria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis 
                  dataKey="subject_name" 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, 'Acertos']}
                  labelFormatter={(label: any) => `Matéria: ${label}`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="accuracy" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Strengths and Weaknesses */}
      <Card className="shadow-soft lg:col-span-2">
        <CardHeader>
          <CardTitle>Análise de Pontos Fortes e Fracos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="space-y-3">
              <h3 className="font-semibold text-success flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Pontos Fortes
              </h3>
              {strengthsAndWeaknesses.strongest.length > 0 ? (
                strengthsAndWeaknesses.strongest.map((subject) => (
                  <div key={subject.subject_name} className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                    <div>
                      <p className="font-medium">{subject.subject_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {subject.total_questions} questões respondidas
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-success/20 text-success border-success/30">
                      {subject.accuracy}%
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  Continue praticando para identificar seus pontos fortes
                </div>
              )}
            </div>

            {/* Weaknesses */}
            <div className="space-y-3">
              <h3 className="font-semibold text-destructive flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Áreas para Melhoria
              </h3>
              {strengthsAndWeaknesses.weakest.length > 0 ? (
                strengthsAndWeaknesses.weakest.map((subject) => (
                  <div key={subject.subject_name} className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                    <div>
                      <p className="font-medium">{subject.subject_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {subject.total_questions} questões respondidas
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive/30">
                      {subject.accuracy}%
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  Continue praticando para identificar áreas de melhoria
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Distribution Pie Chart */}
      <Card className="shadow-soft lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Distribuição de Questões por Matéria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ subject_name, total_questions, percent }) => 
                    `${subject_name}: ${total_questions} (${(percent! * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  dataKey="total_questions"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`${value} questões`, 'Total']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};