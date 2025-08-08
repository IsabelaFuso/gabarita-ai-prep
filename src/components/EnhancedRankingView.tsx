import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Crown, 
  Sparkles, 
  Trophy,
  Star,
  Settings,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ProfileCustomization } from "@/components/ProfileCustomization";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { RankingUser, UserProfile } from "@/data/types";

export function EnhancedRankingView() {
  const { user } = useAuth();
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCustomization, setShowCustomization] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Buscar ranking
      const { data: rankingData, error: rankingError } = await supabase.rpc('get_ranking');
      if (rankingError) throw rankingError;
      setRanking(rankingData || []);

      // Buscar perfil do usuário
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (profileError) throw profileError;
      setUserProfile(profileData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (user: RankingUser) => {
    // Se tem patente escolhida, mostrar ícone especial
    if (user.chosen_rank_name) {
      return user.chosen_rank_name.includes('Ai Pai') || 
             user.chosen_rank_name.includes('Toma Jack') ||
             user.chosen_rank_name.includes('Brabo') ||
             user.chosen_rank_name.includes('Rei') ||
             user.chosen_rank_name.includes('Cara') ? <Star className="w-4 h-4" /> : <Crown className="w-4 h-4" />;
    }
    
    // Ícones por patente padrão
    if (user.rank_name === "Conquistador do Sonho") return <Crown className="w-4 h-4 text-purple-500" />;
    if (user.rank_name === "Lenda do Gabarito") return <Trophy className="w-4 h-4 text-red-500" />;
    if (user.rank_name === "Oráculo do Vestibular") return <Sparkles className="w-4 h-4 text-purple-500" />;
    return <Crown className="w-4 h-4 text-gray-500" />;
  };

  const getRankColor = (user: RankingUser) => {
    const rankName = user.chosen_rank_name || user.rank_name;
    
    if (rankName === "Conquistador do Sonho") return "text-purple-500";
    if (rankName === "Lenda do Gabarito") return "text-red-500";
    if (rankName === "Oráculo do Vestibular") return "text-purple-500";
    if (rankName === "Arquiteto da Aprovação") return "text-blue-500";
    if (rankName === "Guardião do Gabarito") return "text-red-400";
    if (rankName === "Mestre do Conteúdo") return "text-cyan-500";
    if (rankName === "Estrategista de Provas") return "text-purple-400";
    if (rankName === "Desbravador de Questões") return "text-amber-500";
    if (rankName === "Explorador do Saber") return "text-blue-400";
    if (rankName === "Aprendiz Dedicado") return "text-green-500";
    
    // Patentes especiais
    if (rankName?.includes('Ai Pai')) return "text-orange-500";
    if (rankName?.includes('Toma Jack')) return "text-green-500";
    if (rankName?.includes('Brabo')) return "text-yellow-500";
    if (rankName?.includes('Rei') || rankName?.includes('Rainha')) return "text-pink-500";
    if (rankName?.includes('Cara da Matemática')) return "text-blue-500";
    
    return "text-gray-500";
  };

  const isCurrentUser = (rankingUser: RankingUser) => {
    return rankingUser.user_id === user?.id;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          🏆 Ranking de Alunos
        </CardTitle>
        
        {userProfile && (
          <Dialog open={showCustomization} onOpenChange={setShowCustomization}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Personalizar Perfil</DialogTitle>
              </DialogHeader>
              <ProfileCustomization 
                userProfile={userProfile} 
                onUpdate={() => {
                  fetchData();
                  setShowCustomization(false);
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto pr-2">
        <ul className="space-y-4">
          {ranking.map((user, index) => {
            const isMe = isCurrentUser(user);
            const Icon = getRankIcon(user);
            const color = getRankColor(user);
            
            return (
              <li key={user.user_id || index} className={cn(
                "flex items-start space-x-4 p-3 rounded-lg transition-all duration-200",
                isMe && "bg-primary/10 border border-primary/20 shadow-sm"
              )}>
                <div className="flex items-center space-x-3 w-16">
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm",
                    index === 0 && "bg-gradient-to-br from-yellow-400 to-orange-500 text-white",
                    index === 1 && "bg-gradient-to-br from-gray-300 to-gray-500 text-white", 
                    index === 2 && "bg-gradient-to-br from-amber-600 to-yellow-700 text-white",
                    index > 2 && "bg-muted text-muted-foreground"
                  )}>
                    {index + 1}
                  </div>
                </div>
                
                <Avatar className={cn("transition-all duration-200", isMe && "ring-2 ring-primary/50")}>
                  <AvatarImage src={user.avatar_url} alt={user.full_name} />
                  <AvatarFallback>{user.full_name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <p className={cn(
                    "font-semibold",
                    isMe && "text-primary"
                  )}>
                    {user.full_name || 'Usuário'}
                    {isMe && <span className="text-xs ml-2 text-primary">(Você)</span>}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {user.target_course || 'Curso'} @ {user.target_institution || 'Instituição'}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <span className={color}>{Icon}</span>
                      {user.chosen_rank_name || user.rank_name}
                    </Badge>
                    <span className={cn(
                      "text-sm font-bold",
                      isMe ? "text-primary" : "text-muted-foreground"
                    )}>
                      {user.xp.toLocaleString('pt-BR')} XP
                    </span>
                  </div>
                  
                  {/* Mostrar última conquista se houver */}
                  {user.latest_achievement_name && (
                    <div className="mt-1">
                      <Badge variant="outline" className="text-xs">
                        🏅 {user.latest_achievement_name}
                      </Badge>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}