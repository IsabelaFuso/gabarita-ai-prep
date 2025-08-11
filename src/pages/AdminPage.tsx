
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import QuestionEditor from '@/components/Admin/QuestionEditor';
import { MainLayout } from '@/components/MainLayout';

const AdminPage = () => {
  const { user } = useAuth();

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

  return (
    <MainLayout
      onStartQuiz={() => {}}
      onStartSimulado={() => {}}
      onNavigate={() => {}}
      showHero={false}
      currentView="admin"
    >
      <QuestionEditor />
    </MainLayout>
  );
};

export default AdminPage;
