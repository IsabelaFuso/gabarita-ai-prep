import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  Sparkles, 
  DraftingCompass, 
  Map, 
  GraduationCap, 
  Lightbulb,
  LucideProps,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import mockData from "@/data/ranking-mock-data.json";

interface RankingUser {
  user_id?: string;
  full_name: string;
  avatar_url: string;
  xp: number;
  rank_name: string;
  target_institution: string;
  target_course: string;
  latest_achievement_name?: string;
  latest_achievement_icon?: string;
  chosen_rank_name?: string;
  chosen_rank_icon?: string;
}

const mockedUsers: RankingUser[] = mockData.map(user => ({
  full_name: user.nome_usuario,
  avatar_url: user.avatar_url,
  xp: user.xp,
  rank_name: user.patente,
  target_institution: user.instituicao_alvo,
  target_course: user.curso_alvo,
}));

const patentIcons: { [key: string]: React.ComponentType<LucideProps> } = {
  "Titã do Gabarito": Crown,
  "Oráculo do Vestibular": Sparkles,
  "Arquiteto do Saber": DraftingCompass,
  "Desbravador de Manuscritos": Map,
  "Acadêmico Iniciante": GraduationCap,
  "Neófito Curioso": Lightbulb,
};

const getPatentInfo = (rank_name: string): { Icon: React.ComponentType<LucideProps>; color: string } => {
  const Icon = patentIcons[rank_name] || Lightbulb;
  let color = "text-gray-500";

  if (rank_name === "Titã do Gabarito") color = "text-yellow-500";
  if (rank_name === "Oráculo do Vestibular") color = "text-purple-500";
  if (rank_name === "Arquiteto do Saber") color = "text-blue-500";
  if (rank_name === "Desbravador de Manuscritos") color = "text-orange-600";
  if (rank_name === "Acadêmico Iniciante") color = "text-green-500";

  return { Icon, color };
};

export function RankingView() {
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_ranking');
      
      if (error || !data || data.length === 0) {
        console.error("Error fetching ranking or no real users found, falling back to mock data:", error);
        setRanking(mockedUsers.sort((a, b) => b.xp - a.xp));
      } else {
        setRanking(data);
      }
      setLoading(false);
    };

    fetchRanking();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md flex flex-col h-full">
      <CardHeader>
        <CardTitle>🏆 Ranking de Alunos</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto pr-2">
        <ul className="space-y-4">
          {ranking.map((user, index) => {
            const { Icon, color } = getPatentInfo(user.rank_name);
            return (
              <li key={user.user_id || index} className="flex items-start space-x-4">
                <div className="flex items-center space-x-3 w-12">
                  <span className="text-lg font-bold text-muted-foreground">{index + 1}</span>
                </div>
                <Avatar>
                  <AvatarImage src={user.avatar_url} alt={user.full_name} />
                  <AvatarFallback>{user.full_name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{user.full_name || 'Usuário'}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.target_course || 'Curso'} @ {user.target_institution || 'Instituição'}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Icon className={cn("w-3.5 h-3.5", color)} />
                      {user.chosen_rank_name || user.rank_name}
                    </Badge>
                    <span className="text-sm font-bold text-primary">{user.xp} XP</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
