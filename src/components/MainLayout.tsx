import { ReactNode } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { AchievementNotification } from "@/components/AchievementNotification";
import { useAppState } from "@/hooks/useAppState";
import ReactConfetti from "react-confetti";

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
  const { 
    showConfetti, 
    achievements, 
    showAchievementNotification, 
    closeAchievementNotification 
  } = useAppState();

  return (
    <div className="min-h-screen">
      {showConfetti && <ReactConfetti width={window.innerWidth} height={window.innerHeight} />}
      <Header currentView={currentView} onNavigate={onNavigate} />
      
      <main>
      {showHero && (
        <HeroSection />
      )}
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>

      <AchievementNotification
        achievements={achievements}
        show={showAchievementNotification}
        onClose={closeAchievementNotification}
      />
    </div>
  );
};