import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileView } from './ProfileView';
import { HistoryView } from './HistoryView';
import { SettingsView } from './SettingsView';
import { User, History, Settings } from 'lucide-react';

export type AccountTab = 'profile' | 'history' | 'settings';

interface AccountViewProps {
  onViewSimuladoDetails: (simuladoId: string) => void;
}

export const AccountView = ({ onViewSimuladoDetails }: AccountViewProps) => {
  const [activeTab, setActiveTab] = useState<AccountTab>('profile');

  return (
    <div className="p-4 md:p-6">
      <Tabs defaultValue="profile" onValueChange={(value) => setActiveTab(value as AccountTab)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-2" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="w-4 h-4 mr-2" />
            Histórico
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6">
          <ProfileView />
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          <HistoryView onViewDetails={onViewSimuladoDetails} />
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <SettingsView />
        </TabsContent>
      </Tabs>
    </div>
  );
};
