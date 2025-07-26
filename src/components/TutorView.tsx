import { useEffect, useRef, useState } from 'react';
import { useTutor, TutorMessage } from '@/hooks/useTutor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BrainCircuit, Send, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface TutorViewProps {
  context: Record<string, any>;
}

// Componente para renderizar o player do YouTube
const YouTubeEmbed = ({ videoId, title }: { videoId: string; title: string }) => (
  <div className="aspect-video w-full max-w-md my-2 rounded-lg overflow-hidden">
    <iframe
      width="100%"
      height="100%"
      src={`https://www.youtube.com/embed/${videoId}`}
      title={title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  </div>
);

export const TutorView = ({ context }: TutorViewProps) => {
  const { history, loading, error, sendMessage } = useTutor(context);
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [history]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input, context);
      setInput('');
    }
  };

  const renderMessageContent = (message: TutorMessage) => {
    const text = message.parts.map(part => (part as { text: string }).text).join('');
    
    // Regex para encontrar a nossa tag customizada do YouTube
    const youtubeRegex = /\[YOUTUBE_VIDEO\]\(([^,]+),\s*"([^"]+)"\)/g;
    let lastIndex = 0;
    const parts = [];

    let match;
    while ((match = youtubeRegex.exec(text)) !== null) {
      // Adiciona o texto antes do vídeo
      if (match.index > lastIndex) {
        const textBefore = text.substring(lastIndex, match.index);
        parts.push(<div key={`text-${lastIndex}`} dangerouslySetInnerHTML={{ __html: textBefore.replace(/(\r\n|\n|\r)/g, '<br />') }} />);
      }
      
      const videoId = match[1];
      const title = match[2];
      
      // Adiciona o componente do vídeo
      parts.push(<YouTubeEmbed key={`youtube-${match.index}`} videoId={videoId} title={title} />);
      
      lastIndex = match.index + match[0].length;
    }

    // Adiciona o texto restante após o último vídeo
    if (lastIndex < text.length) {
      const textAfter = text.substring(lastIndex);
      parts.push(<div key={`text-${lastIndex}`} dangerouslySetInnerHTML={{ __html: textAfter.replace(/(\r\n|\n|\r)/g, '<br />') }} />);
    }

    if (parts.length > 0) {
      return <div>{parts}</div>;
    }


    // Renderização padrão para texto (com markdown básico)
    const html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\* (.*?)(?=\n\* |$)/g, '<li>$1</li>')
      .replace(/(\r\n|\n|\r)/g, '<br />');

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="flex flex-col h-[500px] bg-background border rounded-lg">
      <header className="p-4 border-b flex items-center bg-muted/40">
        <BrainCircuit className="w-6 h-6 mr-3 text-primary" />
        <h2 className="text-lg font-semibold">Tutor Gabarita-Prep</h2>
      </header>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {history.length === 0 && !loading && context?.type !== 'quizResults' && (
             <div className="flex items-start gap-3 justify-start">
               <Avatar className="w-8 h-8 border">
                 <AvatarImage src="/placeholder.svg" alt="Tutor" />
                 <AvatarFallback>IA</AvatarFallback>
               </Avatar>
               <div className="p-3 rounded-lg bg-muted max-w-sm md:max-w-md lg:max-w-lg">
                 Olá! Sou seu tutor de IA. Como posso te ajudar hoje?
               </div>
             </div>
          )}
          {history.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'model' && (
                <Avatar className="w-8 h-8 border">
                  <AvatarImage src="/placeholder.svg" alt="Tutor" />
                  <AvatarFallback>IA</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'p-3 rounded-lg max-w-sm md:max-w-md lg:max-w-lg',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                {renderMessageContent(message)}
              </div>
              {message.role === 'user' && (
                <Avatar className="w-8 h-8 border">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback><User /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3 justify-start">
              <Avatar className="w-8 h-8 border">
                <AvatarImage src="/placeholder.svg" alt="Tutor" />
                <AvatarFallback>IA</AvatarFallback>
              </Avatar>
              <div className="p-3 rounded-lg bg-muted">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Digitando...</span>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
          {error && (
             <Alert variant="destructive">
               <AlertTitle>Erro de Conexão</AlertTitle>
               <AlertDescription>{error}</AlertDescription>
             </Alert>
          )}
        </div>
      </ScrollArea>

      <footer className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tire sua dúvida aqui..."
            className="flex-1"
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            <Send className="w-4 h-4" />
            <span className="sr-only">Enviar</span>
          </Button>
        </form>
      </footer>
    </div>
  );
};
