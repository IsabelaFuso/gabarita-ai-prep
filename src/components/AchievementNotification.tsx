import { useState, useEffect } from 'react';
import { X, Trophy, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import celebrationPattern from '@/assets/celebration-pattern.png';

interface Achievement {
  code: string;
  name: string;
  description: string;
  icon_name: string;
}

interface AchievementNotificationProps {
  achievements: Achievement[];
  onClose: () => void;
  show: boolean;
}

export const AchievementNotification = ({ achievements, onClose, show }: AchievementNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (show && achievements.length > 0) {
      setIsVisible(true);
      setCurrentIndex(0);
    }
  }, [show, achievements]);

  useEffect(() => {
    if (isVisible && achievements.length > 1 && currentIndex < achievements.length - 1) {
      const timer = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, currentIndex, achievements.length]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!isVisible || achievements.length === 0) return null;

  const currentAchievement = achievements[currentIndex];

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slide-in-right">
      <Card className={cn(
        "relative overflow-hidden border-2 border-primary shadow-2xl transform transition-all duration-300 hover:scale-105",
        "bg-gradient-to-br from-background via-background/95 to-primary/5"
      )}>
        {/* Background pattern */}
        <div 
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${celebrationPattern})` }}
        />
        
        {/* Sparkle animation overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 left-2 text-yellow-400 animate-pulse">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="absolute top-4 right-4 text-blue-400 animate-pulse delay-300">
            <Sparkles className="w-3 h-3" />
          </div>
          <div className="absolute bottom-4 left-4 text-green-400 animate-pulse delay-500">
            <Sparkles className="w-3 h-3" />
          </div>
        </div>

        <CardContent className="relative p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center animate-bounce">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white animate-pulse">
                🎉 Conquista Desbloqueada!
              </Badge>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClose}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Achievement info */}
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-foreground leading-tight">
              {currentAchievement.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {currentAchievement.description}
            </p>
          </div>

          {/* Progress indicator for multiple achievements */}
          {achievements.length > 1 && (
            <div className="flex gap-1 justify-center">
              {achievements.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    index === currentIndex 
                      ? "bg-primary scale-125" 
                      : index < currentIndex 
                        ? "bg-primary/60" 
                        : "bg-muted"
                  )}
                />
              ))}
            </div>
          )}

          {/* XP reward indicator */}
          <div className="text-center">
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                +50 XP
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};