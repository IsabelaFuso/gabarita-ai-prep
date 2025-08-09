import { useState, useEffect } from "react";
import { GraduationCap, Edit, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { SelectedConfig } from "@/hooks/useAppState";

const universities = [
  { id: "USP", name: "USP - Universidade de São Paulo", state: "SP" },
  { id: "UNICAMP", name: "UNICAMP - Universidade Estadual de Campinas", state: "SP" },
  { id: "UEM", name: "UEM - Universidade Estadual de Maringá", state: "PR" },
  { id: "UFRJ", name: "UFRJ - Universidade Federal do Rio de Janeiro", state: "RJ" },
  { id: "UFMG", name: "UFMG - Universidade Federal de Minas Gerais", state: "MG" },
  { id: "FUVEST", name: "FUVEST - Fundação Universitária para o Vestibular", state: "SP" },
  { id: "ENEM", name: "ENEM - Exame Nacional do Ensino Médio", state: "BR" },
];

const courses = [
  { id: "Medicina", name: "Medicina", area: "Saúde" },
  { id: "Engenharia de Computação", name: "Engenharia de Computação", area: "Exatas" },
  { id: "Direito", name: "Direito", area: "Humanas" },
  { id: "Arquitetura e Urbanismo", name: "Arquitetura e Urbanismo", area: "Exatas" },
  { id: "Psicologia", name: "Psicologia", area: "Humanas" },
  { id: "Administração", name: "Administração", area: "Humanas" },
];

interface UniversitySelectorProps {
  selectedConfig: SelectedConfig;
  onSelectionChange: (data: SelectedConfig) => void;
}

export const UniversitySelector = ({ selectedConfig, onSelectionChange }: UniversitySelectorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localConfig, setLocalConfig] = useState<SelectedConfig>(selectedConfig);

  useEffect(() => {
    setLocalConfig(selectedConfig);
  }, [selectedConfig]);

  const handleSave = () => {
    onSelectionChange(localConfig);
    setIsEditing(false);
  };

  const getUniversityName = (id: string) => {
    return universities.find(u => u.id.toUpperCase() === id.toUpperCase())?.name || id;
  };

  return (
    <>
      <Card className="shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Sua Configuração
            </CardTitle>
            <CardDescription>
              Sua instituição e cursos alvo.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Alterar
          </Button>
        </CardHeader>
        <CardContent>
          {selectedConfig.university ? (
            <div className="space-y-2 text-sm">
              <p><strong>Instituição:</strong> {getUniversityName(selectedConfig.university)}</p>
              <p><strong>1ª Opção:</strong> {selectedConfig.firstChoice || 'Não definida'}</p>
              <p><strong>2ª Opção:</strong> {selectedConfig.secondChoice || 'Não definida'}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Selecione sua instituição e cursos para começar.
            </p>
          )}
        </CardContent>
      </Card>

      <Drawer open={isEditing} onOpenChange={setIsEditing}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-md">
            <DrawerHeader>
              <DrawerTitle>Configuração do Vestibular</DrawerTitle>
              <DrawerDescription>Escolha a instituição e seus cursos de interesse.</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-6">
              {/* University Selection */}
              <div className="space-y-2">
                <Label htmlFor="university">Instituição</Label>
                <Select 
                  value={localConfig.university} 
                  onValueChange={(value) => setLocalConfig(prev => ({ ...prev, university: value }))}
                >
                  <SelectTrigger id="university">
                    <SelectValue placeholder="Selecione a universidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {universities.map((uni) => (
                      <SelectItem key={uni.id} value={uni.id}>
                        {uni.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Course Selection */}
              <div className="space-y-2">
                <Label htmlFor="first-choice">1ª Opção de Curso</Label>
                <Select 
                  value={localConfig.firstChoice} 
                  onValueChange={(value) => setLocalConfig(prev => ({ ...prev, firstChoice: value }))}
                >
                  <SelectTrigger id="first-choice">
                    <SelectValue placeholder="Primeira escolha" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="second-choice">2ª Opção de Curso</Label>
                <Select 
                  value={localConfig.secondChoice} 
                  onValueChange={(value) => setLocalConfig(prev => ({ ...prev, secondChoice: value }))}
                >
                  <SelectTrigger id="second-choice">
                    <SelectValue placeholder="Segunda escolha" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.filter(c => c.id !== localConfig.firstChoice).map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DrawerFooter>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
