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

    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    // Simple PDF text extraction for Deno
    // This works for basic PDFs with text streams
    const decoder = new TextDecoder('latin1');
    const pdfString = decoder.decode(buffer);
    
    // Extract text content using regex patterns
    let extractedText = '';
    
    // Method 1: Extract text between BT and ET operators
    const textBlocks = pdfString.match(/BT\s*(.*?)\s*ET/gs);
    if (textBlocks) {
      textBlocks.forEach(block => {
        // Remove PDF operators and extract strings
        const strings = block.match(/\(([^)]*)\)/g);
        if (strings) {
          strings.forEach(str => {
            const cleanStr = str.slice(1, -1).replace(/\\[nrt]/g, ' ');
            extractedText += cleanStr + ' ';
          });
        }
      });
    }
    
    // Method 2: Extract parenthesized strings if Method 1 didn't work
    if (!extractedText.trim()) {
      const strings = pdfString.match(/\(([^)]{2,})\)/g);
      if (strings) {
        extractedText = strings
          .map(str => str.slice(1, -1))
          .filter(str => str.length > 2)
          .join(' ');
      }
    }
    
    // Clean up the extracted text
    extractedText = extractedText
      .replace(/\s+/g, ' ')
      .trim();

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
