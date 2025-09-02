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
    
    // Try multiple approaches to extract text from PDF
    let extractedText = '';
    
    try {
      // Method 1: Use UTF-8 decoder first
      const decoder = new TextDecoder('utf-8', { fatal: false });
      let pdfString = decoder.decode(buffer);
      
      // If too much binary data, try latin1
      const binaryRatio = (pdfString.match(/[\x00-\x08\x0E-\x1F\x7F]/g) || []).length / pdfString.length;
      if (binaryRatio > 0.3) {
        const latin1Decoder = new TextDecoder('latin1');
        pdfString = latin1Decoder.decode(buffer);
      }
      
      // Extract text using multiple patterns
      const textPatterns = [
        // Standard text objects between BT and ET
        /BT\s*.*?Tj\s*.*?ET/gs,
        // Direct text strings in parentheses
        /\(([^)]{3,})\)/g,
        // Text with positioning commands
        /\[(.*?)\]\s*TJ/g,
        // Show text operators
        /Tj\s*\(([^)]+)\)/g
      ];
      
      for (const pattern of textPatterns) {
        const matches = pdfString.match(pattern);
        if (matches) {
          matches.forEach(match => {
            // Clean and extract readable text
            let cleanText = match
              .replace(/BT|ET|Tj|TJ|\[|\]/g, '')
              .replace(/\/\w+\s+\d+\s+Tf/g, '')
              .replace(/\d+\s+\d+\s+Td/g, ' ')
              .replace(/\d+\s+TL/g, ' ')
              .replace(/[()]/g, '')
              .replace(/\\[nrt]/g, ' ')
              .trim();
            
            // Only add if it looks like readable text
            if (cleanText.length > 2 && /[a-zA-ZÀ-ÿ]/.test(cleanText)) {
              extractedText += cleanText + ' ';
            }
          });
        }
      }
      
      // Final cleanup
      extractedText = extractedText
        .replace(/\s+/g, ' ')
        .replace(/[^\w\sÀ-ÿ.,;:!?()\-]/g, ' ')
        .trim();
      
    } catch (error) {
      console.error('Error in text extraction:', error);
      extractedText = '';
    }

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
