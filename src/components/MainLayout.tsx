import { ReactNode } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <HeroSection />
        {children}
      </main>
    </div>
  );
};