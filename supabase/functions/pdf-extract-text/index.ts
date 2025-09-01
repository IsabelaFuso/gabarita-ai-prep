import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const pdfFile = formData.get('pdf') as File;

    if (!pdfFile) {
      throw new Error('No PDF file provided');
    }

    // Para simplificar, vamos usar uma abordagem básica de extração de texto
    // Em produção, seria recomendado usar bibliotecas como pdf-parse ou similares
    const arrayBuffer = await pdfFile.arrayBuffer();
    
    // Como estamos no Deno e não temos acesso a bibliotecas de PDF robustas,
    // vamos fazer uma implementação básica que funciona para PDFs simples
    const uint8Array = new Uint8Array(arrayBuffer);
    const decoder = new TextDecoder('utf-8');
    let text = decoder.decode(uint8Array);

    // Extração básica de texto de PDF (muito simplificada)
    // Esta é uma implementação básica que pode não funcionar para todos os PDFs
    const textContent = text.match(/BT\s*(.*?)\s*ET/g)?.map(match => {
      return match.replace(/BT\s*|\s*ET/g, '')
        .replace(/\/\w+\s+\d+\s+Tf\s*/g, '')
        .replace(/\d+\s+\d+\s+Td\s*/g, ' ')
        .replace(/Tj\s*/g, '')
        .replace(/[\(\)]/g, '')
        .trim();
    }).join(' ') || '';

    // Se não conseguir extrair texto com a abordagem acima,
    // tenta uma abordagem mais simples
    let extractedText = textContent;
    if (!extractedText || extractedText.length < 10) {
      // Busca por strings que parecem com texto legível
      const matches = text.match(/\(([^)]+)\)/g);
      if (matches) {
        extractedText = matches.map(match => match.slice(1, -1)).join(' ');
      } else {
        extractedText = "Não foi possível extrair texto deste PDF. Tente converter para imagem ou texto primeiro.";
      }
    }

    return new Response(JSON.stringify({ extractedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in PDF extraction function:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro na extração de texto do PDF', 
      details: error.message,
      suggestion: 'Tente converter o PDF para imagem ou texto antes de enviar.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});