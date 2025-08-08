import {
  Award, BookUser, BrainCircuit, Crown, Eye, Flame, Footprints, Gem, HelpCircle, Library, ShieldCheck, Star, Target, Trophy, Zap, type LucideIcon
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

const icons: Record<string, LucideIcon> = {
  Footprints, Award, Flame, Crown, Target, ShieldCheck, Trophy, BookUser, BrainCircuit, Gem, HelpCircle, Library, Eye, Zap, Star
};

interface Achievement {
  code: string;
  name:string;
  description: string;
  icon_name: string;
}

interface AchievementTrailProps {
  allAchievements: Achievement[];
  unlockedAchievements: Set<string>;
}

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

export const AchievementTrail = ({ allAchievements, unlockedAchievements }: AchievementTrailProps) => {
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
      <div className="relative p-6 bg-gradient-to-br from-academic-blue via-academic-purple to-academic-green rounded-xl border border-primary/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
        <div className="relative w-full h-80">
          <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none" className="absolute inset-0">
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.6)" />
                <stop offset="50%" stopColor="rgba(147, 51, 234, 0.6)" />
                <stop offset="100%" stopColor="rgba(34, 197, 94, 0.6)" />
              </linearGradient>
            </defs>
            <path 
              d="M 30 170 Q 80 150, 120 140 T 200 80 Q 250 60, 300 90 T 370 60"
              stroke="url(#pathGradient)" 
              strokeWidth="4" 
              fill="none" 
              strokeDasharray="8,4"
              className="animate-pulse-slow"
            />
            <path 
              d="M 30 170 Q 80 150, 120 140 T 200 80 Q 250 60, 300 90 T 370 60"
              stroke="rgba(255, 255, 255, 0.3)" 
              strokeWidth="2" 
              fill="none" 
              strokeDasharray="4,8"
              className="animate-flow"
            />
          </svg>

          <div className="relative w-full h-full">
            {visibleAchievements.map((ach, index) => {
              const isUnlocked = unlockedAchievements.has(ach.code);
              const Icon = icons[ach.icon_name] || Award;
              const pos = achievementPositions[index % achievementPositions.length];

              return (
                <Tooltip key={ach.code}>
                  <TooltipTrigger asChild>
                    <div 
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: pos.cx, top: pos.cy }}
                    >
                      <div className={cn(
                        "flex flex-col items-center gap-2 text-center transition-all duration-300 cursor-pointer group",
                        isUnlocked && "animate-pulse-slow"
                      )}>
                        <div className={cn(
                          'w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 transform group-hover:scale-125 relative shadow-xl',
                          isUnlocked 
                            ? 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 shadow-amber-500/50 border-2 border-white/30' 
                            : 'bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-800 grayscale opacity-60'
                        )}>
                          {isUnlocked && (
                            <>
                              <div className="absolute inset-0 rounded-full bg-yellow-400/40 animate-ping opacity-75" />
                              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-rotate-slow" />
                            </>
                          )}
                          <Icon className={cn(
                            'w-10 h-10 transition-all duration-300 relative z-10',
                            isUnlocked ? 'text-white drop-shadow-md' : 'text-slate-500 dark:text-slate-400'
                          )} />
                        </div>
                        
                        <span className={cn(
                          'text-xs font-semibold w-24 block text-center leading-tight px-2 py-1 rounded-full border backdrop-blur-sm',
                          isUnlocked 
                            ? 'text-foreground bg-background/70 border-primary/30 shadow-sm' 
                            : 'text-muted-foreground bg-background/40 border-muted/30'
                        )}>
                          {ach.name}
                        </span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs bg-background/80 backdrop-blur-sm">
                    <div className="space-y-2">
                      <p className="font-bold text-primary">{ach.name}</p>
                      <p className="text-sm">{ach.description}</p>
                      {!isUnlocked && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground italic">
                          <Target className="w-3 h-3" />
                          <span>Continue estudando para desbloquear!</span>
                        </div>
                      )}
                      {isUnlocked && (
                        <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                          <Trophy className="w-3 h-3" />
                          <span>Conquista desbloqueada! +50 XP</span>
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

