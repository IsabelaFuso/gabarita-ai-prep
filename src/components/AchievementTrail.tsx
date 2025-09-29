import {
  Award, BookUser, BrainCircuit, Crown, Eye, Flame, Footprints, Gem, HelpCircle, Library, ShieldCheck, Star, Target, Trophy, Zap, type LucideIcon
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import colorfulCelebrationPattern from '@/assets/colorful-celebration-pattern.png';
import { useAchievements } from '@/hooks/useAchievements';

const icons: Record<string, LucideIcon> = {
  Footprints, Award, Flame, Crown, Target, ShieldCheck, Trophy, BookUser, BrainCircuit, Gem, HelpCircle, Library, Eye, Zap, Star,
  // Add a default icon
  default: Award,
};

interface Achievement {
  code: string;
  name:string;
  description: string;
  icon_name: string;
}

interface AchievementTrailProps {}

const achievementOrder: string[] = [
  // Fase 1: Início da Jornada
  'PRIMEIROS_PASSOS', 'EXPLORADOR_PLATAFORMA', 'PRIMEIRA_VITORIA', 'REDATOR_INICIANTE',
  // Fase 2: Construindo a Base  
  'RITMO_CONSTANTE', 'DESAFIO_SUPERADO', 'MESTRE_FUNDAMENTOS', 'ORGANIZADOR_NATO',
  // Fase 3: Aprofundamento e Estratégia
  'ESPECIALISTA_MATERIA', 'GABARITO_PARCIAL', 'SUPERACAO_DIFICULDADES', 'ESCRITOR_PERSPICAZ',
  // Fase 4: Reta Final e Simulação
  'MARATONISTA_ESTUDO', 'SIMULADOR_PRO', 'REVISOR_MESTRE', 'PRONTO_BATALHA',
  // Fase 5: Conquista Final
  'APROVADO'
];

const achievementPositions = [
  { cx: "8%", cy: "85%" }, { cx: "20%", cy: "70%" }, { cx: "35%", cy: "55%" }, { cx: "50%", cy: "40%" },
  { cx: "65%", cy: "25%" }, { cx: "78%", cy: "15%" }, { cx: "90%", cy: "30%" }, { cx: "85%", cy: "50%" },
  { cx: "70%", cy: "65%" }, { cx: "55%", cy: "80%" }, { cx: "40%", cy: "90%" }, { cx: "25%", cy: "85%" },
  { cx: "15%", cy: "60%" }, { cx: "30%", cy: "35%" }, { cx: "60%", cy: "10%" }, { cx: "75%", cy: "40%" },
  { cx: "50%", cy: "95%" }
];

export const AchievementTrail = ({}: AchievementTrailProps) => {
  const { allAchievements, unlockedAchievements, loading } = useAchievements();

  if (loading) {
    return <div className="text-center text-muted-foreground">Carregando conquistas...</div>;
  }

  if (allAchievements.length === 0) {
    return <div className="text-center text-muted-foreground">Nenhuma conquista disponível.</div>;
  }

  const achievementsMap = new Map(allAchievements.map(ach => [ach.code, ach]));
  const orderedAchievements = achievementOrder
    .map(code => achievementsMap.get(code))
    .filter((ach): ach is Achievement => !!ach);

  const lastUnlockedIndex = orderedAchievements.reduce((lastIndex, ach, currentIndex) => {
    return unlockedAchievements.has(ach.code) ? currentIndex : lastIndex;
  }, -1);

  const startIndex = Math.max(0, lastUnlockedIndex - 2);
  const endIndex = Math.min(orderedAchievements.length, lastUnlockedIndex + 4);
  const visibleAchievements = orderedAchievements.slice(startIndex, endIndex);

  return (
    <TooltipProvider>
      <div 
        className="relative p-4 bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-700 overflow-hidden shadow-lg"
        style={{ backgroundImage: `url(${colorfulCelebrationPattern})`, backgroundSize: '200px 200px', backgroundRepeat: 'repeat' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-white/40 dark:from-slate-900/60 dark:via-transparent dark:to-slate-900/40 backdrop-blur-[1px]" />
        <div className="relative w-full h-64">
          <svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="none" className="absolute inset-0">
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8"/>
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8"/>
              </linearGradient>
            </defs>
            <path 
              d="M 40 120 C 100 100, 150 50, 200 50 C 250 50, 300 100, 360 80"
              strokeWidth="5" 
              fill="none" 
              stroke="url(#pathGradient)"
              strokeDasharray="10,5"
              className="animate-pulse"
            />
          </svg>

          <div className="relative w-full h-full">
            {visibleAchievements.map((ach, index) => {
              const isUnlocked = unlockedAchievements.has(ach.code);
              const Icon = icons[ach.icon_name] || icons.default;
              const pos = achievementPositions[index % achievementPositions.length];

              return (
                <Tooltip key={ach.code}>
                  <TooltipTrigger asChild>
                    <div 
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: pos.cx, top: pos.cy }}
                    >
                      <div className="flex flex-col items-center gap-2 text-center transition-all duration-300 cursor-pointer group">
                        <div className={cn(
                          'w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 transform group-hover:scale-110 relative shadow-lg',
                          isUnlocked 
                            ? 'bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 ring-4 ring-white dark:ring-slate-900 shadow-xl shadow-orange-400/30' 
                            : 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-600 dark:to-slate-700 border-2 border-dashed border-purple-400/50 dark:border-purple-500/50'
                        )}>
                          {isUnlocked && (
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-yellow-200/20 animate-pulse" />
                          )}
                          <Icon className={cn(
                            'w-8 h-8 transition-all duration-300',
                            isUnlocked ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                          )} />
                        </div>
                        
                        <span className={cn(
                          'text-xs w-24 block text-center leading-tight px-2 py-1 rounded-full transition-all duration-300 shadow-sm',
                          isUnlocked 
                            ? 'font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-purple-400/20' 
                            : 'font-medium text-slate-600 dark:text-slate-400 bg-white/60 dark:bg-slate-700/60'
                        )}>
                          {ach.name}
                        </span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs bg-background/80 backdrop-blur-sm border-primary/20">
                    <div className="space-y-1 p-1">
                      <p className="font-bold text-primary flex items-center gap-2">
                        <Icon className={cn("w-4 h-4", isUnlocked ? "text-amber-500" : "text-muted-foreground")} />
                        {ach.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{ach.description}</p>
                      <hr className="border-border/50 my-2" />
                      {!isUnlocked ? (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground italic">
                          <Target className="w-3 h-3" />
                          <span>Continue estudando para desbloquear!</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          <Trophy className="w-3 h-3" />
                          <span>Conquista desbloqueada! (+50 XP)</span>
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

