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
      return new Response(JSON.stringify({ 
        error: 'No PDF file provided' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Convert file to text using simple extraction
    const arrayBuffer = await pdfFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Use Latin1 decoder for PDF files
    const decoder = new TextDecoder('latin1');
    const pdfText = decoder.decode(uint8Array);
    
    // Extract text from PDF using simple regex patterns
    let extractedText = '';
    
    // Method 1: Extract strings in parentheses
    const parenthesesMatches = pdfText.match(/\(([^)]+)\)/g);
    if (parenthesesMatches) {
      extractedText = parenthesesMatches
        .map(match => match.slice(1, -1)) // Remove parentheses
        .filter(text => text.length > 2 && /[a-zA-ZÀ-ÿ0-9]/.test(text))
        .join(' ');
    }
    
    // Method 2: If no text found, try BT/ET blocks
    if (!extractedText.trim()) {
      const btMatches = pdfText.match(/BT[\s\S]*?ET/g);
      if (btMatches) {
        btMatches.forEach(block => {
          const strings = block.match(/\(([^)]+)\)/g);
          if (strings) {
            extractedText += strings
              .map(s => s.slice(1, -1))
              .filter(s => s.length > 1)
              .join(' ') + ' ';
          }
        });
      }
    }
    
    // Clean up extracted text
    extractedText = extractedText
      .replace(/\\n/g, ' ')
      .replace(/\\r/g, ' ')
      .replace(/\\t/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (!extractedText || extractedText.length < 10) {
      return new Response(JSON.stringify({ 
        error: 'Could not extract readable text from PDF',
        suggestion: 'This might be an image-based PDF. Try using OCR instead.'
      }), {
        status: 422,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ extractedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Error processing PDF',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});