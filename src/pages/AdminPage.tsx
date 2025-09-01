
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import QuestionEditor from '@/components/Admin/QuestionEditor';
import QuestionAutoRegistration from '@/components/Admin/QuestionAutoRegistration';
import PDFFileBank from '@/components/Admin/PDFFileBank';
import { MainLayout } from '@/components/MainLayout';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, Upload, Database } from 'lucide-react';

const AdminPage = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'editor' | 'autoregister' | 'filebank'>('dashboard');

  if (!user) {
    return (
        <MainLayout onStartQuiz={() => {}} onStartSimulado={() => {}}>
            <div className="container mx-auto p-4 text-center">
                <h1 className="text-2xl font-bold">Carregando...</h1>
                <p>Verificando suas credenciais de acesso.</p>
            </div>
        </MainLayout>
    );
  }

  if (user.email !== 'prof.rafaelfuso@gmail.com') {
    return (
        <MainLayout onStartQuiz={() => {}} onStartSimulado={() => {}}>
            <div className="container mx-auto p-4 text-center">
                <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
                <p>Você não tem permissão para acessar esta página.</p>
            </div>
        </MainLayout>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'editor':
        return <QuestionEditor />;
      case 'autoregister':
        return <QuestionAutoRegistration />;
      case 'filebank':
        return <PDFFileBank />;
      default:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Painel Administrativo</h1>
              <p className="text-muted-foreground">
                Gerencie questões e conteúdo da plataforma
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentView('editor')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Editor de Questões</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Criar e editar questões manualmente
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentView('autoregister')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Autocadastro IA</CardTitle>
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Extrair questões automaticamente com IA
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentView('filebank')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Banco de PDFs</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Gerenciar arquivos PDF de questões
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <MainLayout
      onStartQuiz={() => {}}
      onStartSimulado={() => {}}
      onNavigate={() => {}}
      showHero={false}
      currentView="admin"
    >
      <div className="space-y-4">
        {currentView !== 'dashboard' && (
          <Button 
            variant="outline" 
            onClick={() => setCurrentView('dashboard')}
            className="mb-4"
          >
            ← Voltar ao Dashboard
          </Button>
        )}
        {renderContent()}
      </div>
    </MainLayout>
  );
};

export default AdminPage;
