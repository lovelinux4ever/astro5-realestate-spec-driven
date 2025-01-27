import { supabase } from '../lib/server/supabase';

async function testConnection() {
    console.log("--- TEST SUPABASE CONNECTION ---");

    // 1. Check Key
    const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
    console.log(`Key loaded: ${key ? 'YES' : 'NO'}`);
    console.log(`Key prefix: ${key?.substring(0, 10)}...`);

    // 2. Try to Insert logic (Admin privilege)
    // We try to insert a dummy record to see if RLS blocks it.
    // (We won't actually commit it if we can help it, or we delete it after)
    const slug = 'test-connection-' + Date.now();
    const { data, error } = await supabase
        .from('propiedades')
        .insert({
            titulo: 'Test Connection Property',
            estado_comercial: 'En Venta',
            precio: 1000,
            slug: slug,
            publicado: false
        })
        .select()
        .single();

    if (error) {
        console.error("INSERT FAILED (RLS or Other):", error);
    } else {
        console.log("INSERT SUCCESS:", data);
        // Clean up
        await supabase.from('propiedades').delete().eq('id', data.id);
    }
}

testConnection();
