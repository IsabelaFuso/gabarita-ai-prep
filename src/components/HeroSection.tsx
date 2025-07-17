import { ArrowRight, BookOpen, Brain, Target } from 'lucide-react';
import { Button } from './ui/button';
import heroImage from '../assets/hero-image.jpg';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  onStartQuiz: () => void;
  onStartSimulado: () => void;
}

export const HeroSection = ({ onStartQuiz, onStartSimulado }: HeroSectionProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else setMessage('Login bem-sucedido! Redirecionando...');
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else setMessage('Cadastro realizado! Verifique seu e-mail para confirmação.');
    setLoading(false);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-hero opacity-95" />
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full animate-float" />
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-primary-glow/30 rounded-full animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-accent/40 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Hero Text and Buttons */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl md:text-7xl font-bold text-black mb-6 animate-fade-in">
              Prepare-se para o
              <span className="block bg-gradient-to-r from-black to-primary-glow bg-clip-text text-transparent">
                Vestibular
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-black/90 mb-8 max-w-2xl lg:max-w-none mx-auto lg:mx-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Sistema completo de estudos com questões de ENEM, FUVEST, UNICAMP e UEM
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center lg:justify-start items-center mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button 
                onClick={onStartQuiz}
                size="lg" 
                variant="premium"
                className="text-lg px-8 py-6"
              >
                <Brain className="mr-2 h-5 w-5" />
                Praticar Questões
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                onClick={onStartSimulado}
                variant="outline" 
                size="lg"
                className="glass border-white/30 text-black hover:bg-white/10 text-lg px-8 py-6"
              >
                <Target className="mr-2 h-5 w-5" />
                Simulado Completo
              </Button>
            </div>
          </div>
          
          {/* Right Column: Login/Signup Form */}
          {!user && (
            <div className="flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <Tabs defaultValue="login" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Cadastro</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <Card className="glass border-white/30">
                    <CardHeader>
                      <CardTitle className="text-black">Login</CardTitle>
                      <CardDescription className="text-black">Acesse sua conta para continuar.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="login-email" className="text-black">Email</Label>
                          <Input id="login-email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="login-password" className="text-black">Senha</Label>
                          <Input id="login-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? 'Entrando...' : 'Entrar'}
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </TabsContent>
                <TabsContent value="signup">
                  <Card className="glass border-white/30">
                    <CardHeader>
                      <CardTitle className="text-black">Cadastro</CardTitle>
                      <CardDescription className="text-black">Crie sua conta para começar a praticar.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSignup}>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-email" className="text-black">Email</Label>
                          <Input id="signup-email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-password" className="text-black">Senha</Label>
                          <Input id="signup-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? 'Criando conta...' : 'Criar conta'}
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </TabsContent>
                {error && <p className="mt-4 text-center text-red-500">{error}</p>}
                {message && <p className="mt-4 text-center text-green-500">{message}</p>}
              </Tabs>
            </div>
          )}
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="glass p-6 rounded-lg text-black">
            <BookOpen className="h-8 w-8 text-primary-glow mx-auto mb-2" />
            <div className="text-2xl font-bold">1000+</div>
            <div className="text-black/80">Questões</div>
          </div>
          <div className="glass p-6 rounded-lg text-black">
            <Brain className="h-8 w-8 text-primary-glow mx-auto mb-2" />
            <div className="text-2xl font-bold">15+</div>
            <div className="text-black/80">Matérias</div>
          </div>
          <div className="glass p-6 rounded-lg text-black">
            <Target className="h-8 w-8 text-primary-glow mx-auto mb-2" />
            <div className="text-2xl font-bold">4</div>
            <div className="text-black/80">Vestibulares</div>
          </div>
        </div>
      </div>
    </section>
  );
};