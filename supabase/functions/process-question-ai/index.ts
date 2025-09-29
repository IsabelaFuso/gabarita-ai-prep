import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

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

    // Validate content quality - reject if mostly binary/garbled
    const readableRatio = (content.match(/[a-zA-ZÀ-ÿ\s]/g) || []).length / content.length;
    console.log(`Content length: ${content.length}, Readable ratio: ${readableRatio}`);
    
    if (readableRatio < 0.3) {
      console.log('Content rejected due to low readability');
      throw new Error('Content appears to be corrupted or contains mostly binary data. Please use OCR for image-based PDFs.');
    }

    // Truncate very long content to avoid token limits
    const maxLength = 15000;
    const processedContent = content.length > maxLength 
      ? content.substring(0, maxLength) + '...'
      : content;

    const systemPrompt = `Você é um especialista em extrair e estruturar questões de vestibular e concursos brasileiros. 

Sua tarefa é analisar o texto fornecido e identificar TODAS as questões presentes, estruturando-as no seguinte formato JSON:

{
  "questions": [
    {
      "statement": "Enunciado completo da questão (incluindo contexto, tabelas, dados, etc.)",
      "type": "multipla_escolha",
      "options": {
        "A": "Alternativa A",
        "B": "Alternativa B", 
        "C": "Alternativa C",
        "D": "Alternativa D",
        "E": "Alternativa E"
      },
      "correct_answer": "A",
      "difficulty": "medio",
      "subject": "Matemática",
      "year": 2023,
      "institution": "UEM"
    }
  ]
}

INSTRUÇÕES DETALHADAS:

1. IDENTIFICAÇÃO DE QUESTÕES:
   - Procure por numeração (1., 2., 01, 02, Questão 1, etc.)
   - Identifique padrões como "Assinale a alternativa correta"
   - Procure por alternativas A, B, C, D, E ou a), b), c), d), e)
   - Identifique questões de somatória (01 + 02 + 04 + 08 + 16)
   - Procure por comandos como "É correto afirmar", "Analise as afirmativas"

2. TIPOS DE QUESTÃO:
   - "multipla_escolha": questões com alternativas A, B, C, D, E
   - "summation": questões de somatória (soma de valores)
   - "discursiva": questões abertas
   - "verdadeiro_falso": questões V ou F

3. EXTRAÇÃO DO CONTEÚDO:
   - Inclua TODO o enunciado, mesmo que seja longo
   - Preserve contextos, tabelas, dados numéricos
   - Mantenha formatação de fórmulas quando possível
   - Para questões de somatória, use formato: {"text": "afirmativa", "value": 1}

4. CLASSIFICAÇÃO:
   - Difficulty: "facil", "medio", "dificil"
   - Subject: identifique a matéria (Matemática, Física, Química, etc.)
   - Extraia o ano e instituição quando visível no texto

5. GABARITO:
   - Se houver gabarito no texto, extraia a resposta correta
   - Caso contrário, deixe como "A" (será editado depois)

IMPORTANTE: 
- Seja MUITO cuidadoso para não perder nenhuma questão
- Mesmo que o texto esteja mal formatado, tente identificar as questões
- Se encontrar apenas 1 questão, retorne 1 questão
- NUNCA retorne array vazio se houver questões no texto
- Se não conseguir identificar questões claramente, retorne pelo menos as que conseguiu identificar

Retorne APENAS o JSON válido, sem texto adicional.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nTexto para análise (${isImage ? 'extraído de imagem' : 'texto direto'}):\n\n"${processedContent}"\n\nPor favor, analise cuidadosamente este texto e extraia TODAS as questões que conseguir identificar. Se o texto contém questões de vestibular, elas devem ser encontradas.`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 4000,
          temperature: 0.1,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    console.log('Gemini API response:', JSON.stringify(data, null, 2));

    if (!aiResponse) {
      console.error('No response from Gemini API - full response:', data);
      throw new Error('No response from Gemini API');
    }

    console.log('Raw AI Response:', aiResponse);
    console.log('AI Response length:', aiResponse.length);

    let parsedResponse;
    try {
      // Clean the response text before parsing
      const cleanedResponse = aiResponse.trim();
      console.log('Cleaned response for parsing:', cleanedResponse);
      
      parsedResponse = JSON.parse(cleanedResponse);
      console.log('Successfully parsed response:', JSON.stringify(parsedResponse, null, 2));
    } catch (parseError) {
      console.error('Error parsing AI response:', aiResponse);
      console.error('Parse error:', parseError);
      
      // Try to extract JSON from the response if it's wrapped in other text
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsedResponse = JSON.parse(jsonMatch[0]);
          console.log('Successfully extracted and parsed JSON from response');
        } catch (secondParseError) {
          console.error('Failed to parse extracted JSON:', secondParseError);
          throw new Error('Invalid JSON response from AI');
        }
      } else {
        console.error('No valid JSON found in AI response');
        throw new Error('No valid JSON found in AI response');
      }
    }

    // Log the final result
    const questionCount = parsedResponse?.questions?.length || 0;
    console.log(`Extracted ${questionCount} questions from the text`);
    
    if (questionCount === 0) {
      console.log('Warning: No questions were extracted. This might indicate:');
      console.log('1. The text does not contain identifiable questions');
      console.log('2. The questions are in an unrecognized format');
      console.log('3. The AI failed to identify the questions');
      console.log('Original content preview:', processedContent.substring(0, 500));
    }

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in process-question-ai function:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro no processamento', 
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});