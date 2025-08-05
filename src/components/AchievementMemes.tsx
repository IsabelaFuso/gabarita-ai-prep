import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Meme {
  id: string;
  name: string;
  url: string;
  box_count: number;
}

interface AchievementMemesProps {
  achievementName: string;
  achievementDescription: string;
}

export const AchievementMemes = ({ achievementName, achievementDescription }: AchievementMemesProps) => {
  const [meme, setMeme] = useState<Meme | null>(null);
  const [loading, setLoading] = useState(false);

  const brazilianMemeTemplates = [
    "181913649", // Drake Pointing
    "87743020",  // Two Buttons
    "112126428", // Distracted Boyfriend
    "131087935", // Running Away Balloon
    "4087833",   // Waiting Skeleton
    "61579", // One Does Not Simply
    "124822590", // Left Exit 12 Off Ramp
    "102156234", // Mocking Spongebob
    "27813981", // Hide the Pain Harold
    "80707627" // Sad Pablo Escobar
  ];

  const generateMeme = async () => {
    setLoading(true);
    try {
      // Seleciona um template aleatório
      const randomTemplate = brazilianMemeTemplates[Math.floor(Math.random() * brazilianMemeTemplates.length)];
      
      // Textos motivacionais em português para conquistas
      const motivationalTexts = [
        `QUANDO VOCÊ DESBLOQUEIA:\\n${achievementName}`,
        `ACHIEVEMENT UNLOCKED:\\n${achievementName}`,
        `PARABÉNS!\\nVocê conquistou: ${achievementName}`,
        `MAIS UMA CONQUISTA:\\n${achievementName}`,
        `LEVEL UP!\\n${achievementName}`,
        `SUCESSSO!\\n${achievementName} desbloqueada`
      ];

      const topText = motivationalTexts[Math.floor(Math.random() * motivationalTexts.length)];
      const bottomText = achievementDescription.length > 50 ? 
        achievementDescription.substring(0, 47) + "..." : 
        achievementDescription;

      // Simula uma API de memes (normalmente seria uma chamada real)
      // Para demonstração, criamos um objeto mock
      const mockMeme: Meme = {
        id: randomTemplate,
        name: "Meme de Conquista",
        url: `https://i.imgflip.com/${randomTemplate}.jpg`,
        box_count: 2
      };

      setMeme(mockMeme);
    } catch (error) {
      console.error('Erro ao gerar meme:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateMeme();
  }, [achievementName]);

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="text-center">
            <Badge variant="secondary" className="mb-2">
              🇧🇷 Meme da Conquista
            </Badge>
            <h3 className="font-semibold text-sm">{achievementName}</h3>
          </div>

          {meme && (
            <div className="relative">
              <img 
                src={meme.url} 
                alt="Meme de conquista"
                className="w-full rounded-lg border"
                style={{ maxHeight: '300px', objectFit: 'cover' }}
              />
              
              {/* Overlay de texto do meme */}
              <div className="absolute top-2 left-2 right-2 text-center">
                <div className="bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">
                  QUANDO VOCÊ DESBLOQUEIA:
                </div>
              </div>
              
              <div className="absolute bottom-2 left-2 right-2 text-center">
                <div className="bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">
                  {achievementName.toUpperCase()}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={generateMeme}
              disabled={loading}
              className="flex-1"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Novo Meme
            </Button>
            
            {meme && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(meme.url, '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="text-xs text-muted-foreground text-center">
            <p>🎉 Compartilhe sua conquista!</p>
            <p className="mt-1 italic">"{achievementDescription}"</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};