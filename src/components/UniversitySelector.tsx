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
  // Área da Saúde
  { id: "medicina", name: "Medicina", area: "Saúde" },
  { id: "enfermagem", name: "Enfermagem", area: "Saúde" },
  { id: "odontologia", name: "Odontologia", area: "Saúde" },
  { id: "fisioterapia", name: "Fisioterapia", area: "Saúde" },
  { id: "farmacia", name: "Farmácia", area: "Saúde" },
  { id: "veterinaria", name: "Medicina Veterinária", area: "Saúde" },
  { id: "nutricao", name: "Nutrição", area: "Saúde" },
  { id: "fonoaudiologia", name: "Fonoaudiologia", area: "Saúde" },
  
  // Área de Exatas
  { id: "engenharia-civil", name: "Engenharia Civil", area: "Exatas" },
  { id: "engenharia-computacao", name: "Engenharia de Computação", area: "Exatas" },
  { id: "engenharia-eletrica", name: "Engenharia Elétrica", area: "Exatas" },
  { id: "engenharia-mecanica", name: "Engenharia Mecânica", area: "Exatas" },
  { id: "engenharia-quimica", name: "Engenharia Química", area: "Exatas" },
  { id: "engenharia-producao", name: "Engenharia de Produção", area: "Exatas" },
  { id: "engenharia-ambiental", name: "Engenharia Ambiental", area: "Exatas" },
  { id: "arquitetura", name: "Arquitetura e Urbanismo", area: "Exatas" },
  { id: "matematica", name: "Matemática", area: "Exatas" },
  { id: "fisica", name: "Física", area: "Exatas" },
  { id: "química", name: "Química", area: "Exatas" },
  { id: "ciencia-computacao", name: "Ciência da Computação", area: "Exatas" },
  { id: "sistemas-informacao", name: "Sistemas de Informação", area: "Exatas" },
  
  // Área de Humanas  
  { id: "direito", name: "Direito", area: "Humanas" },
  { id: "administracao", name: "Administração", area: "Humanas" },
  { id: "psicologia", name: "Psicologia", area: "Humanas" },
  { id: "economia", name: "Economia", area: "Humanas" },
  { id: "ciencias-contabeis", name: "Ciências Contábeis", area: "Humanas" },
  { id: "pedagogia", name: "Pedagogia", area: "Humanas" },
  { id: "historia", name: "História", area: "Humanas" },
  { id: "geografia", name: "Geografia", area: "Humanas" },
  { id: "filosofia", name: "Filosofia", area: "Humanas" },
  { id: "sociologia", name: "Sociologia", area: "Humanas" },
  { id: "letras", name: "Letras", area: "Humanas" },
  { id: "comunicacao-social", name: "Comunicação Social", area: "Humanas" },
  { id: "jornalismo", name: "Jornalismo", area: "Humanas" },
  { id: "publicidade", name: "Publicidade e Propaganda", area: "Humanas" },
  { id: "turismo", name: "Turismo", area: "Humanas" },
  { id: "relacoes-internacionais", name: "Relações Internacionais", area: "Humanas" },
  
  // Área Biológicas
  { id: "biologia", name: "Biologia", area: "Biológicas" },
  { id: "biomedicina", name: "Biomedicina", area: "Biológicas" },
  { id: "biotecnologia", name: "Biotecnologia", area: "Biológicas" },
  { id: "ciencias-ambientais", name: "Ciências Ambientais", area: "Biológicas" },
  { id: "zootecnia", name: "Zootecnia", area: "Biológicas" },
  { id: "agronomia", name: "Agronomia", area: "Biológicas" },
  { id: "engenharia-florestal", name: "Engenharia Florestal", area: "Biológicas" },
  
  // Área de Artes
  { id: "artes-visuais", name: "Artes Visuais", area: "Artes" },
  { id: "musica", name: "Música", area: "Artes" },
  { id: "teatro", name: "Teatro", area: "Artes" },
  { id: "danca", name: "Dança", area: "Artes" },
  { id: "design", name: "Design", area: "Artes" },
  { id: "design-grafico", name: "Design Gráfico", area: "Artes" },
];

// Notas de corte por universidade e curso (dados de exemplo)
const cutoffScores = {
  usp: {
    // Saúde
    medicina: 850, enfermagem: 680, odontologia: 820, fisioterapia: 750, farmacia: 720, veterinaria: 780, nutricao: 690, fonoaudiologia: 710,
    // Exatas
    "engenharia-civil": 720, "engenharia-computacao": 740, "engenharia-eletrica": 730, "engenharia-mecanica": 725, "engenharia-quimica": 735, "engenharia-producao": 710, "engenharia-ambiental": 700, arquitetura: 760, matematica: 680, fisica: 690, química: 700, "ciencia-computacao": 750, "sistemas-informacao": 720,
    // Humanas
    direito: 780, administracao: 650, psicologia: 720, economia: 730, "ciencias-contabeis": 640, pedagogia: 620, historia: 650, geografia: 640, filosofia: 630, sociologia: 625, letras: 620, "comunicacao-social": 680, jornalismo: 700, publicidade: 690, turismo: 610, "relacoes-internacionais": 720,
    // Biológicas
    biologia: 680, biomedicina: 740, biotecnologia: 730, "ciencias-ambientais": 670, zootecnia: 650, agronomia: 660, "engenharia-florestal": 640,
    // Artes
    "artes-visuais": 600, musica: 650, teatro: 620, danca: 610, design: 680, "design-grafico": 670
  },
  unicamp: {
    // Saúde
    medicina: 820, enfermagem: 650, odontologia: 790, fisioterapia: 720, farmacia: 690, veterinaria: 750, nutricao: 660, fonoaudiologia: 680,
    // Exatas
    "engenharia-civil": 700, "engenharia-computacao": 720, "engenharia-eletrica": 710, "engenharia-mecanica": 705, "engenharia-quimica": 715, "engenharia-producao": 690, "engenharia-ambiental": 680, arquitetura: 730, matematica: 660, fisica: 670, química: 680, "ciencia-computacao": 730, "sistemas-informacao": 700,
    // Humanas
    direito: 750, administracao: 620, psicologia: 700, economia: 710, "ciencias-contabeis": 620, pedagogia: 600, historia: 630, geografia: 620, filosofia: 610, sociologia: 605, letras: 600, "comunicacao-social": 660, jornalismo: 680, publicidade: 670, turismo: 590, "relacoes-internacionais": 700,
    // Biológicas
    biologia: 660, biomedicina: 720, biotecnologia: 710, "ciencias-ambientais": 650, zootecnia: 630, agronomia: 640, "engenharia-florestal": 620,
    // Artes
    "artes-visuais": 580, musica: 630, teatro: 600, danca: 590, design: 660, "design-grafico": 650
  },
  uem: {
    // Saúde
    medicina: 780, enfermagem: 600, odontologia: 740, fisioterapia: 670, farmacia: 640, veterinaria: 700, nutricao: 610, fonoaudiologia: 630,
    // Exatas
    "engenharia-civil": 650, "engenharia-computacao": 680, "engenharia-eletrica": 660, "engenharia-mecanica": 655, "engenharia-quimica": 665, "engenharia-producao": 640, "engenharia-ambiental": 630, arquitetura: 680, matematica: 610, fisica: 630, química: 640, "ciencia-computacao": 690, "sistemas-informacao": 650,
    // Humanas
    direito: 680, administracao: 580, psicologia: 650, economia: 660, "ciencias-contabeis": 570, pedagogia: 550, historia: 580, geografia: 570, filosofia: 560, sociologia: 555, letras: 550, "comunicacao-social": 610, jornalismo: 630, publicidade: 620, turismo: 540, "relacoes-internacionais": 650,
    // Biológicas
    biologia: 620, biomedicina: 670, biotecnologia: 660, "ciencias-ambientais": 600, zootecnia: 580, agronomia: 590, "engenharia-florestal": 570,
    // Artes
    "artes-visuais": 530, musica: 580, teatro: 550, danca: 540, design: 610, "design-grafico": 600
  },
  ufrj: {
    // Saúde
    medicina: 810, enfermagem: 640, odontologia: 780, fisioterapia: 710, farmacia: 680, veterinaria: 740, nutricao: 650, fonoaudiologia: 670,
    // Exatas
    "engenharia-civil": 690, "engenharia-computacao": 710, "engenharia-eletrica": 700, "engenharia-mecanica": 695, "engenharia-quimica": 705, "engenharia-producao": 680, "engenharia-ambiental": 670, arquitetura: 720, matematica: 650, fisica: 660, química: 670, "ciencia-computacao": 720, "sistemas-informacao": 690,
    // Humanas
    direito: 740, administracao: 610, psicologia: 690, economia: 700, "ciencias-contabeis": 610, pedagogia: 590, historia: 620, geografia: 610, filosofia: 600, sociologia: 595, letras: 590, "comunicacao-social": 650, jornalismo: 670, publicidade: 660, turismo: 580, "relacoes-internacionais": 690,
    // Biológicas
    biologia: 650, biomedicina: 710, biotecnologia: 700, "ciencias-ambientais": 640, zootecnia: 620, agronomia: 630, "engenharia-florestal": 610,
    // Artes
    "artes-visuais": 570, musica: 620, teatro: 590, danca: 580, design: 650, "design-grafico": 640
  },
  ufmg: {
    // Saúde
    medicina: 800, enfermagem: 630, odontologia: 770, fisioterapia: 700, farmacia: 670, veterinaria: 730, nutricao: 640, fonoaudiologia: 660,
    // Exatas
    "engenharia-civil": 680, "engenharia-computacao": 700, "engenharia-eletrica": 690, "engenharia-mecanica": 685, "engenharia-quimica": 695, "engenharia-producao": 670, "engenharia-ambiental": 660, arquitetura: 710, matematica: 640, fisica: 650, química: 660, "ciencia-computacao": 710, "sistemas-informacao": 680,
    // Humanas
    direito: 730, administracao: 600, psicologia: 680, economia: 690, "ciencias-contabeis": 600, pedagogia: 580, historia: 610, geografia: 600, filosofia: 590, sociologia: 585, letras: 580, "comunicacao-social": 640, jornalismo: 660, publicidade: 650, turismo: 570, "relacoes-internacionais": 680,
    // Biológicas
    biologia: 640, biomedicina: 700, biotecnologia: 690, "ciencias-ambientais": 630, zootecnia: 610, agronomia: 620, "engenharia-florestal": 600,
    // Artes
    "artes-visuais": 560, musica: 610, teatro: 580, danca: 570, design: 640, "design-grafico": 630
  },
  fuvest: {
    // Saúde
    medicina: 860, enfermagem: 690, odontologia: 830, fisioterapia: 760, farmacia: 730, veterinaria: 790, nutricao: 700, fonoaudiologia: 720,
    // Exatas
    "engenharia-civil": 730, "engenharia-computacao": 750, "engenharia-eletrica": 740, "engenharia-mecanica": 735, "engenharia-quimica": 745, "engenharia-producao": 720, "engenharia-ambiental": 710, arquitetura: 770, matematica: 690, fisica: 700, química: 710, "ciencia-computacao": 760, "sistemas-informacao": 730,
    // Humanas
    direito: 790, administracao: 660, psicologia: 730, economia: 740, "ciencias-contabeis": 650, pedagogia: 630, historia: 660, geografia: 650, filosofia: 640, sociologia: 635, letras: 630, "comunicacao-social": 690, jornalismo: 710, publicidade: 700, turismo: 620, "relacoes-internacionais": 730,
    // Biológicas
    biologia: 690, biomedicina: 750, biotecnologia: 740, "ciencias-ambientais": 680, zootecnia: 660, agronomia: 670, "engenharia-florestal": 650,
    // Artes
    "artes-visuais": 610, musica: 660, teatro: 630, danca: 620, design: 690, "design-grafico": 680
  },
  enem: {
    // Saúde
    medicina: 750, enfermagem: 570, odontologia: 720, fisioterapia: 650, farmacia: 620, veterinaria: 680, nutricao: 580, fonoaudiologia: 600,
    // Exatas
    "engenharia-civil": 600, "engenharia-computacao": 640, "engenharia-eletrica": 630, "engenharia-mecanica": 625, "engenharia-quimica": 635, "engenharia-producao": 610, "engenharia-ambiental": 600, arquitetura: 660, matematica: 580, fisica: 590, química: 600, "ciencia-computacao": 650, "sistemas-informacao": 620,
    // Humanas
    direito: 650, administracao: 550, psicologia: 620, economia: 630, "ciencias-contabeis": 540, pedagogia: 520, historia: 550, geografia: 540, filosofia: 530, sociologia: 525, letras: 520, "comunicacao-social": 580, jornalismo: 600, publicidade: 590, turismo: 510, "relacoes-internacionais": 620,
    // Biológicas
    biologia: 580, biomedicina: 640, biotecnologia: 630, "ciencias-ambientais": 570, zootecnia: 550, agronomia: 560, "engenharia-florestal": 540,
    // Artes
    "artes-visuais": 500, musica: 550, teatro: 520, danca: 510, design: 580, "design-grafico": 570
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