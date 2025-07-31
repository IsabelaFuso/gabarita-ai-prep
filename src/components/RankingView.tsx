
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import rankingData from "@/data/ranking-mock-data.json";

// Sort users by XP in descending order
const sortedRanking = [...rankingData].sort((a, b) => b.xp - a.xp);

export function RankingView() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>🏆 Ranking de Alunos</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {sortedRanking.map((user, index) => (
            <li key={user.id_usuario} className="flex items-center space-x-4">
              <span className="text-lg font-bold w-6 text-center">{index + 1}</span>
              <Avatar>
                <AvatarImage src={user.avatar_url} alt={user.nome_usuario} />
                <AvatarFallback>{user.nome_usuario.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">{user.nome_usuario}</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="destructive">{user.patente}</Badge>
                  <span className="text-sm text-muted-foreground">{user.xp} XP</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
