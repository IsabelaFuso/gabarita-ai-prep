import {
  Award, BookUser, BrainCircuit, Crown, Eye, Flame, Footprints, Gem, HelpCircle, Library, ShieldCheck, Star, Target, Trophy, Zap, type LucideIcon
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

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
      <div className="flex items-center justify-center w-full space-x-2 p-4">
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
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className={cn(
                      'w-16 h-16 rounded-full flex items-center justify-center transition-all transform hover:scale-110',
                      isUnlocked ? 'bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg' : 'bg-muted grayscale opacity-60'
                    )}>
                      <Icon className={cn('w-8 h-8', isUnlocked ? 'text-white' : 'text-muted-foreground')} />
                    </div>
                    <span className={cn(
                      'text-xs font-medium w-20 truncate',
                      isUnlocked ? 'text-foreground' : 'text-muted-foreground'
                    )}>
                      {ach.name}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-bold">{ach.name}</p>
                  <p>{ach.description}</p>
                  {!isUnlocked && <p className="text-xs text-muted-foreground italic">Continue estudando para desbloquear!</p>}
                </TooltipContent>
              </Tooltip>

              {!isLastVisible && (
                <div className={cn(
                  "h-1.5 w-16 mx-2 rounded-full",
                  isNextUnlocked ? "bg-gradient-to-r from-green-400 to-teal-500" : "bg-gray-300"
                )} />
              )}
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
};
