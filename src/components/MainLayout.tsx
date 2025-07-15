import { ReactNode } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";

interface MainLayoutProps {
  children: ReactNode;
  onStartQuiz: () => void;
  onStartSimulado: () => void;
  currentView?: string;
  onNavigate?: (view: string) => void;
  showHero?: boolean;
}

export const MainLayout = ({ 
  children, 
  onStartQuiz, 
  onStartSimulado, 
  currentView = 'dashboard',
  onNavigate,
  showHero = true 
}: MainLayoutProps) => {
  return (
    <div className="min-h-screen">
      <Header currentView={currentView} onNavigate={onNavigate} />
      
      <main>
        {showHero && (
          <HeroSection onStartQuiz={onStartQuiz} onStartSimulado={onStartSimulado} />
        )}
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};