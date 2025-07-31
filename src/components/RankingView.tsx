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
  LucideProps
} from "lucide-react";
import rankingData from "@/data/ranking-mock-data.json";
import { cn } from "@/lib/utils";

const sortedRanking = [...rankingData].sort((a, b) => b.xp - a.xp);

const patentIcons: { [key: string]: React.ComponentType<LucideProps> } = {
  "Titã do Gabarito": Crown,
  "Oráculo do Vestibular": Sparkles,
  "Arquiteto do Saber": DraftingCompass,
  "Desbravador de Manuscritos": Map,
  "Acadêmico Iniciante": GraduationCap,
  "Neófito Curioso": Lightbulb,
};

const getPatentInfo = (patente: string): { Icon: React.ComponentType<LucideProps>; color: string } => {
  const Icon = patentIcons[patente] || Lightbulb;
  let color = "text-gray-500";

  if (patente === "Titã do Gabarito") color = "text-yellow-500";
  if (patente === "Oráculo do Vestibular") color = "text-purple-500";
  if (patente === "Arquiteto do Saber") color = "text-blue-500";
  if (patente === "Desbravador de Manuscritos") color = "text-orange-600";
  if (patente === "Acadêmico Iniciante") color = "text-green-500";

  return { Icon, color };
};

export function RankingView() {
  return (
    <Card className="w-full max-w-md flex flex-col h-full">
      <CardHeader>
        <CardTitle>🏆 Ranking de Alunos</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto pr-2">
        <ul className="space-y-4">
          {sortedRanking.map((user, index) => {
            const { Icon, color } = getPatentInfo(user.patente);
            return (
              <li key={user.id_usuario} className="flex items-start space-x-4">
                <div className="flex items-center space-x-3 w-12">
                  <span className="text-lg font-bold text-muted-foreground">{index + 1}</span>
                </div>
                <Avatar>
                  <AvatarImage src={user.avatar_url} alt={user.nome_usuario} />
                  <AvatarFallback>{user.nome_usuario.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{user.nome_usuario}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.curso_alvo} @ {user.instituicao_alvo}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Icon className={cn("w-3.5 h-3.5", color)} />
                      {user.patente}
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
