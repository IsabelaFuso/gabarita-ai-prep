import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast"

// Based on the database schema
type Question = {
  id?: string;
  institution_id: string | null;
  subject_id: string | null;
  topic_id: string | null;
  year: number | null;
  question_number: string | null;
  type: 'multipla_escolha' | 'discursiva' | 'verdadeiro_falso';
  difficulty: 'facil' | 'medio' | 'dificil';
  statement: string;
  alternatives: { [key: string]: string };
  correct_answer: string;
  explanation: string | null;
  image_url: string | null;
  tags: string[] | null;
  competencies: string[] | null;
  skills: string[] | null;
};

const initialQuestionState: Question = {
  institution_id: null,
  subject_id: null,
  topic_id: null,
  year: new Date().getFullYear(),
  question_number: '',
  type: 'multipla_escolha',
  difficulty: 'medio',
  statement: '',
  alternatives: { A: '', B: '', C: '', D: '', E: '' },
  correct_answer: 'A',
  explanation: '',
  image_url: '',
  tags: [],
  competencies: [],
  skills: [],
};

const QuestionEditor = () => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState<Question>(initialQuestionState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [institutions, setInstitutions] = useState<{ id: string; name: string }[]>([]);
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [topics, setTopics] = useState<{ id: string; name: string; subject_id: string }[]>([]);

  const fetchInitialData = async () => {
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

    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({ title: "Erro ao carregar dados", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof Question, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAlternativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      alternatives: { ...prev.alternatives, [name]: value },
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

      const questionPayload = {
        ...formData,
        image_url: imageUrl,
        // Ensure numeric and array fields are correctly formatted
        year: formData.year ? Number(formData.year) : null,
        tags: typeof formData.tags === 'string' ? (formData.tags as string).split(',').map(t => t.trim()) : formData.tags,
        competencies: typeof formData.competencies === 'string' ? (formData.competencies as string).split(',').map(t => t.trim()) : formData.competencies,
        skills: typeof formData.skills === 'string' ? (formData.skills as string).split(',').map(t => t.trim()) : formData.skills,
      };

      const { data, error } = await supabase
        .from('questions')
        .upsert(questionPayload)
        .select();

      if (error) throw error;

      toast({ title: "Sucesso!", description: `Questão ${selectedQuestion ? 'atualizada' : 'criada'} com sucesso.` });
      clearForm();
      fetchInitialData(); // Refresh the list

    } catch (error: any) {
      console.error('Error saving question:', error);
      toast({ title: "Erro ao salvar questão", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectQuestion = (question: any) => {
    setSelectedQuestion(question);
    setFormData({
      ...question,
      // Ensure alternatives is an object, not a string
      alternatives: typeof question.alternatives === 'string' 
        ? JSON.parse(question.alternatives) 
        : question.alternatives || { A: '', B: '', C: '', D: '', E: '' },
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
      q.subject?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.institution?.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                <div>
                  <Label>Instituição</Label>
                  <Select onValueChange={(value) => handleSelectChange('institution_id', value)} value={formData.institution_id || ''}>
                    <SelectTrigger><SelectValue placeholder="Selecione a Instituição" /></SelectTrigger>
                    <SelectContent>
                      {institutions.map(inst => <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Ano</Label>
                  <Input type="number" name="year" value={formData.year || ''} onChange={handleInputChange} />
                </div>
                <div>
                  <Label>Disciplina</Label>
                  <Select onValueChange={(value) => handleSelectChange('subject_id', value)} value={formData.subject_id || ''}>
                    <SelectTrigger><SelectValue placeholder="Selecione a Disciplina" /></SelectTrigger>
                    <SelectContent>
                      {subjects.map(subj => <SelectItem key={subj.id} value={subj.id}>{subj.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tópico</Label>
                  <Select onValueChange={(value) => handleSelectChange('topic_id', value)} value={formData.topic_id || ''} disabled={!formData.subject_id}>
                    <SelectTrigger><SelectValue placeholder="Selecione o Tópico" /></SelectTrigger>
                    <SelectContent>
                      {topics.filter(t => t.subject_id === formData.subject_id).map(topic => <SelectItem key={topic.id} value={topic.id}>{topic.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                 <div>
                  <Label>Dificuldade</Label>
                  <Select onValueChange={(value) => handleSelectChange('difficulty', value)} value={formData.difficulty}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facil">Fácil</SelectItem>
                      <SelectItem value="medio">Médio</SelectItem>
                      <SelectItem value="dificil">Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <div>
                  <Label>Número da Questão</Label>
                  <Input name="question_number" value={formData.question_number || ''} onChange={handleInputChange} />
                </div>
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

              {/* Alternatives */}
              <div>
                <Label>Alternativas</Label>
                {Object.keys(formData.alternatives).map(key => (
                  <div key={key} className="flex items-center gap-2 mb-2">
                    <Label className="w-8">{key}:</Label>
                    <Input name={key} value={formData.alternatives[key]} onChange={handleAlternativeChange} />
                  </div>
                ))}
              </div>

              {/* Correct Answer */}
              <div>
                <Label>Resposta Correta</Label>
                <Select onValueChange={(value) => handleSelectChange('correct_answer', value)} value={formData.correct_answer}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.keys(formData.alternatives).map(key => <SelectItem key={key} value={key}>{key}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

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