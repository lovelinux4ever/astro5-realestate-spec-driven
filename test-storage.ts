import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tgdupajzsaoznnraqouj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnZHVwYWp6c2Fvem5ucmFxb3VqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTQ1MjQ0MywiZXhwIjoyMDg1MDI4NDQzfQ.IvtO5V5tMB9vJWHIksF4JwjtbcJ-jMpZlnqs0KDmeWQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testStorage() {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
        console.error('Error listing buckets:', error);
        return;
    }
    console.log('Available buckets:', data.map(b => b.name));
    console.log('Bucket details:', data);
}

testStorage();
