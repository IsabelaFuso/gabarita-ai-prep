import { useState, useEffect, useCallback } from "react";
import { BookOpen, TrendingUp, Users, Filter, Brain, Star, Trophy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const [userAnswers, setUserAnswers] = useState<(string | number | null)[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [weakSubjects, setWeakSubjects] = useState<WeakSubject[]>([]);

  useEffect(() => {
    fetchSubjects();
    if (user) {
      fetchWeakSubjects();
    }
  }, [user, fetchSubjects, fetchWeakSubjects]);

  const fetchSubjects = useCallback(async () => {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('area', { ascending: true });
    
    if (error) {
      console.error('Error fetching subjects:', error);
      return;
    }
    
    setSubjects(data || []);
  }, []);

  const fetchWeakSubjects = useCallback(async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .rpc('get_user_performance_summary', { p_user_id: user.id });
    
    if (error) {
      console.error('Error fetching weak subjects:', error);
      return;
    }
    
    const weak = data
      ?.filter((subject: WeakSubject) => subject.accuracy < 0.6 && subject.total_attempts >= 3)
      .sort((a: WeakSubject, b: WeakSubject) => a.accuracy - b.accuracy)
      .slice(0, 5) || [];
    
    setWeakSubjects(weak);
  }, [user]);
  
  const mapDataToQuestions = (data: any[]): Question[] => {
    return data.map((q: any) => ({
      id: q.question_id,
      institution: { name: q.institution_name || 'N/A' },
      year: q.year,
      subject: { name: q.subject_name || 'N/A' },
      topic: { name: q.topic_name || 'N/A' },
      statement: q.statement,
      image_url: q.image_url || undefined,
      type: q.type,
      options: q.options,
      correct_answers: q.correct_answers,
      correct_sum: q.correct_sum,
      explanation: q.explanation,
    }));
  };

  const startQuestionSession = async (fetcher: () => Promise<{ data: any[], error: any }>) => {
    setLoading(true);
    try {
      const { data, error } = await fetcher();
      if (error) throw error;

      const questions = mapDataToQuestions(data);
      setCurrentQuestions(questions);
      setUserAnswers(new Array(questions.length).fill(null));
      setCurrentQuestionIndex(0);
      setShowExplanation(false);
      setScore({ correct: 0, total: 0 });
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error("Erro ao carregar questões");
    } finally {
      setLoading(false);
    }
  };

  const startQuestionsBySubject = async () => {
    if (selectedSubjects.length === 0) {
      toast.error("Selecione pelo menos uma matéria");
      return;
    }
    setMode('by-subject');
    await startQuestionSession(() => 
      supabase.rpc('get_custom_simulado_questions', {
        p_user_id: user?.id || '',
        p_university_name: 'ENEM',
        p_question_count: 20,
        p_subject_names: selectedSubjects,
        p_exclude_ids: null,
        p_prioritize_weaknesses: false
      })
    );
  };

  const startWeaknessQuestions = async () => {
    if (weakSubjects.length === 0) {
      toast.error("Você precisa ter pelo menos 3 tentativas em uma matéria para identificar dificuldades");
      return;
    }
    const weakSubjectNames = weakSubjects.map(s => s.subject_name);
    setMode('weaknesses');
    await startQuestionSession(() =>
      supabase.rpc('get_custom_simulado_questions', {
        p_user_id: user?.id || '',
        p_university_name: 'ENEM',
        p_question_count: 15,
        p_subject_names: weakSubjectNames,
        p_exclude_ids: null,
        p_prioritize_weaknesses: true
      })
    );
  };

  const startCommentedQuestions = async () => {
    setMode('commented');
    await startQuestionSession(() =>
      supabase.rpc('get_custom_simulado_questions', {
        p_user_id: user?.id || '',
        p_university_name: 'ENEM',
        p_question_count: 10,
        p_subject_names: null,
        p_exclude_ids: null,
        p_prioritize_weaknesses: false
      })
    );
  };

  const handleAnswer = async (answer: string | number) => {
    const question = currentQuestions[currentQuestionIndex];
    let isCorrect = false;
    if (question.type === 'summation') {
      isCorrect = answer === question.correct_sum;
    } else {
      isCorrect = answer === question.correct_answers.answer;
    }

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);

    const newScore = { 
      correct: score.correct + (isCorrect ? 1 : 0), 
      total: score.total + 1 
    };
    setScore(newScore);
    setShowExplanation(true);

    if (user) {
      await supabase.from('user_attempts').insert({
        user_id: user.id,
        question_id: question.id,
        user_answer: String(answer),
        is_correct: isCorrect,
        context: `banco_questoes_${mode}`
      });
      const xpGain = isCorrect ? 5 : 1;
      await supabase.rpc('update_user_stats', {
        p_user_id: user.id,
        p_time_increase: 30,
        p_xp_increase: xpGain
      });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    } else {
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
          <Button variant="outline" size="sm" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Banco de Questões</h2>
            <p className="text-muted-foreground">Pratique por matéria ou área específica</p>
          </div>
        </div>
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" /> Questões por Matéria</CardTitle>
            <CardDescription>Selecione as matérias que deseja praticar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {subjects.map(subject => (
                <div key={subject.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={subject.id}
                    checked={selectedSubjects.includes(subject.name)}
                    onCheckedChange={(checked) => {
                      setSelectedSubjects(prev => checked ? [...prev, subject.name] : prev.filter(s => s !== subject.name));
                    }}
                  />
                  <label htmlFor={subject.id} className="text-sm font-medium">{subject.name}</label>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">{selectedSubjects.length} matéria(s) selecionada(s)</p>
              <Button onClick={startQuestionsBySubject} disabled={loading}>{loading ? "Carregando..." : "Iniciar Prática"}</Button>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-warning" /> Minhas Dificuldades</CardTitle>
            <CardDescription>Baseado nas questões que você menos acertou</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {weakSubjects.length > 0 ? (
              <>
                <div className="space-y-2">
                  {weakSubjects.slice(0, 3).map((subject) => (
                    <div key={subject.subject_name} className="flex justify-between items-center p-2 bg-warning/10 rounded-lg">
                      <span className="font-medium">{subject.subject_name}</span>
                      <Badge variant="destructive">{Math.round(subject.accuracy * 100)}% de acerto</Badge>
                    </div>
                  ))}
                </div>
                <Button onClick={startWeaknessQuestions} disabled={loading} className="w-full">{loading ? "Carregando..." : "Praticar Dificuldades"}</Button>
              </>
            ) : (
              <div className="text-center py-6">
                <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Responda mais questões para identificarmos suas dificuldades</p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-info" /> Questões Comentadas</CardTitle>
            <CardDescription>Questões com explicações detalhadas e ajuda da IA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Star className="w-4 h-4" /><span>Explicações passo a passo</span></div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Trophy className="w-4 h-4" /><span>Tutor IA disponível para cada questão</span></div>
              <Button onClick={startCommentedQuestions} disabled={loading} className="w-full">{loading ? "Carregando..." : "Iniciar Questões Comentadas"}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = currentQuestions[currentQuestionIndex];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Voltar ao Menu
        </Button>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Questão {currentQuestionIndex + 1} de {currentQuestions.length}</p>
          <p className="text-sm font-medium">Acertos: {score.correct}/{score.total} ({score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%)</p>
        </div>
      </div>
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
      {currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          onAnswer={handleAnswer}
          showExplanation={showExplanation}
          onNext={handleNext}
          isLastQuestion={currentQuestionIndex === currentQuestions.length - 1}
          onReset={handleReset}
          userAnswer={userAnswers[currentQuestionIndex]}
        />
      )}
    </div>
  );
};