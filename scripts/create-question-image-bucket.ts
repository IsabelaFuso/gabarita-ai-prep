
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase URL or Service Role Key is missing in .env file");
}

// Note: This script uses the service_role key and should only be run in a secure server-side environment.
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const BUCKET_NAME = 'question-images';

async function setupStorage() {
  try {
    // Check if the bucket already exists
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    if (listError) throw listError;

    const bucketExists = buckets.some(bucket => bucket.name === BUCKET_NAME);

    if (bucketExists) {
      console.log(`Bucket "${BUCKET_NAME}" already exists. Skipping creation.`);
    } else {
      // Create the bucket if it doesn't exist
      const { error: createError } = await supabaseAdmin.storage.createBucket(BUCKET_NAME, {
        public: true, // Make files publicly accessible via URL
      });
      if (createError) throw createError;
      console.log(`Bucket "${BUCKET_NAME}" created successfully.`);
    }

    // Define the access policy
    const policyName = `Public read access for ${BUCKET_NAME}`;
    
    // Supabase automatically creates a default policy for public buckets, 
    // but we can define our own if more specific rules are needed.
    // For this use case, making the bucket public on creation is sufficient.
    // If we needed to add or update policies, the code would look like this:
    /*
    const { data: policies, error: getPoliciesError } = await supabaseAdmin.storage
      .getBucket(BUCKET_NAME);

    // Logic to check if policy exists and update/create it
    
    console.log('Storage policies configured.');
    */
   console.log(`Bucket "${BUCKET_NAME}" is configured for public access.`);


  } catch (error: any) {
    console.error('Error setting up storage bucket:', error.message);
  }
}

setupStorage();
