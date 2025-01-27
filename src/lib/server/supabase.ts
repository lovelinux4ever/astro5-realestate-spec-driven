import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database.types';

// Guarda de seguridad innegociable
if (typeof window !== 'undefined') {
    throw new Error('SECURITY_VIOLATION: Service Role leaked to client');
}

// Estándar Astro 5.0 / Vite para variables de entorno
const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('FATAL: Variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no encontradas en .env');
}

export const supabase = createClient<Database>(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);