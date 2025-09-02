import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { extract } from 'npm:pdf-parse/lib/pdf.js';

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

    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    // Use a robust PDF parsing library
    const pdfData = await extract(buffer);
    const extractedText = pdfData.text;

    if (!extractedText || extractedText.trim().length === 0) {
      // This case might happen with image-only PDFs or if parsing fails silently
      throw new Error("Could not extract any text from the PDF. It might be an image-based PDF or corrupted.");
    }

    return new Response(JSON.stringify({ extractedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in PDF extraction function:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro na extração de texto do PDF', 
      details: error.message,
      suggestion: 'Se o PDF contiver apenas imagens, tente usar a opção de OCR. Se o erro persistir, o arquivo pode estar corrompido.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
