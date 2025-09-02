import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, Download, Trash2, Eye, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface PDFFile {
  id: string;
  file_name: string;
  file_path: string;
  upload_date: string;
  file_size: number;
  description?: string;
  institution_name?: string;
  exam_year?: number;
  processed: boolean;
  questions_extracted: number;
}

const PDFFileBank = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  // Upload form state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [examYear, setExamYear] = useState<number | ''>('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('pdf_question_sources')
        .select('*')
        .order('upload_date', { ascending: false });

      if (error) {
        console.error('Error fetching PDF files:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar arquivos PDF.',
          variant: 'destructive',
        });
        return;
      }

      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      toast({
        title: 'Erro',
        description: 'Selecione um arquivo PDF.',
        variant: 'destructive',
      });
      return;
    }

    if (uploadFile.type !== 'application/pdf') {
      toast({
        title: 'Erro',
        description: 'Apenas arquivos PDF são permitidos.',
        variant: 'destructive',
      });
      return;
    }

    // Validar tamanho (máximo 50MB)
    if (uploadFile.size > 50 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 50MB.",
        variant: "destructive"
      });
      setUploading(false);
      return;
    }

    // Validar tamanho (máximo 50MB)
    if (uploadFile.size > 50 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 50MB.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      const fileName = `${Date.now()}_${uploadFile.name}`;
      const filePath = `pdfs/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('question-pdfs')
        .upload(filePath, uploadFile);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        toast({
          title: 'Erro',
          description: 'Erro ao fazer upload do arquivo.',
          variant: 'destructive',
        });
        return;
      }

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('pdf_question_sources')
        .insert({
          file_name: uploadFile.name,
          file_path: filePath,
          file_size: uploadFile.size,
          description: description || null,
          institution_name: institutionName || null,
          exam_year: examYear || null,
        });

      if (dbError) {
        console.error('Database error:', dbError);
        // Try to clean up uploaded file
        await supabase.storage.from('question-pdfs').remove([filePath]);
        toast({
          title: 'Erro',
          description: 'Erro ao salvar metadados do arquivo.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Sucesso',
        description: 'Arquivo PDF enviado com sucesso.',
      });

      // Reset form and refresh list
      setUploadFile(null);
      setDescription('');
      setInstitutionName('');
      setExamYear('');
      setUploadDialogOpen(false);
      fetchFiles();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Erro',
        description: 'Erro inesperado durante o upload.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (file: PDFFile) => {
    try {
      const { data, error } = await supabase.storage
        .from('question-pdfs')
        .download(file.file_path);

      if (error) {
        console.error('Download error:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao baixar o arquivo.',
          variant: 'destructive',
        });
        return;
      }

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleDelete = async (file: PDFFile) => {
    if (!confirm(`Tem certeza que deseja excluir o arquivo "${file.file_name}"?`)) {
      return;
    }

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('question-pdfs')
        .remove([file.file_path]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('pdf_question_sources')
        .delete()
        .eq('id', file.id);

      if (dbError) {
        console.error('Database delete error:', dbError);
        toast({
          title: 'Erro',
          description: 'Erro ao excluir arquivo do banco de dados.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Sucesso',
        description: 'Arquivo excluído com sucesso.',
      });

      fetchFiles();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando banco de arquivos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Banco de Arquivos PDF</h2>
          <p className="text-muted-foreground">
            Gerencie arquivos PDF para extração automática de questões
          </p>
        </div>
        
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo PDF
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload de PDF</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="pdf-file">Arquivo PDF</Label>
                <Input
                  id="pdf-file"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descrição do arquivo..."
                />
              </div>
              <div>
                <Label htmlFor="institution">Instituição</Label>
                <Input
                  id="institution"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="Ex: FUVEST, ENEM..."
                />
              </div>
              <div>
                <Label htmlFor="year">Ano do Exame</Label>
                <Input
                  id="year"
                  type="number"
                  value={examYear}
                  onChange={(e) => setExamYear(e.target.value ? parseInt(e.target.value) : '')}
                  placeholder="Ex: 2024"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpload} disabled={uploading} className="flex-1">
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Enviar
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {files.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum arquivo encontrado</h3>
            <p className="text-muted-foreground text-center mb-4">
              Faça upload de arquivos PDF para começar a extrair questões automaticamente
            </p>
            <Button onClick={() => setUploadDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar PDF
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {files.map((file) => (
            <Card key={file.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">{file.file_name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{formatFileSize(file.file_size)}</span>
                        <span>•</span>
                        <span>{formatDate(file.upload_date)}</span>
                        {file.institution_name && (
                          <>
                            <span>•</span>
                            <span>{file.institution_name}</span>
                          </>
                        )}
                        {file.exam_year && (
                          <>
                            <span>•</span>
                            <span>{file.exam_year}</span>
                          </>
                        )}
                      </div>
                      {file.description && (
                        <p className="text-sm text-muted-foreground mt-1">{file.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2 mr-4">
                      <Badge variant={file.processed ? "default" : "secondary"}>
                        {file.processed ? "Processado" : "Não processado"}
                      </Badge>
                      {file.questions_extracted > 0 && (
                        <Badge variant="outline">
                          {file.questions_extracted} questões
                        </Badge>
                      )}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDownload(file)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(file)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PDFFileBank;