import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle, Trash2 } from 'lucide-react';

// Based on the updated database schema
type Question = {
  id?: string;
  institution_id: string | null;
  subject_id: string | null;
  topic_id: string | null;
  year: number | null;
  question_number: string | null;
  type: 'multipla_escolha' | 'discursiva' | 'verdadeiro_falso' | 'summation';
  difficulty: 'facil' | 'medio' | 'dificil';
  statement: string;
  options: { [key: string]: string } | { text: string; value: number }[];
  correct_answers: { answer?: string; sum?: number };
  correct_sum?: number | null;
  explanation: string | null;
  image_url: string | null;
  tags: string[] | null;
  competencies: string[] | null;
  skills: string[] | null;
};

const initialSummationOptions = [
  { text: '', value: 1 },
  { text: '', value: 2 },
  { text: '', value: 4 },
  { text: '', value: 8 },
  { text: '', value: 16 },
];

const initialQuestionState: Question = {
  institution_id: null,
  subject_id: null,
  topic_id: null,
  year: new Date().getFullYear(),
  question_number: '',
  type: 'multipla_escolha',
  difficulty: 'medio',
  statement: '',
  options: { A: '', B: '', C: '', D: '', E: '' },
  correct_answers: { answer: 'A' },
  correct_sum: null,
  explanation: '',
  image_url: '',
  tags: [],
  competencies: [],
  skills: [],
};

const QuestionEditor = () => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState<Question>(initialQuestionState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [institutions, setInstitutions] = useState<{ id: string; name: string }[]>([]);
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [topics, setTopics] = useState<{ id: string; name: string; subject_id: string }[]>([]);

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        { data: institutionsData, error: instError },
        { data: subjectsData, error: subjError },
        { data: topicsData, error: topicsError },
        { data: questionsData, error: questError }
      ] = await Promise.all([
        supabase.from('institutions').select('id, name'),
        supabase.from('subjects').select('id, name'),
        supabase.from('topics').select('id, name, subject_id'),
        supabase.from('questions').select(`
          *,
          institution:institution_id(name),
          subject:subject_id(name)
        `).order('created_at', { ascending: false })
      ]);

      if (instError) throw instError;
      if (subjError) throw subjError;
      if (topicsError) throw topicsError;
      if (questError) throw questError;

      setInstitutions(institutionsData || []);
      setSubjects(subjectsData || []);
      setTopics(topicsData || []);
      setQuestions(questionsData || []);

    } catch (error: unknown) {
      console.error('Error fetching data:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast({ title: "Erro ao carregar dados", description: errorMessage, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof Question, value: string | 'multipla_escolha' | 'summation' | 'discursiva' | 'verdadeiro_falso' | 'facil' | 'medio' | 'dificil') => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleQuestionTypeChange = (value: 'multipla_escolha' | 'summation') => {
    if (value === 'summation') {
      setFormData(prev => ({
        ...prev,
        type: 'summation',
        options: initialSummationOptions,
        correct_answers: { sum: 0 },
        correct_sum: 0,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        type: 'multipla_escolha',
        options: { A: '', B: '', C: '', D: '', E: '' },
        correct_answers: { answer: 'A' },
        correct_sum: null,
      }));
    }
  };

  const handleAlternativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      options: { ...(prev.options as object), [name]: value },
    }));
  };

  const handleSummationOptionChange = (index: number, field: 'text' | 'value', value: string) => {
    const newOptions = [...(formData.options as { text: string; value: number }[])];
    newOptions[index] = { ...newOptions[index], [field]: field === 'value' ? parseInt(value, 10) || 0 : value };
    setFormData(prev => ({ ...prev, options: newOptions }));
  };
  
  const addSummationOption = () => {
    const newOptions = [...(formData.options as { text: string; value: number }[]), { text: '', value: 0 }];
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const removeSummationOption = (index: number) => {
    const newOptions = [...(formData.options as { text: string; value: number }[])];
    newOptions.splice(index, 1);
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleCorrectSumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sum = parseInt(e.target.value, 10) || 0;
    setFormData(prev => ({
      ...prev,
      correct_answers: { sum },
      correct_sum: sum,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image_url;

      if (imageFile) {
        const filePath = `question-images/${Date.now()}_${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('question-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('question-images').getPublicUrl(filePath);
        imageUrl = publicUrl;
      }
      
      const toArray = (input: unknown): string[] => {
        if (Array.isArray(input)) return input;
        if (typeof input === 'string') return input.split(',').map(s => s.trim()).filter(Boolean);
        return [];
      };

      const questionPayload: Omit<Question, 'id'> & { id?: string } = {
        institution_id: formData.institution_id,
        subject_id: formData.subject_id,
        topic_id: formData.topic_id,
        year: formData.year ? Number(formData.year) : null,
        question_number: formData.question_number,
        type: formData.type,
        difficulty: formData.difficulty,
        statement: formData.statement,
        options: formData.options,
        correct_answers: formData.correct_answers,
        correct_sum: formData.correct_sum,
        explanation: formData.explanation,
        image_url: imageUrl,
        tags: toArray(formData.tags),
        competencies: toArray(formData.competencies),
        skills: toArray(formData.skills),
      };
      
      if (selectedQuestion?.id) {
        questionPayload.id = selectedQuestion.id;
      }

      const { error } = await supabase
        .from('questions')
        .upsert(questionPayload)
        .select();

      if (error) throw error;

      toast({ title: "Sucesso!", description: `Questão ${selectedQuestion ? 'atualizada' : 'criada'} com sucesso.` });
      clearForm();
      fetchInitialData(); // Refresh the list

    } catch (error: unknown) {
      console.error('Error saving question:', JSON.stringify(error, null, 2));
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast({ title: "Erro ao salvar questão", description: errorMessage, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectQuestion = (question: Question) => {
    setSelectedQuestion(question);

    const type = question.type || 'multipla_escolha';

    let normalizedOptions: { [key: string]: string } | { text: string; value: number }[];
    let normalizedCorrectAnswers: { answer?: string; sum?: number };
    let normalizedCorrectSum: number | null;

    if (type === 'summation') {
      normalizedOptions = Array.isArray(question.options) && question.options.length > 0 ? question.options : initialSummationOptions;
      const sum = question.correct_sum ?? (question.correct_answers?.sum ?? 0);
      normalizedCorrectAnswers = { sum };
      normalizedCorrectSum = sum;
    } else { // 'multipla_escolha'
      let parsedOptions = { A: '', B: '', C: '', D: '', E: '' };
      if (question.options) {
        if (typeof question.options === 'string') {
          try {
            parsedOptions = JSON.parse(question.options);
          } catch (e) {
            console.error("Failed to parse options string:", e);
          }
        } else if (typeof question.options === 'object' && !Array.isArray(question.options)) {
          parsedOptions = question.options as { [key: string]: string };
        }
      }
      normalizedOptions = parsedOptions;
      normalizedCorrectAnswers = { answer: question.correct_answers?.answer || 'A' };
      normalizedCorrectSum = null;
    }

    setFormData({
      ...initialQuestionState,
      ...question,
      type,
      options: normalizedOptions,
      correct_answers: normalizedCorrectAnswers,
      correct_sum: normalizedCorrectSum,
    });

    setImageFile(null);
  };

  const clearForm = () => {
    setSelectedQuestion(null);
    setFormData(initialQuestionState);
    setImageFile(null);
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => 
      q.statement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.subject?.name && q.subject.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (q.institution?.name && q.institution.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [questions, searchTerm]);

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Questões Cadastradas</CardTitle>
          </CardHeader>
          <CardContent>
            <Input 
              placeholder="Buscar por enunciado, matéria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            <div className="max-h-[600px] overflow-y-auto">
              {loading && <p>Carregando...</p>}
              {filteredQuestions.map(q => (
                <div key={q.id} onClick={() => handleSelectQuestion(q)} className="p-2 mb-2 border rounded-md cursor-pointer hover:bg-accent">
                  <p className="font-bold truncate">{q.statement}</p>
                  <p className="text-sm text-muted-foreground">{q.subject?.name} - {q.institution?.name} ({q.year})</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>{selectedQuestion ? 'Editar Questão' : 'Cadastrar Nova Questão'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select onValueChange={(value) => handleSelectChange('institution_id', value)} value={formData.institution_id || ''}>
                  <SelectTrigger><SelectValue placeholder="Selecione a Instituição" /></SelectTrigger>
                  <SelectContent>
                    {institutions.map(inst => <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input type="number" name="year" placeholder="Ano" value={formData.year || ''} onChange={handleInputChange} />
                <Select onValueChange={(value) => handleSelectChange('subject_id', value)} value={formData.subject_id || ''}>
                  <SelectTrigger><SelectValue placeholder="Selecione a Disciplina" /></SelectTrigger>
                  <SelectContent>
                    {subjects.map(subj => <SelectItem key={subj.id} value={subj.id}>{subj.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select onValueChange={(value) => handleSelectChange('topic_id', value)} value={formData.topic_id || ''} disabled={!formData.subject_id}>
                  <SelectTrigger><SelectValue placeholder="Selecione o Tópico" /></SelectTrigger>
                  <SelectContent>
                    {topics.filter(t => t.subject_id === formData.subject_id).map(topic => <SelectItem key={topic.id} value={topic.id}>{topic.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select onValueChange={(value) => handleSelectChange('difficulty', value)} value={formData.difficulty}>
                  <SelectTrigger><SelectValue placeholder="Dificuldade" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facil">Fácil</SelectItem>
                    <SelectItem value="medio">Médio</SelectItem>
                    <SelectItem value="dificil">Difícil</SelectItem>
                  </SelectContent>
                </Select>
                <Input name="question_number" placeholder="Número da Questão" value={formData.question_number || ''} onChange={handleInputChange} />
              </div>

              {/* Question Type */}
              <div>
                <Label>Tipo de Questão</Label>
                <Select onValueChange={(value: 'multipla_escolha' | 'summation') => handleQuestionTypeChange(value)} value={formData.type}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multipla_escolha">Múltipla Escolha</SelectItem>
                    <SelectItem value="summation">Somatória</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Statement */}
              <div>
                <Label>Enunciado</Label>
                <Textarea name="statement" value={formData.statement} onChange={handleInputChange} rows={5} />
              </div>

              {/* Image Upload */}
              <div>
                <Label>Imagem (Opcional)</Label>
                <Input type="file" onChange={handleImageChange} accept="image/*" />
                {formData.image_url && !imageFile && <img src={formData.image_url} alt="Preview" className="mt-2 max-h-40" />}
                {imageFile && <img src={URL.createObjectURL(imageFile)} alt="Preview" className="mt-2 max-h-40" />}
              </div>

              {/* Alternatives / Summation Options */}
              {formData.type === 'multipla_escolha' && (
                <div>
                  <Label>Alternativas</Label>
                  {Object.keys(formData.options as { [key: string]: string }).map(key => (
                    <div key={key} className="flex items-center gap-2 mb-2">
                      <Label className="w-8">{key}:</Label>
                      <Input name={key} value={(formData.options as { [key: string]: string })[key]} onChange={handleAlternativeChange} />
                    </div>
                  ))}
                  <Label>Resposta Correta</Label>
                  <Select onValueChange={(value) => setFormData(p => ({...p, correct_answers: { answer: value }}))} value={formData.correct_answers?.answer}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.keys(formData.options as { [key: string]: string }).map(key => <SelectItem key={key} value={key}>{key}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {formData.type === 'summation' && (
                <div>
                  <Label>Afirmativas da Somatória</Label>
                  {(formData.options as { text: string; value: number }[]).map((option, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <Input 
                        type="number" 
                        value={option.value} 
                        onChange={(e) => handleSummationOptionChange(index, 'value', e.target.value)}
                        className="w-20"
                      />
                      <Textarea 
                        value={option.text} 
                        onChange={(e) => handleSummationOptionChange(index, 'text', e.target.value)}
                        rows={1}
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeSummationOption(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                   <Button type="button" variant="outline" size="sm" onClick={addSummationOption} className="mt-2">
                      <PlusCircle className="h-4 w-4 mr-2" /> Adicionar Afirmativa
                    </Button>
                  <div className="mt-4">
                    <Label>Soma das Respostas Corretas</Label>
                    <Input type="number" value={formData.correct_sum || ''} onChange={handleCorrectSumChange} className="w-40" />
                  </div>
                </div>
              )}

              {/* Explanation */}
              <div>
                <Label>Explicação da Resposta</Label>
                <Textarea name="explanation" value={formData.explanation || ''} onChange={handleInputChange} rows={3} />
              </div>
              
              {/* Tags & Competencies */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input name="tags" placeholder="Tags (ex: enem, 2022)" value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags || ''} onChange={handleInputChange} />
                <Input name="competencies" placeholder="Competências (ex: C1, C2)" value={Array.isArray(formData.competencies) ? formData.competencies.join(', ') : formData.competencies || ''} onChange={handleInputChange} />
                <Input name="skills" placeholder="Habilidades (ex: H1, H2)" value={Array.isArray(formData.skills) ? formData.skills.join(', ') : formData.skills || ''} onChange={handleInputChange} />
              </div>


              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={clearForm} disabled={loading}>Cancelar</Button>
                <Button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar Questão'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuestionEditor;