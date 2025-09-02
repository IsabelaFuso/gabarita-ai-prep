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
    console.log('PDF extraction function started');
    
    const formData = await req.formData();
    const pdfFile = formData.get('pdf') as File;

    if (!pdfFile) {
      console.error('No PDF file provided');
      throw new Error('No PDF file provided');
    }

    console.log('PDF file size:', pdfFile.size);

    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    console.log('Buffer created, size:', buffer.length);
    
    // Simple but effective text extraction
    let extractedText = '';
    
    try {
      // Use Latin1 decoder which works well with PDF files
      const decoder = new TextDecoder('latin1');
      const pdfString = decoder.decode(buffer);
      
      console.log('PDF decoded, length:', pdfString.length);
      
      // Extract text in parentheses (most common PDF text format)
      const textMatches = pdfString.match(/\(([^)]{2,})\)/g);
      
      if (textMatches && textMatches.length > 0) {
        console.log('Found text matches:', textMatches.length);
        
        const textParts = textMatches
          .map(match => match.slice(1, -1)) // Remove parentheses
          .filter(text => {
            // Filter for readable text
            return text.length > 1 && 
                   /[a-zA-ZÀ-ÿ0-9]/.test(text) && 
                   !/^[\x00-\x1F\x7F-\x9F]+$/.test(text); // Exclude control characters
          })
          .map(text => text.replace(/\\[nrt]/g, ' ')); // Clean escape sequences
        
        extractedText = textParts.join(' ');
        console.log('Extracted text parts:', textParts.length);
      }
      
      // If no text found with parentheses method, try BT/ET blocks
      if (!extractedText.trim()) {
        console.log('Trying BT/ET extraction');
        const btBlocks = pdfString.match(/BT\s.*?ET/gs);
        if (btBlocks) {
          btBlocks.forEach(block => {
            const strings = block.match(/\(([^)]+)\)/g);
            if (strings) {
              strings.forEach(str => {
                const clean = str.slice(1, -1);
                if (clean.length > 1 && /[a-zA-ZÀ-ÿ]/.test(clean)) {
                  extractedText += clean + ' ';
                }
              });
            }
          });
        }
      }
      
      // Clean up the final text
      extractedText = extractedText
        .replace(/\s+/g, ' ')
        .trim();
        
      console.log('Final extracted text length:', extractedText.length);
      
    } catch (error) {
      console.error('Error in text extraction logic:', error);
      extractedText = '';
    }

    if (!extractedText || extractedText.trim().length < 10) {
      console.warn('No meaningful text extracted');
      throw new Error("Could not extract readable text from the PDF. This might be an image-based PDF that requires OCR processing.");
    }

    console.log('PDF extraction successful');
    
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