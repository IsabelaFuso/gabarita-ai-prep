import { useState } from "react";
import { GraduationCap, ChevronDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const universities = [
  { id: "usp", name: "USP - Universidade de São Paulo", state: "SP" },
  { id: "unicamp", name: "UNICAMP - Universidade Estadual de Campinas", state: "SP" },
  { id: "uem", name: "UEM - Universidade Estadual de Maringá", state: "PR" },
  { id: "ufrj", name: "UFRJ - Universidade Federal do Rio de Janeiro", state: "RJ" },
  { id: "ufmg", name: "UFMG - Universidade Federal de Minas Gerais", state: "MG" },
  { id: "fuvest", name: "FUVEST - Fundação Universitária para o Vestibular", state: "SP" },
  { id: "enem", name: "ENEM - Exame Nacional do Ensino Médio", state: "BR" },
];

const courses = [
  { id: "medicina", name: "Medicina", area: "Saúde" },
  { id: "engenharia-civil", name: "Engenharia Civil", area: "Exatas" },
  { id: "direito", name: "Direito", area: "Humanas" },
  { id: "administracao", name: "Administração", area: "Humanas" },
  { id: "psicologia", name: "Psicologia", area: "Humanas" },
  { id: "engenharia-computacao", name: "Engenharia de Computação", area: "Exatas" },
  { id: "biologia", name: "Biologia", area: "Biológicas" },
  { id: "fisica", name: "Física", area: "Exatas" },
  { id: "química", name: "Química", area: "Exatas" },
  { id: "enfermagem", name: "Enfermagem", area: "Saúde" },
];

// Notas de corte por universidade e curso (dados de exemplo)
const cutoffScores = {
  usp: {
    medicina: 850,
    "engenharia-civil": 720,
    direito: 780,
    administracao: 650,
    psicologia: 720,
    "engenharia-computacao": 740,
    biologia: 680,
    fisica: 690,
    química: 700,
    enfermagem: 680,
  },
  unicamp: {
    medicina: 820,
    "engenharia-civil": 700,
    direito: 750,
    administracao: 620,
    psicologia: 700,
    "engenharia-computacao": 720,
    biologia: 660,
    fisica: 670,
    química: 680,
    enfermagem: 650,
  },
  uem: {
    medicina: 780,
    "engenharia-civil": 650,
    direito: 680,
    administracao: 580,
    psicologia: 650,
    "engenharia-computacao": 680,
    biologia: 620,
    fisica: 630,
    química: 640,
    enfermagem: 600,
  },
  ufrj: {
    medicina: 810,
    "engenharia-civil": 690,
    direito: 740,
    administracao: 610,
    psicologia: 690,
    "engenharia-computacao": 710,
    biologia: 650,
    fisica: 660,
    química: 670,
    enfermagem: 640,
  },
  ufmg: {
    medicina: 800,
    "engenharia-civil": 680,
    direito: 730,
    administracao: 600,
    psicologia: 680,
    "engenharia-computacao": 700,
    biologia: 640,
    fisica: 650,
    química: 660,
    enfermagem: 630,
  },
  fuvest: {
    medicina: 860,
    "engenharia-civil": 730,
    direito: 790,
    administracao: 660,
    psicologia: 730,
    "engenharia-computacao": 750,
    biologia: 690,
    fisica: 700,
    química: 710,
    enfermagem: 690,
  },
  enem: {
    medicina: 750,
    "engenharia-civil": 600,
    direito: 650,
    administracao: 550,
    psicologia: 620,
    "engenharia-computacao": 640,
    biologia: 580,
    fisica: 590,
    química: 600,
    enfermagem: 570,
  }
};

interface UniversitySelectorProps {
  onSelectionChange: (data: {
    university: string;
    firstChoice: string;
    secondChoice: string;
  }) => void;
}

export const UniversitySelector = ({ onSelectionChange }: UniversitySelectorProps) => {
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [firstChoice, setFirstChoice] = useState("");
  const [secondChoice, setSecondChoice] = useState("");

  const handleUniversityChange = (value: string) => {
    setSelectedUniversity(value);
    onSelectionChange({
      university: value,
      firstChoice,
      secondChoice,
    });
  };

  const handleFirstChoiceChange = (value: string) => {
    setFirstChoice(value);
    onSelectionChange({
      university: selectedUniversity,
      firstChoice: value,
      secondChoice,
    });
  };

  const handleSecondChoiceChange = (value: string) => {
    setSecondChoice(value);
    onSelectionChange({
      university: selectedUniversity,
      firstChoice,
      secondChoice: value,
    });
  };

  const selectedUni = universities.find(u => u.id === selectedUniversity);
  const firstCourseData = courses.find(c => c.id === firstChoice);
  const secondCourseData = courses.find(c => c.id === secondChoice);

  // Obter notas de corte
  const getStudyCutoffScore = (university: string, course: string) => {
    return cutoffScores[university as keyof typeof cutoffScores]?.[course as keyof typeof cutoffScores['usp']] || null;
  };

  const firstChoiceCutoff = selectedUniversity && firstChoice ? getStudyCutoffScore(selectedUniversity, firstChoice) : null;
  const secondChoiceCutoff = selectedUniversity && secondChoice ? getStudyCutoffScore(selectedUniversity, secondChoice) : null;

  return (
    <Card className="shadow-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          Configuração do Vestibular
        </CardTitle>
        <CardDescription>
          Escolha a instituição e seus cursos de interesse para uma experiência personalizada
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* University Selection */}
        <div className="space-y-2">
          <Label htmlFor="university">Instituição</Label>
          <Select value={selectedUniversity} onValueChange={handleUniversityChange}>
            <SelectTrigger id="university">
              <SelectValue placeholder="Selecione a universidade ou vestibular" />
            </SelectTrigger>
            <SelectContent>
              {universities.map((university) => (
                <SelectItem key={university.id} value={university.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{university.name}</span>
                    <Badge variant="outline" className="ml-2">{university.state}</Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Course Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first-choice">1ª Opção de Curso</Label>
            <Select value={firstChoice} onValueChange={handleFirstChoiceChange}>
              <SelectTrigger id="first-choice">
                <SelectValue placeholder="Primeira escolha" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{course.name}</span>
                      <Badge variant="secondary" className="ml-2">{course.area}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="second-choice">2ª Opção de Curso</Label>
            <Select value={secondChoice} onValueChange={handleSecondChoiceChange}>
              <SelectTrigger id="second-choice">
                <SelectValue placeholder="Segunda escolha" />
              </SelectTrigger>
              <SelectContent>
                {courses
                  .filter(course => course.id !== firstChoice)
                  .map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{course.name}</span>
                        <Badge variant="secondary" className="ml-2">{course.area}</Badge>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Selection Summary */}
        {selectedUniversity && (firstChoice || secondChoice) && (
          <div className="bg-accent/50 p-4 rounded-lg border">
            <h4 className="font-medium text-accent-foreground mb-2">Sua Configuração:</h4>
            <div className="space-y-2 text-sm">
              <p><strong>Instituição:</strong> {selectedUni?.name}</p>
              {firstCourseData && (
                <div className="flex items-center justify-between">
                  <span><strong>1ª Opção:</strong> {firstCourseData.name} ({firstCourseData.area})</span>
                  {firstChoiceCutoff && (
                    <Badge variant="destructive" className="ml-2">
                      Nota de corte: {firstChoiceCutoff} pts
                    </Badge>
                  )}
                </div>
              )}
              {secondCourseData && (
                <div className="flex items-center justify-between">
                  <span><strong>2ª Opção:</strong> {secondCourseData.name} ({secondCourseData.area})</span>
                  {secondChoiceCutoff && (
                    <Badge variant="destructive" className="ml-2">
                      Nota de corte: {secondChoiceCutoff} pts
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};