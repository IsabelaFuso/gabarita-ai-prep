import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { ForgotPassword } from './ForgotPassword';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Target, 
  Trophy, 
  Brain, 
  Zap, 
  CheckCircle, 
  Star,
  TrendingUp,
  Award,
  ArrowRight,
  Users,
  BookOpen,
  Clock
} from "lucide-react";

export const ConversionHeroSection = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/'); // Redireciona se o usuário já está logado
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const authFunction = isLogin 
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({ email, password });

    const { error } = await authFunction;

    if (error) {
      setError(error.message);
    } else {
      if (isLogin) {
        setMessage('Login bem-sucedido! Redirecionando...');
      } else {
        setMessage('Cadastro realizado! Verifique seu e-mail para confirmação.');
        setEmail('');
        setPassword('');
      }
    }
    setLoading(false);
  };

  // Não renderiza nada se o usuário estiver logado
  if (user) return null;

  if (showForgotPassword) {
    return <ForgotPassword onBack={() => setShowForgotPassword(false)} />;
  }

  const benefits = [
    {
      icon: Brain,
      title: "IA Personalizada",
      description: "Sistema de aprendizado adaptativo que evolui com você"
    },
    {
      icon: Target,
      title: "Foco no Resultado",
      description: "Preparação direcionada para sua universidade dos sonhos"
    },
    {
      icon: Trophy,
      title: "Aprovação Garantida",
      description: "98% dos nossos alunos são aprovados nos vestibulares"
    },
    {
      icon: Clock,
      title: "Economia de Tempo",
      description: "Estude 50% menos tempo com 300% mais eficiência"
    }
  ];

  const socialProof = [
    { number: "12.847", label: "Estudantes Aprovados" },
    { number: "98%", label: "Taxa de Aprovação" },
    { number: "4.9★", label: "Avaliação dos Usuários" },
    { number: "150+", label: "Universidades Parceiras" }
  ];

  return (
    <section className="relative min-h-screen bg-gradient-academic overflow-hidden">
      {/* Academic Pattern Background */}
      <div className="absolute inset-0 academic-pattern" />
      <div className="absolute inset-0 formula-overlay" />
      
      {/* Animated Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary-glow/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
          
          {/* Coluna de Conteúdo Persuasivo */}
          <div className="space-y-6 animate-slide-in-up">
            {/* Header com Social Proof */}
            <div className="text-center lg:text-left space-y-4">
              <Badge variant="secondary" className="glass text-primary border-primary/20">
                <Star className="w-4 h-4 mr-2 fill-current" />
                #1 Plataforma de Vestibular do Brasil
              </Badge>

              <h1 className="text-3xl md:text-5xl font-bold leading-tight text-white">
                Sua
                <span className="bg-gradient-to-r from-primary-glow to-primary bg-clip-text text-transparent"> Aprovação</span>
                <br />
                Começa Aqui.
              </h1>

              <p className="text-base text-white/90 max-w-2xl">
                A única plataforma que usa <span className="text-primary-glow font-semibold">Inteligência Artificial</span> para 
                personalizar seus estudos e <span className="text-primary-glow font-semibold">acelerar sua aprovação</span> em até 3x.
              </p>
            </div>

            {/* Social Proof Numbers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {socialProof.map((stat, index) => (
                <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="text-lg md:text-xl font-bold text-primary-glow">{stat.number}</div>
                  <div className="text-2xs text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="glass p-6 rounded-xl hover:shadow-glow transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                >
                  <benefit.icon className="w-8 h-8 text-primary-glow mb-3" />
                  <h3 className="text-base font-semibold text-black mb-2">{benefit.title}</h3>
                  <p className="text-black/70 text-xs">{benefit.description}</p>
                </div>
              ))}
            </div>

            {/* Urgency & Scarcity */}
            <div className="glass p-4 rounded-xl border-primary/30 animate-pulse-glow">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                <span className="text-base text-black">Oferta Limitada!</span>
              </div>
              <p className="text-2xs text-black/90 mb-3">
                Apenas <span className="text-primary-glow">97 vagas restantes</span> para o programa de mentoria personalizada. 
                Garante sua vaga agora e comece a estudar hoje mesmo!
              </p>
              <div className="flex items-center gap-2 text-2xs text-black/70">
                <Users className="w-4 h-4" />
                <span>2.847 pessoas se cadastraram nas últimas 24h</span>
              </div>
            </div>
          </div>
          
          {/* Coluna do Formulário Otimizado */}
          <div className="flex justify-center animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
            <Card className="w-full max-w-sm glass-strong border-primary/20 shadow-xl">
              <form onSubmit={handleSubmit}>
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <GraduationCap className="w-8 h-8 text-primary-glow" />
                    <span className="text-xl text-foreground">VestibularIA</span>
                  </div>
                  <CardTitle className="text-xl text-foreground">
                    {isLogin ? 'Acesse Sua Conta' : 'Comece Sua Jornada'}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {isLogin ? 'Bem-vindo de volta, futuro universitário!' : 'Crie sua conta e transforme seus estudos em 30 segundos.'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {!isLogin && (
                    <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <CheckCircle className="w-5 h-5 text-primary-glow" />
                      <span className="text-xs text-foreground">7 dias grátis + Mentoria personalizada</span>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="seu@email.com" 
                      required 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-transparent border-border focus:ring-primary text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••"
                      required 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-transparent border-border focus:ring-primary text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  {!isLogin && (
                    <div className="space-y-3 p-4 bg-white/5 rounded-lg">
                      <div className="text-xs text-foreground">✨ O que você ganha agora:</div>
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-primary-glow" />
                          <span>Simulados personalizados com IA</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-primary-glow" />
                          <span>Análise preditiva de temas</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-primary-glow" />
                          <span>Mentoria com especialistas</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex flex-col items-stretch pt-2">
                  <Button 
                    type="submit" 
                    variant="academic" 
                    size="lg" 
                    disabled={loading}
                    className="relative overflow-hidden group"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {loading ? (
                        'Processando...'
                      ) : (
                        <>
                          {isLogin ? 'Entrar na Minha Conta' : 'Quero Começar Agora'}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                  </Button>
                  
                  <button 
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError(null);
                      setMessage(null);
                    }}
                    className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isLogin ? 'Ainda não tem conta? Cadastre-se grátis' : 'Já tenho conta? Fazer login'}
                  </button>

                  {!isLogin && (
                    <div className="mt-4 text-center">
                      <div className="text-2xs text-muted-foreground/80 mb-2">Mais de 12.000 estudantes já transformaram seus resultados:</div>
                  <div className="flex justify-center items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-2xs text-muted-foreground ml-2">4.9/5 ⭐</span>
                  </div>
                    </div>
                  )}

                  {isLogin && (
                    <div className="text-center mt-4">
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-primary hover:underline"
                      >
                        Esqueci minha senha
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </form>
              
              {error && (
                <div className="p-4 pt-0">
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                    <p className="text-center text-destructive-foreground text-sm">{error}</p>
                  </div>
                </div>
              )}
              
              {message && (
                <div className="p-4 pt-0">
                  <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                    <p className="text-center text-success-foreground text-sm">{message}</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};