// scripts/create-storage-bucket.ts
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CONFIGURATION ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Supabase URL or Service Role Key is not defined in your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const BUCKET_NAME = 'uel-question-images';

// --- MAIN EXECUTION ---
async function createBucket() {
  console.log(`Checking for bucket: "${BUCKET_NAME}"...`);

  // Check if the bucket already exists
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error('Error listing buckets:', listError.message);
    return;
  }

  const bucketExists = buckets.some((bucket) => bucket.name === BUCKET_NAME);

  if (bucketExists) {
    console.log(`Bucket "${BUCKET_NAME}" already exists. Skipping creation.`);
    // Optionally, update the bucket to ensure it's public
    console.log('Ensuring bucket is public...');
    const { error: updateError } = await supabase.storage.updateBucket(
      BUCKET_NAME,
      {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
        fileSizeLimit: '5MB',
      }
    );
    if (updateError) {
      console.error(`Error updating bucket "${BUCKET_NAME}":`, updateError.message);
    } else {
      console.log(`Bucket "${BUCKET_NAME}" is now configured to be public.`);
    }
    return;
  }

  // If the bucket does not exist, create it
  console.log(`Bucket "${BUCKET_NAME}" not found. Creating...`);
  const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, {
    public: true, // Make files publicly accessible via URL
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    fileSizeLimit: '5MB', // Set a 5MB file size limit
  });

  if (error) {
    console.error(`Error creating bucket "${BUCKET_NAME}":`, error.message);
    console.error('Please check your Supabase project permissions. The service_role key should have permission to create buckets.');
  } else {
    console.log(`Successfully created bucket: "${data.name}"!`);
    console.log('The bucket is configured for public access.');
  }
}

createBucket();
