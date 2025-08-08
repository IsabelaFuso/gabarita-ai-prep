import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, Crown, Star, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Rank, UserProfile } from '@/data/types';

interface ProfileCustomizationProps {
  userProfile: UserProfile;
  onUpdate: () => void;
}

export const ProfileCustomization = ({ userProfile, onUpdate }: ProfileCustomizationProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(userProfile.display_name || userProfile.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatar_url || '');
  const [availableRanks, setAvailableRanks] = useState<Rank[]>([]);
  const [selectedRankId, setSelectedRankId] = useState(userProfile.chosen_rank_id || userProfile.current_rank_id);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAvailableRanks();
  }, [userProfile]);

  const fetchAvailableRanks = async () => {
    if (!user) return;

    try {
      // Buscar patente atual baseada no XP
      const { data: currentRank } = await supabase
        .from('ranks')
        .select('*')
        .eq('rank_type', 'general')
        .lte('xp_threshold', userProfile.xp)
        .order('xp_threshold', { ascending: false })
        .limit(1)
        .single();

      // Buscar todas as patentes gerais desbloqueadas (até o nível atual)
      const { data: generalRanks } = await supabase
        .from('ranks')
        .select('*')
        .eq('rank_type', 'general')
        .lte('xp_threshold', userProfile.xp)
        .order('xp_threshold', { ascending: true });

      // Buscar patentes especiais desbloqueadas
      const { data: specialRanks } = await supabase
        .from('ranks')
        .select('*')
        .eq('rank_type', 'special_humorous')
        .in('id', userProfile.special_ranks_unlocked);

      const allRanks = [...(generalRanks || []), ...(specialRanks || [])].map(rank => ({
        ...rank,
        rank_type: rank.rank_type as 'general' | 'special_humorous'
      }));
      setAvailableRanks(allRanks);

      // Se não há patente escolhida, usar a atual
      if (!userProfile.chosen_rank_id && currentRank) {
        setSelectedRankId(currentRank.id);
      }
    } catch (error) {
      console.error('Error fetching available ranks:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          display_name: displayName.trim() || null,
          avatar_url: avatarUrl.trim() || null,
          chosen_rank_id: selectedRankId,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado!",
        description: "Suas personalizações foram salvas com sucesso.",
      });

      onUpdate();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(data.publicUrl);
      
      toast({
        title: "Imagem carregada!",
        description: "Clique em 'Salvar' para aplicar as alterações.",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível carregar a imagem.",
        variant: "destructive",
      });
    }
  };

  const getRankIcon = (rank: Rank) => {
    if (rank.rank_type === 'special_humorous') {
      return <Star className="w-4 h-4" />;
    }
    return <Crown className="w-4 h-4" />;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Personalizar Perfil
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar e Nome */}
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="flex flex-col items-center space-y-3">
            <Avatar className="w-24 h-24">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="text-lg">
                {displayName.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('avatar-upload')?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload
              </Button>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <Label htmlFor="display-name">Nome de Exibição</Label>
              <Input
                id="display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Como você quer ser chamado?"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Este nome aparecerá no ranking e para outros usuários
              </p>
            </div>

            <div>
              <Label htmlFor="avatar-url">URL do Avatar (opcional)</Label>
              <Input
                id="avatar-url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://exemplo.com/avatar.jpg"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Seleção de Patente */}
        <div>
          <Label className="text-base font-medium">Patente Exibida no Ranking</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Escolha qual patente será exibida ao lado do seu nome no ranking
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
            {availableRanks.map((rank) => (
              <div
                key={rank.id}
                onClick={() => setSelectedRankId(rank.id)}
                className={cn(
                  "p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:scale-105",
                  selectedRankId === rank.id
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ 
                      backgroundColor: rank.background_color || '#6b7280',
                      color: rank.text_color || '#ffffff'
                    }}
                  >
                    {getRankIcon(rank)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{rank.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {rank.rank_type === 'special_humorous' ? (
                        <Badge variant="secondary" className="text-xs">
                          Especial
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          {rank.xp_threshold}+ XP
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botão Salvar */}
        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} disabled={loading} className="px-8">
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};