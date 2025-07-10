import { ReactNode } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";

interface MainLayoutProps {
  children: ReactNode;
  onStartQuiz: () => void;
  onStartSimulado: () => void;
}

export const MainLayout = ({ children, onStartQuiz, onStartSimulado }: MainLayoutProps) => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <HeroSection onStartQuiz={onStartQuiz} onStartSimulado={onStartSimulado} />
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};