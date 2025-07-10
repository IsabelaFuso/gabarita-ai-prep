import { ArrowRight, BookOpen, Brain, Target } from 'lucide-react';
import { Button } from './ui/button';
import heroImage from '../assets/hero-image.jpg';

interface HeroSectionProps {
  onStartQuiz: () => void;
  onStartSimulado: () => void;
}

export const HeroSection = ({ onStartQuiz, onStartSimulado }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-hero opacity-95" />
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full animate-float" />
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-primary-glow/30 rounded-full animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-accent/40 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Prepare-se para o
            <span className="block bg-gradient-to-r from-white to-primary-glow bg-clip-text text-transparent">
              Vestibular
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Sistema completo de estudos com questões de ENEM, FUVEST, UNICAMP e UEM
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
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
              className="glass border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6"
            >
              <Target className="mr-2 h-5 w-5" />
              Simulado Completo
            </Button>
          </div>
          
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="glass p-6 rounded-lg text-white">
              <BookOpen className="h-8 w-8 text-primary-glow mx-auto mb-2" />
              <div className="text-2xl font-bold">1000+</div>
              <div className="text-white/80">Questões</div>
            </div>
            <div className="glass p-6 rounded-lg text-white">
              <Brain className="h-8 w-8 text-primary-glow mx-auto mb-2" />
              <div className="text-2xl font-bold">15+</div>
              <div className="text-white/80">Matérias</div>
            </div>
            <div className="glass p-6 rounded-lg text-white">
              <Target className="h-8 w-8 text-primary-glow mx-auto mb-2" />
              <div className="text-2xl font-bold">4</div>
              <div className="text-white/80">Vestibulares</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};