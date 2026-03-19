import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database.types';

// Guarda de seguridad innegociable: Solo se ejecuta en el servidor
if (typeof window !== 'undefined') {
    throw new Error('SECURITY_VIOLATION: Service Role leaked to client');
}

// Usamos process.env para asegurar compatibilidad total con el entorno de Vercel
const SUPABASE_URL = process.env.SUPABASE_URL || import.meta.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(`FATAL: Variables de entorno no encontradas. URL presente: ${!!SUPABASE_URL}`);
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