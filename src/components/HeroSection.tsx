import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// --- INSTRUÇÃO IMPORTANTE ---
// A imagem de fundo está sendo carregada de um link externo como um placeholder.
// Para produção, baixe esta imagem e a coloque na pasta `src/assets`, 
// depois atualize o caminho no `style` abaixo.
// Link da imagem: https://images.pexels.com/photos/7108113/pexels-photo-7108113.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2
const heroImageUrl = 'https://images.pexels.com/photos/7108113/pexels-photo-7108113.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

export const HeroSection = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(false);
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
        // O hook de autenticação cuidará do redirecionamento
      } else {
        setMessage('Cadastro realizado! Verifique seu e-mail para confirmação.');
        setEmail('');
        setPassword('');
      }
    }
    setLoading(false);
  };

  // Não renderiza nada se o usuário estiver logado (o hook já redireciona)
  if (user) return null;

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${heroImageUrl})` }}
    >
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Coluna de Texto Persuasivo */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 animate-fade-in">
              Sua Aprovação Começa Aqui.
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg mx-auto lg:mx-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              A plataforma de estudos com <span className="text-primary font-semibold">Inteligência Artificial</span> que personaliza seu aprendizado e acelera seus resultados. Do ENEM à FUVEST, domine todas as provas.
            </p>
          </div>
          
          {/* Coluna do Formulário */}
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Card className="w-full max-w-md bg-black/30 backdrop-blur-lg border-white/20 text-white">
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {isLogin ? 'Acesse Sua Conta' : 'Crie Sua Conta Grátis'}
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    {isLogin ? 'Bem-vindo de volta!' : 'Comece a evoluir nos estudos hoje mesmo.'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="seu@email.com" 
                      required 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/10 border-white/20 focus:ring-primary text-white"
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
                      className="bg-white/10 border-white/20 focus:ring-primary text-white"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-stretch">
                  <Button type="submit" variant="premium" size="lg" disabled={loading}>
                    {loading ? (isLogin ? 'Entrando...' : 'Criando...') : (isLogin ? 'Entrar' : 'Criar Minha Conta')}
                  </Button>
                  <button 
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError(null);
                      setMessage(null);
                    }}
                    className="mt-4 text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
                  </button>
                </CardFooter>
              </form>
              {error && <p className="p-4 pt-0 text-center text-red-400">{error}</p>}
              {message && <p className="p-4 pt-0 text-center text-green-400">{message}</p>}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
