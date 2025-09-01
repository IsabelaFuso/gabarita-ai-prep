import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, isImage, processType } = await req.json();

    if (!content) {
      throw new Error('Content is required');
    }

    const systemPrompt = `Você é um assistente especializado em extrair e estruturar questões de vestibular e concursos. 

Sua tarefa é analisar o texto fornecido e identificar questões, estruturando-as no seguinte formato JSON:

{
  "questions": [
    {
      "statement": "Enunciado completo da questão",
      "type": "multipla_escolha" | "summation" | "discursiva" | "verdadeiro_falso",
      "options": {
        "A": "Alternativa A",
        "B": "Alternativa B", 
        "C": "Alternativa C",
        "D": "Alternativa D",
        "E": "Alternativa E"
      },
      "correct_answer": "A",
      "difficulty": "facil" | "medio" | "dificil",
      "subject": "Matéria identificada",
      "year": 2023,
      "institution": "Nome da instituição se identificada"
    }
  ]
}

REGRAS:
1. Para questões de múltipla escolha, use o formato "options" com chaves A, B, C, D, E
2. Para questões de somatória, use o formato de array: [{"text": "afirmativa", "value": 1}, ...]
3. Identifique o tipo correto da questão baseado no padrão do texto
4. Extraia a resposta correta quando disponível
5. Estime a dificuldade baseada na complexidade da questão
6. Identifique a matéria/disciplina quando possível
7. Mantenha o enunciado completo e bem formatado
8. Se houver gabarito ou resposta, identifique corretamente

Retorne APENAS o JSON válido, sem texto adicional.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analise o seguinte ${isImage ? 'texto extraído de imagem' : 'texto'} e extraia as questões:\n\n${content}` }
        ],
        max_tokens: 4000,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Error parsing AI response:', aiResponse);
      throw new Error('Invalid JSON response from AI');
    }

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in process-question-ai function:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro no processamento', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});