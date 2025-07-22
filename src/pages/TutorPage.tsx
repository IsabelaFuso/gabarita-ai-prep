// src/pages/TutorPage.tsx
import { Header } from "@/components/Header";
import { TutorView } from "@/components/TutorView";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";

const TutorPage = () => {
  const { user, loading } = useAuth();

  // Fornece um contexto inicial para o tutor.
  const initialTutorContext = {
    type: 'general',
    message: 'O usuário está na página principal do tutor.',
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <p className="ml-4 text-lg">Verificando autenticação...</p>
        </div>
      );
    }

    if (!user) {
      return (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-destructive" />
              Acesso Negado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Você precisa estar logado para acessar o Tutor de IA.</p>
            <p className="mt-2">Por favor, faça o login para continuar.</p>
          </CardContent>
        </Card>
      );
    }

    return <TutorView context={initialTutorContext} />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <div className="container mx-auto px-4 py-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default TutorPage;
