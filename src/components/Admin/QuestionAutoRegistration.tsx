import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { Upload, FileText, ImageIcon, Bot, Loader2, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ExtractedQuestion {
  statement: string;
  type: 'multipla_escolha' | 'summation' | 'discursiva' | 'verdadeiro_falso';
  options: { [key: string]: string } | { text: string; value: number }[];
  correct_answer: string;
  difficulty: 'facil' | 'medio' | 'dificil';
  institution_id?: string;
  subject_id?: string;
  year?: number;
}

export const QuestionAutoRegistration = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [extractedQuestions, setExtractedQuestions] = useState<ExtractedQuestion[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validar tipo de arquivo
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Tipo de arquivo não suportado",
          description: "Use apenas imagens (JPG, PNG), PDFs ou arquivos de texto.",
          variant: "destructive"
        });
        return;
      }
      
      // Validar tamanho (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 10MB.",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
      setTextInput(''); // Limpar input de texto
    }
  };

  const processWithAI = async (content: string, isImage: boolean = false) => {
    const { data, error } = await supabase.functions.invoke('process-question-ai', {
      body: {
        content,
        isImage,
        processType: 'extract_questions'
      }
    });

    if (error) throw error;
    return data;
  };

  const extractTextFromImage = async (file: File): Promise<string> => {
    setProcessingStep('Extraindo texto da imagem com OCR...');
    setProgress(25);
    
    const formData = new FormData();
    formData.append('image', file);
    
    const { data, error } = await supabase.functions.invoke('ocr-extract-text', {
      body: formData
    });
    
    if (error) throw error;
    return data.extractedText;
  };

  const handleProcessFile = async () => {
    if (!selectedFile && !textInput.trim()) {
      toast({
        title: "Dados necessários",
        description: "Selecione um arquivo ou insira texto para processar.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setExtractedQuestions([]);

    try {
      let contentToProcess = '';

      if (selectedFile) {
        setProcessingStep('Preparando arquivo...');
        setProgress(10);

        if (selectedFile.type.startsWith('image/')) {
          // Processar imagem com OCR
          contentToProcess = await extractTextFromImage(selectedFile);
        } else if (selectedFile.type === 'application/pdf') {
          // Processar PDF
          setProcessingStep('Extraindo texto do PDF...');
          setProgress(25);
          
          const formData = new FormData();
          formData.append('pdf', selectedFile);
          
          const { data, error } = await supabase.functions.invoke('pdf-extract-text', {
            body: formData
          });
          
          if (error) throw error;
          contentToProcess = data.extractedText;
        } else {
          // Arquivo de texto
          contentToProcess = await selectedFile.text();
        }
      } else {
        contentToProcess = textInput;
      }

      // Processar com IA
      setProcessingStep('Analisando questões com IA...');
      setProgress(50);

      const aiResults = await processWithAI(contentToProcess, selectedFile?.type.startsWith('image/'));
      
      setProcessingStep('Estruturando dados das questões...');
      setProgress(75);

      // Mapear resultados da IA para estrutura esperada
      const questions: ExtractedQuestion[] = aiResults.questions.map((q: any) => ({
        statement: q.statement,
        type: q.type || 'multipla_escolha',
        options: q.options || {},
        correct_answer: q.correct_answer || '',
        difficulty: q.difficulty || 'medio',
        institution_id: q.institution_id,
        subject_id: q.subject_id,
        year: q.year
      }));

      setExtractedQuestions(questions);
      setProgress(100);
      setProcessingStep('Processamento concluído!');

      toast({
        title: "Sucesso!",
        description: `${questions.length} questão(ões) extraída(s) com sucesso.`
      });

    } catch (error) {
      console.error('Erro no processamento:', error);
      toast({
        title: "Erro no processamento",
        description: "Não foi possível processar o conteúdo. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveQuestions = async () => {
    if (extractedQuestions.length === 0) {
      toast({
        title: "Nenhuma questão para salvar",
        description: "Processe um arquivo ou texto primeiro.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProcessingStep('Salvando questões no banco de dados...');
    setProgress(0);

    try {
      let savedCount = 0;
      
      for (let i = 0; i < extractedQuestions.length; i++) {
        const question = extractedQuestions[i];
        
        // Preparar dados para inserção
        const questionData = {
          statement: question.statement,
          type: question.type,
          difficulty: question.difficulty,
          options: question.options,
          correct_answers: { answer: question.correct_answer },
          explanation: null,
          institution_id: question.institution_id,
          subject_id: question.subject_id,
          year: question.year,
          alternatives: question.type === 'multipla_escolha' ? 
            Object.values(question.options as { [key: string]: string }) : null,
          correct_answer: question.correct_answer
        };

        const { error } = await supabase
          .from('questions')
          .insert(questionData);

        if (error) {
          console.error(`Erro ao salvar questão ${i + 1}:`, error);
        } else {
          savedCount++;
        }
        
        setProgress(((i + 1) / extractedQuestions.length) * 100);
      }

      toast({
        title: "Questões salvas!",
        description: `${savedCount} de ${extractedQuestions.length} questões salvas com sucesso.`
      });

      // Limpar formulário
      setSelectedFile(null);
      setTextInput('');
      setExtractedQuestions([]);
      setProgress(0);
      setProcessingStep('');

    } catch (error) {
      console.error('Erro ao salvar questões:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar algumas questões.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditQuestion = (index: number, field: keyof ExtractedQuestion, value: any) => {
    const updatedQuestions = [...extractedQuestions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setExtractedQuestions(updatedQuestions);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Autocadastro de Questões</h1>
        <p className="text-muted-foreground">
          Utilize IA para extrair e cadastrar questões automaticamente
        </p>
      </div>

      {/* Upload Section */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload de Arquivos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="file-upload">Arquivo (Imagem, PDF ou Texto)</Label>
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf,.txt"
              className="mt-1"
            />
            {selectedFile && (
              <div className="flex items-center gap-2 mt-2 p-2 bg-muted rounded-md">
                {selectedFile.type.startsWith('image/') ? (
                  <ImageIcon className="w-4 h-4" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                <span className="text-sm">{selectedFile.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                >
                  ×
                </Button>
              </div>
            )}
          </div>

          <div className="text-center text-muted-foreground">OU</div>

          <div>
            <Label htmlFor="text-input">Inserir Texto Diretamente</Label>
            <Textarea
              id="text-input"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Cole ou digite o texto das questões aqui..."
              rows={6}
              className="mt-1"
            />
          </div>

          <Button
            onClick={handleProcessFile}
            disabled={isProcessing || (!selectedFile && !textInput.trim())}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Bot className="w-4 h-4 mr-2" />
                Processar com IA
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Processing Progress */}
      {isProcessing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{processingStep}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Extracted Questions */}
      {extractedQuestions.length > 0 && (
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              Questões Extraídas ({extractedQuestions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {extractedQuestions.map((question, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Questão {index + 1}</h4>
                  <div className="flex gap-2">
                    <select
                      value={question.type}
                      onChange={(e) => handleEditQuestion(index, 'type', e.target.value)}
                      className="px-2 py-1 border rounded text-sm"
                    >
                      <option value="multipla_escolha">Múltipla Escolha</option>
                      <option value="summation">Somatória</option>
                      <option value="discursiva">Discursiva</option>
                      <option value="verdadeiro_falso">Verdadeiro/Falso</option>
                    </select>
                    <select
                      value={question.difficulty}
                      onChange={(e) => handleEditQuestion(index, 'difficulty', e.target.value)}
                      className="px-2 py-1 border rounded text-sm"
                    >
                      <option value="facil">Fácil</option>
                      <option value="medio">Médio</option>
                      <option value="dificil">Difícil</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label>Enunciado</Label>
                  <Textarea
                    value={question.statement}
                    onChange={(e) => handleEditQuestion(index, 'statement', e.target.value)}
                    rows={3}
                    className="mt-1"
                  />
                </div>

                {question.type === 'multipla_escolha' && (
                  <div>
                    <Label>Alternativas</Label>
                    <div className="space-y-2 mt-1">
                      {Object.entries(question.options as { [key: string]: string }).map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                          <Label className="w-8 pt-2">{key}:</Label>
                          <Input
                            value={value}
                            onChange={(e) => {
                              const newOptions = { ...question.options as { [key: string]: string } };
                              newOptions[key] = e.target.value;
                              handleEditQuestion(index, 'options', newOptions);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-2">
                      <Label>Resposta Correta</Label>
                      <select
                        value={question.correct_answer}
                        onChange={(e) => handleEditQuestion(index, 'correct_answer', e.target.value)}
                        className="ml-2 px-2 py-1 border rounded"
                      >
                        {Object.keys(question.options as { [key: string]: string }).map(key => (
                          <option key={key} value={key}>{key}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <Button
              onClick={handleSaveQuestions}
              disabled={isProcessing}
              className="w-full mt-6"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Salvar Todas as Questões
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuestionAutoRegistration;