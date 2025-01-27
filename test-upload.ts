import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tgdupajzsaoznnraqouj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnZHVwYWp6c2Fvem5ucmFxb3VqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTQ1MjQ0MywiZXhwIjoyMDg1MDI4NDQzfQ.IvtO5V5tMB9vJWHIksF4JwjtbcJ-jMpZlnqs0KDmeWQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testUpload() {
    const bucketName = 'fotos&videosINMO';
    const fileName = 'test.txt';
    const fileContent = 'Hello Supabase';

    console.log(`Attempting to upload to bucket: ${bucketName}`);

    const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, fileContent, {
            contentType: 'text/plain',
            upsert: true
        });

    if (error) {
        console.error('Upload Error:', JSON.stringify(error, null, 2));
    } else {
        console.log('Upload Success:', data);
    }
}

testUpload();
