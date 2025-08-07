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
  'FIRST_SIMULADO', 'QUESTIONS_100', 'STREAK_3', 'XP_1000', 'QUESTIONS_250', 'ACCURACY_90', 'STREAK_7',
  'QUESTIONS_500', 'XP_5000', 'STREAK_14', 'ACCURACY_95', 'QUESTIONS_1000', 'STREAK_30', 'XP_10000',
];

const achievementPositions = [
  { cx: "10%", cy: "80%" }, { cx: "25%", cy: "65%" }, { cx: "40%", cy: "50%" },
  { cx: "55%", cy: "35%" }, { cx: "70%", cy: "20%" }, { cx: "85%", cy: "10%" }
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
      <div className="relative p-4 bg-gradient-to-b from-sky-100 to-blue-200 dark:from-sky-900 dark:to-blue-950 rounded-xl border border-primary/10 overflow-hidden">
        <div className="relative w-full h-64">
          <svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="none" className="absolute inset-0">
            <path 
              d="M 40 120 C 100 100, 150 50, 200 50 C 250 50, 300 100, 360 80"
              stroke="rgba(255, 255, 255, 0.5)" 
              strokeWidth="3" 
              fill="none" 
              strokeDasharray="5,5"
              className="stroke-muted-foreground/30"
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
                          'w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 transform group-hover:scale-125 relative shadow-lg',
                          isUnlocked 
                            ? 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 shadow-amber-500/30' 
                            : 'bg-slate-300 dark:bg-slate-700 grayscale opacity-60'
                        )}>
                          {isUnlocked && (
                            <div className="absolute inset-0 rounded-full bg-yellow-400/30 animate-ping opacity-75" />
                          )}
                          <Icon className={cn(
                            'w-8 h-8 transition-all duration-300',
                            isUnlocked ? 'text-white drop-shadow-md' : 'text-slate-500 dark:text-slate-400'
                          )} />
                        </div>
                        
                        <span className={cn(
                          'text-xs font-semibold w-20 block text-center leading-tight px-1 py-0.5 rounded-full',
                          isUnlocked ? 'text-foreground bg-background/50' : 'text-muted-foreground bg-background/30'
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

