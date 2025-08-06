import {
  Award, BookUser, BrainCircuit, Crown, Eye, Flame, Footprints, Gem, HelpCircle, Library, ShieldCheck, Star, Target, Trophy, Zap, type LucideIcon
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import achievementIcons from '@/assets/achievement-icons.png';

// Map icon names from the database to actual Lucide components
const icons: Record<string, LucideIcon> = {
  Footprints, Award, Flame, Crown, Target, ShieldCheck, Trophy, BookUser, BrainCircuit, Gem, HelpCircle, Library, Eye, Zap, Star
};

interface Achievement {
  code: string;
  name: string;
  description: string;
  icon_name: string;
}

interface AchievementTrailProps {
  allAchievements: Achievement[];
  unlockedAchievements: Set<string>;
}

// Define the logical order of the achievement trail
const achievementOrder: string[] = [
  'FIRST_SIMULADO',
  'QUESTIONS_100',
  'STREAK_3',
  'XP_1000',
  'QUESTIONS_250',
  'ACCURACY_90',
  'STREAK_7',
  'QUESTIONS_500',
  'XP_5000',
  'STREAK_14',
  'ACCURACY_95',
  'QUESTIONS_1000',
  'STREAK_30',
  'XP_10000',
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

  // Determine the slice of achievements to show: from the second to last unlocked up to the next one
  const startIndex = Math.max(0, lastUnlockedIndex - 1);
  const endIndex = Math.min(orderedAchievements.length, lastUnlockedIndex + 2);
  const visibleAchievements = orderedAchievements.slice(startIndex, endIndex);

  return (
    <TooltipProvider>
      <div className="relative p-6 bg-gradient-to-r from-primary/5 via-background to-secondary/5 rounded-xl border border-primary/10">
        {/* Background pattern */}
        <div 
          className="absolute inset-0 opacity-5 bg-cover bg-center rounded-xl"
          style={{ backgroundImage: `url(${achievementIcons})` }}
        />
        
        <div className="relative flex items-center justify-center w-full space-x-3">
          {visibleAchievements.map((ach, index) => {
            const isUnlocked = unlockedAchievements.has(ach.code);
            const Icon = icons[ach.icon_name] || Award;
            const isLastVisible = index === visibleAchievements.length - 1;
            const nextAchievement = visibleAchievements[index + 1];
            const isNextUnlocked = nextAchievement ? unlockedAchievements.has(nextAchievement.code) : false;

            return (
              <div key={ach.code} className="flex items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={cn(
                      "flex flex-col items-center gap-3 text-center transition-all duration-300 cursor-pointer group",
                      isUnlocked && "animate-pulse-slow"
                    )}>
                      <div className={cn(
                        'w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 transform group-hover:scale-110 relative',
                        isUnlocked 
                          ? 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 shadow-2xl shadow-amber-500/50 animate-scale-in' 
                          : 'bg-gradient-to-br from-muted to-muted-foreground/20 grayscale opacity-40'
                      )}>
                        {isUnlocked && (
                          <>
                            {/* Sparkle effects */}
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full animate-ping opacity-75" />
                            <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse" />
                          </>
                        )}
                        <Icon className={cn(
                          'w-10 h-10 transition-all duration-300',
                          isUnlocked ? 'text-white drop-shadow-lg' : 'text-muted-foreground'
                        )} />
                      </div>
                      
                      <div className="space-y-1">
                        <span className={cn(
                          'text-xs font-semibold w-24 block text-center leading-tight',
                          isUnlocked ? 'text-foreground' : 'text-muted-foreground'
                        )}>
                          {ach.name}
                        </span>
                        
                        {isUnlocked && (
                          <div className="flex items-center justify-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                              Desbloqueada!
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <div className="space-y-2">
                      <p className="font-bold text-primary">{ach.name}</p>
                      <p className="text-sm">{ach.description}</p>
                      {!isUnlocked && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground italic">
                          <Target className="w-3 h-3" />
                          Continue estudando para desbloquear!
                        </div>
                      )}
                      {isUnlocked && (
                        <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                          <Trophy className="w-3 h-3" />
                          Conquista desbloqueada! +50 XP
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>

                {!isLastVisible && (
                  <div className="flex flex-col items-center mx-4">
                    <div className={cn(
                      "h-2 w-20 rounded-full transition-all duration-700 relative overflow-hidden",
                      isNextUnlocked 
                        ? "bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 shadow-lg" 
                        : "bg-muted"
                    )}>
                      {isNextUnlocked && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-slide-in-right" />
                      )}
                    </div>
                    
                    {isNextUnlocked && (
                      <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-fade-in">
                        Conectado!
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};
