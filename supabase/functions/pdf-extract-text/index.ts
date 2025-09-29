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
      return new Response(JSON.stringify({ 
        error: 'No PDF file provided' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Processing PDF: ${pdfFile.name}, Size: ${pdfFile.size} bytes`);

    // Convert file to ArrayBuffer
    const arrayBuffer = await pdfFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Use Latin1 decoder for PDF files (better for PDFs)
    const decoder = new TextDecoder('latin1', { fatal: false });
    const pdfText = decoder.decode(uint8Array);
    
    // Extract text using multiple methods
    let extractedText = '';
    const textChunks: string[] = [];
    
    // Method 1: Extract text from parentheses (most common in PDFs)
    const parenthesesPattern = /\(([^)]*)\)\s*(Tj|TJ)/g;
    let match;
    while ((match = parenthesesPattern.exec(pdfText)) !== null) {
      const text = match[1];
      if (text && text.length > 1 && /[a-zA-ZÀ-ÿ0-9]/.test(text)) {
        textChunks.push(text);
      }
    }
    
    // Method 2: Extract text from square brackets
    const bracketPattern = /\[([^\]]*)\]\s*(TJ|Tj)/g;
    while ((match = bracketPattern.exec(pdfText)) !== null) {
      const text = match[1];
      if (text && text.length > 1 && /[a-zA-ZÀ-ÿ0-9]/.test(text)) {
        textChunks.push(text);
      }
    }
    
    // Method 3: Extract from BT/ET blocks
    const btPattern = /BT([\s\S]*?)ET/g;
    while ((match = btPattern.exec(pdfText)) !== null) {
      const block = match[1];
      const textMatches = block.match(/\(([^)]+)\)/g);
      if (textMatches) {
        textMatches.forEach(textMatch => {
          const text = textMatch.slice(1, -1);
          if (text && text.length > 1 && /[a-zA-ZÀ-ÿ0-9]/.test(text)) {
            textChunks.push(text);
          }
        });
      }
    }
    
    // Method 4: General readable text extraction
    const readablePattern = /[a-zA-ZÀ-ÿ\s\d.,!?;:()"\'-]{8,}/g;
    const readableMatches = pdfText.match(readablePattern);
    if (readableMatches) {
      readableMatches.forEach(text => {
        const cleanText = text.trim();
        const letterRatio = (cleanText.match(/[a-zA-ZÀ-ÿ]/g) || []).length / cleanText.length;
        if (cleanText.length > 5 && letterRatio > 0.3) {
          textChunks.push(cleanText);
        }
      });
    }
    
    // Combine and clean extracted text
    if (textChunks.length > 0) {
      extractedText = textChunks
        .map(chunk => chunk
          .replace(/\\n/g, ' ')
          .replace(/\\r/g, ' ')
          .replace(/\\t/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
        )
        .filter(chunk => chunk.length > 2)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    
    console.log(`Extracted ${textChunks.length} text chunks`);
    console.log(`Final text length: ${extractedText.length}`);
    console.log(`Preview: ${extractedText.substring(0, 200)}...`);
    
    // Validate extracted text quality
    if (!extractedText || extractedText.length < 20) {
      console.log('Insufficient readable text extracted');
      return new Response(JSON.stringify({ 
        error: 'Could not extract sufficient readable text from PDF',
        suggestion: 'This might be an image-based PDF or encrypted. Try using OCR tools or convert to a text-based PDF.',
        details: `Only ${extractedText.length} characters of readable text found`
      }), {
        status: 422,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Check if text is mostly readable
    const readableRatio = (extractedText.match(/[a-zA-ZÀ-ÿ\s]/g) || []).length / extractedText.length;
    if (readableRatio < 0.5) {
      console.log(`Low readability ratio: ${readableRatio}`);
      return new Response(JSON.stringify({ 
        error: 'Extracted text contains too many non-readable characters',
        suggestion: 'This might be an image-based PDF. Try using OCR tools.',
        details: `Readability ratio: ${readableRatio.toFixed(2)}`
      }), {
        status: 422,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ extractedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('PDF extraction error:', error);
    return new Response(JSON.stringify({ 
      error: 'Error processing PDF',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});