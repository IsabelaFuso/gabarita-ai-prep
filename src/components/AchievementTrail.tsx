import {
  Award, BookUser, BrainCircuit, Crown, Eye, Flame, Footprints, Gem, HelpCircle, Library, ShieldCheck, Star, Target, Trophy, Zap, type LucideIcon
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
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
        className="relative p-8 bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-xl border-2 border-sky-200 dark:border-sky-700 overflow-hidden shadow-lg"
      >
        <div className="relative w-full h-64">
          <svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="none" className="absolute inset-0">
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="1"/>
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="1"/>
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="1"/>
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <path 
              d="M 40 120 Q 120 100, 200 50 T 360 80"
              strokeWidth="8" 
              fill="none" 
              stroke="url(#pathGradient)"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
            />
            <path 
              d="M 40 120 Q 120 100, 200 50 T 360 80"
              strokeWidth="12" 
              fill="none" 
              stroke="white"
              strokeOpacity="0.3"
              strokeLinecap="round"
              strokeDasharray="8,8"
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
                          'w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3 relative',
                          isUnlocked 
                            ? 'bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 shadow-2xl shadow-orange-500/40 border-4 border-yellow-300 dark:border-yellow-400' 
                            : 'bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-800 border-4 border-slate-400 dark:border-slate-600 opacity-60'
                        )}>
                          {isUnlocked && (
                            <>
                              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 via-yellow-200/30 to-transparent animate-pulse" />
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center shadow-lg">
                                <Star className="w-4 h-4 text-amber-600 fill-amber-600" />
                              </div>
                            </>
                          )}
                          <Icon className={cn(
                            'w-10 h-10 transition-all duration-300 relative z-10',
                            isUnlocked ? 'text-white drop-shadow-lg' : 'text-slate-500 dark:text-slate-400'
                          )} />
                        </div>
                        
                        <span className={cn(
                          'text-xs w-24 block text-center leading-tight px-3 py-1.5 rounded-lg transition-all duration-300 font-bold shadow-md',
                          isUnlocked 
                            ? 'text-slate-800 dark:text-white bg-gradient-to-br from-yellow-200 via-amber-200 to-orange-200 dark:from-amber-500 dark:via-orange-500 dark:to-rose-500 border-2 border-yellow-400 dark:border-yellow-300' 
                            : 'text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600'
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

