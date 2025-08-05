import { useState, useEffect } from "react";
import { BookOpen, TrendingUp, Users, Filter, Brain, Star, Trophy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { QuestionCard } from "./QuestionCard";
import { type Question } from "@/data/types";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

type QuestionBankMode = 'menu' | 'by-subject' | 'weaknesses' | 'commented';

interface Subject {
  id: string;
  name: string;
  code: string;
  area: string;
}

interface WeakSubject {
  subject_name: string;
  accuracy: number;
  total_attempts: number;
}

export const QuestionBankView = ({ onBack }: { onBack: () => void }) => {
  const { user } = useAuth();
  const [mode, setMode] = useState<QuestionBankMode>('menu');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [weakSubjects, setWeakSubjects] = useState<WeakSubject[]>([]);

  useEffect(() => {
    fetchSubjects();
    if (user) {
      fetchWeakSubjects();
    }
  }, [user]);

  const fetchSubjects = async () => {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('area', { ascending: true });
    
    if (error) {
      console.error('Error fetching subjects:', error);
      return;
    }
    
    setSubjects(data || []);
  };

  const fetchWeakSubjects = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .rpc('get_user_performance_summary', { p_user_id: user.id });
    
    if (error) {
      console.error('Error fetching weak subjects:', error);
      return;
    }
    
    // Filtra matérias com menos de 60% de acerto e ordena pela menor accuracy
    const weak = data
      ?.filter(subject => subject.accuracy < 0.6 && subject.total_attempts >= 3)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 5) || [];
    
    setWeakSubjects(weak);
  };

  const startQuestionsBySubject = async () => {
    if (selectedSubjects.length === 0) {
      toast.error("Selecione pelo menos uma matéria");
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_custom_simulado_questions', {
        p_user_id: user?.id || '',
        p_university_name: 'ENEM',
        p_question_count: 20,
        p_subject_names: selectedSubjects,
        p_exclude_ids: null,
        p_prioritize_weaknesses: false
      });

      if (error) throw error;

      const questions: Question[] = data.map((q: any) => ({
        id: q.question_id,
        institution: q.institution_name || 'N/A',
        year: q.year,
        subject: q.subject_name || 'N/A',
        topic: q.topic_name || 'N/A',
        statement: q.statement,
        image: q.image_url || undefined,
        alternatives: q.alternatives,
        correctAnswer: q.alternatives.indexOf(q.correct_answer),
        explanation: q.explanation,
      }));

      setCurrentQuestions(questions);
      setCurrentQuestionIndex(0);
      setShowExplanation(false);
      setScore({ correct: 0, total: 0 });
      setMode('by-subject');
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error("Erro ao carregar questões");
    } finally {
      setLoading(false);
    }
  };

  const startWeaknessQuestions = async () => {
    if (weakSubjects.length === 0) {
      toast.error("Você precisa ter pelo menos 3 tentativas em uma matéria para identificar dificuldades");
      return;
    }
    
    setLoading(true);
    try {
      const weakSubjectNames = weakSubjects.map(s => s.subject_name);
      
      const { data, error } = await supabase.rpc('get_custom_simulado_questions', {
        p_user_id: user?.id || '',
        p_university_name: 'ENEM',
        p_question_count: 15,
        p_subject_names: weakSubjectNames,
        p_exclude_ids: null,
        p_prioritize_weaknesses: true
      });

      if (error) throw error;

      const questions: Question[] = data.map((q: any) => ({
        id: q.question_id,
        institution: q.institution_name || 'N/A',
        year: q.year,
        subject: q.subject_name || 'N/A',
        topic: q.topic_name || 'N/A',
        statement: q.statement,
        image: q.image_url || undefined,
        alternatives: q.alternatives,
        correctAnswer: q.alternatives.indexOf(q.correct_answer),
        explanation: q.explanation,
      }));

      setCurrentQuestions(questions);
      setCurrentQuestionIndex(0);
      setShowExplanation(false);
      setScore({ correct: 0, total: 0 });
      setMode('weaknesses');
    } catch (error) {
      console.error('Error fetching weakness questions:', error);
      toast.error("Erro ao carregar questões de dificuldades");
    } finally {
      setLoading(false);
    }
  };

  const startCommentedQuestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_custom_simulado_questions', {
        p_user_id: user?.id || '',
        p_university_name: 'ENEM',
        p_question_count: 10,
        p_subject_names: null,
        p_exclude_ids: null,
        p_prioritize_weaknesses: false
      });

      if (error) throw error;

      const questions: Question[] = data.map((q: any) => ({
        id: q.question_id,
        institution: q.institution_name || 'N/A',
        year: q.year,
        subject: q.subject_name || 'N/A',
        topic: q.topic_name || 'N/A',
        statement: q.statement,
        image: q.image_url || undefined,
        alternatives: q.alternatives,
        correctAnswer: q.alternatives.indexOf(q.correct_answer),
        explanation: q.explanation,
      }));

      setCurrentQuestions(questions);
      setCurrentQuestionIndex(0);
      setShowExplanation(false);
      setScore({ correct: 0, total: 0 });
      setMode('commented');
    } catch (error) {
      console.error('Error fetching commented questions:', error);
      toast.error("Erro ao carregar questões comentadas");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (selectedIndex: number) => {
    const isCorrect = selectedIndex === currentQuestions[currentQuestionIndex].correctAnswer;
    const newScore = { 
      correct: score.correct + (isCorrect ? 1 : 0), 
      total: score.total + 1 
    };
    setScore(newScore);
    setShowExplanation(true);

    // Salvar tentativa no banco
    if (user) {
      const question = currentQuestions[currentQuestionIndex];
      await supabase.from('user_attempts').insert({
        user_id: user.id,
        question_id: question.id,
        user_answer: question.alternatives[selectedIndex],
        is_correct: isCorrect,
        context: `banco_questoes_${mode}`
      });

      // Adicionar XP
      const xpGain = isCorrect ? 5 : 1;
      await supabase.rpc('update_user_stats', {
        p_user_id: user.id,
        p_time_increase: 30, // 30 segundos estimado por questão
        p_xp_increase: xpGain
      });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    } else {
      // Fim das questões
      toast.success(`Sessão finalizada! Você acertou ${score.correct} de ${score.total} questões`);
      setMode('menu');
    }
  };

  const handleReset = () => {
    setMode('menu');
    setCurrentQuestions([]);
    setCurrentQuestionIndex(0);
    setShowExplanation(false);
    setScore({ correct: 0, total: 0 });
  };

  if (mode === 'menu') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Banco de Questões</h2>
            <p className="text-muted-foreground">Pratique por matéria ou área específica</p>
          </div>
        </div>

        {/* Questões por Matéria */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Questões por Matéria
            </CardTitle>
            <CardDescription>
              Selecione as matérias que deseja praticar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {subjects.map(subject => (
                <div key={subject.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={subject.id}
                    checked={selectedSubjects.includes(subject.name)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedSubjects([...selectedSubjects, subject.name]);
                      } else {
                        setSelectedSubjects(selectedSubjects.filter(s => s !== subject.name));
                      }
                    }}
                  />
                  <label htmlFor={subject.id} className="text-sm font-medium">
                    {subject.name}
                  </label>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {selectedSubjects.length} matéria(s) selecionada(s)
              </p>
              <Button onClick={startQuestionsBySubject} disabled={loading}>
                {loading ? "Carregando..." : "Iniciar Prática"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Minhas Dificuldades */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-warning" />
              Minhas Dificuldades
            </CardTitle>
            <CardDescription>
              Baseado nas questões que você menos acertou
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {weakSubjects.length > 0 ? (
              <>
                <div className="space-y-2">
                  {weakSubjects.slice(0, 3).map((subject, index) => (
                    <div key={subject.subject_name} className="flex justify-between items-center p-2 bg-warning/10 rounded-lg">
                      <span className="font-medium">{subject.subject_name}</span>
                      <Badge variant="destructive">
                        {Math.round(subject.accuracy * 100)}% de acerto
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button onClick={startWeaknessQuestions} disabled={loading} className="w-full">
                  {loading ? "Carregando..." : "Praticar Dificuldades"}
                </Button>
              </>
            ) : (
              <div className="text-center py-6">
                <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  Responda mais questões para identificarmos suas dificuldades
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Questões Comentadas */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-info" />
              Questões Comentadas
            </CardTitle>
            <CardDescription>
              Questões com explicações detalhadas e ajuda da IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="w-4 h-4" />
                <span>Explicações passo a passo</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Trophy className="w-4 h-4" />
                <span>Tutor IA disponível para cada questão</span>
              </div>
              <Button onClick={startCommentedQuestions} disabled={loading} className="w-full">
                {loading ? "Carregando..." : "Iniciar Questões Comentadas"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Modo de questões ativa
  const currentQuestion = currentQuestions[currentQuestionIndex];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Menu
        </Button>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            Questão {currentQuestionIndex + 1} de {currentQuestions.length}
          </p>
          <p className="text-sm font-medium">
            Acertos: {score.correct}/{score.total} ({score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%)
          </p>
        </div>
      </div>

      {/* Progresso */}
      <Card className="shadow-soft">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso da Sessão</span>
              <span>{currentQuestionIndex + 1}/{currentQuestions.length}</span>
            </div>
            <Progress value={((currentQuestionIndex + 1) / currentQuestions.length) * 100} />
          </div>
        </CardContent>
      </Card>

      {/* Questão Atual */}
      {currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          onAnswer={handleAnswer}
          showExplanation={showExplanation}
          onNext={handleNext}
          isLastQuestion={currentQuestionIndex === currentQuestions.length - 1}
          onReset={handleReset}
        />
      )}
    </div>
  );
};