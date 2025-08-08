import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Upload, CheckCircle, AlertCircle, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const avatarSeeds = [
  // Masculinos
  "John", "David", "Carlos", "Kenji", "Ahmed", "Ivan", "Michael", "Omar",
  // Femininos
  "Maria", "Fatima", "Chloe", "Priya", "Nkechi", "Sofia", "Mei", "Olivia"
];

const preMadeAvatars = avatarSeeds.map(seed => `https://api.dicebear.com/8.x/personas/svg?seed=${seed}`);

export const ProfileView = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<{ full_name: string | null, avatar_url: string | null }>({ full_name: null, avatar_url: null });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('full_name, avatar_url')
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;

        if (data) {
          setProfile(data);
          setSelectedAvatar(data.avatar_url);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Não foi possível carregar seu perfil.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleAvatarSelect = (url: string) => {
    setSelectedAvatar(url);
  };

  const handleSaveAvatar = async () => {
    if (!user || !selectedAvatar) return;
    setUploading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ avatar_url: selectedAvatar })
        .eq('user_id', user.id);

      if (error) throw error;
      
      setProfile(prev => ({ ...prev!, avatar_url: selectedAvatar }));
      toast.success("Avatar atualizado com sucesso!");
    } catch (error) {
      console.error("Error saving avatar:", error);
      toast.error("Não foi possível salvar o novo avatar.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !user) {
      return;
    }

    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    setUploading(true);
    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;
      setSelectedAvatar(publicUrl);
      
      // Also save it immediately
      await supabase
        .from('user_profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id);
      
      setProfile(prev => ({ ...prev!, avatar_url: publicUrl }));
      toast.success("Avatar enviado e salvo com sucesso!");

    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Falha no upload. Verifique o tamanho e tipo do arquivo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil</CardTitle>
        <CardDescription>Gerencie os detalhes da sua conta e seu avatar.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {loading ? (
          <div className="flex items-center space-x-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-24 h-24 ring-4 ring-primary/20 ring-offset-2 ring-offset-background">
              <AvatarImage src={selectedAvatar || undefined} alt="User Avatar" />
              <AvatarFallback className="text-3xl">
                {profile.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{profile.full_name || 'Usuário'}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><ImageIcon className="w-5 h-5" /> Escolha um Avatar</h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
            {preMadeAvatars.map(url => (
              <button key={url} onClick={() => handleAvatarSelect(url)} className="relative">
                <Avatar className={cn(
                  "w-16 h-16 transition-all duration-200",
                  selectedAvatar === url && "ring-4 ring-primary ring-offset-2 ring-offset-background"
                )}>
                  <AvatarImage src={url} />
                  <AvatarFallback>AV</AvatarFallback>
                </Avatar>
                {selectedAvatar === url && (
                  <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-2">
              <Upload className="w-4 h-4" />
              {uploading ? "Enviando..." : "Subir Imagem"}
              <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileUpload} disabled={uploading} accept="image/png, image/jpeg" />
            </label>
          </Button>
          <p className="text-xs text-muted-foreground">PNG ou JPG. Tamanho máximo: 1MB.</p>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <Button onClick={handleSaveAvatar} disabled={uploading || loading || selectedAvatar === profile.avatar_url}>
          {uploading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </CardFooter>
    </Card>
  );
};
