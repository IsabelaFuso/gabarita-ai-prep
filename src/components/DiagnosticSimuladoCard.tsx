import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Users, Gift, CheckCircle, ArrowRight, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { SimuladoType } from "@/hooks/useQuestionManager";

interface DiagnosticSimuladoCardProps {
  onStartSimulado: (type: SimuladoType) => void;
  hasCompletedDiagnostic?: boolean;
}

export const DiagnosticSimuladoCard = ({ onStartSimulado, hasCompletedDiagnostic = false }: DiagnosticSimuladoCardProps) => {
  const { user } = useAuth();
  const [isStarting, setIsStarting] = useState(false);

  const handleStartDiagnostic = async () => {
    if (!user) return;
    
    setIsStarting(true);
    try {
      onStartSimulado('diagnóstico');
    } finally {
      setIsStarting(false);
    }
  };

  if (hasCompletedDiagnostic) {
    return (
      <Card className="shadow-soft border-success/20 bg-success/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-success" />
              <CardTitle className="text-lg">Diagnóstico Completo</CardTitle>
            </div>
            <Badge variant="outline" className="bg-success/20 text-success">
              Concluído
            </Badge>
          </div>
          <CardDescription>
            Parabéns! Você já completou seu simulado diagnóstico inicial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Seus dados diagnósticos estão sendo usados para personalizar sua experiência de estudo.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-xl"></div>
      </div>
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Simulado Diagnóstico</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <Gift className="w-3 h-3 mr-1" />
                  GRATUITO
                </Badge>
                <Badge variant="outline">Primeiro uso</Badge>
              </div>
            </div>
          </div>
        </div>
        <CardDescription className="mt-3 text-base">
          Um simulado especial para a IA entender seu nível atual e personalizar seu plano de estudos
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 relative">
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-primary" />
            <span>15 questões selecionadas</span>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            <span>Análise IA personalizada</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-primary" />
            <span>Identifica pontos fortes/fracos</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span>Plano de estudos adaptativo</span>
          </div>
        </div>

        {/* Benefits */}
        <div className="p-4 bg-accent/20 rounded-lg border border-accent/30">
          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
            <Gift className="w-4 h-4 text-primary" />
            O que você ganha:
          </h4>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>• Análise completa do seu desempenho atual</li>
            <li>• Recomendações personalizadas de estudo</li>
            <li>• Identificação de matérias prioritárias</li>
            <li>• Gráficos detalhados de performance</li>
          </ul>
        </div>

        {/* Call to Action */}
        <div className="space-y-3">
          {!user ? (
            <div className="text-center p-4 border border-warning/30 bg-warning/10 rounded-lg">
              <p className="text-sm font-medium mb-2">Faça login para continuar</p>
              <p className="text-xs text-muted-foreground">
                O simulado diagnóstico é gratuito, mas você precisa estar logado para salvar seus resultados
              </p>
            </div>
          ) : (
            <Button 
              className="w-full h-12 text-base font-medium"
              size="lg" 
              onClick={handleStartDiagnostic}
              disabled={isStarting}
            >
              {isStarting ? (
                <>Iniciando Diagnóstico...</>
              ) : (
                <>
                  Começar Diagnóstico Gratuito
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};