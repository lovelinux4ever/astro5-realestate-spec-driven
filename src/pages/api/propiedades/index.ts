import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/server/supabase';
import { PropiedadInsertSchema } from '../../../lib/constants';
import slugify from 'slugify';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();

        // 1. Validar datos con Zod
        const validation = PropiedadInsertSchema.safeParse(body);

        if (!validation.success) {
            return new Response(JSON.stringify({
                error: "Validation Failed",
                details: validation.error.format()
            }), { status: 400 });
        }

        const { data } = validation;

        // 2. Generar Slug Único para SEO (Titulo + Barrio + Sufijo Corto)
        const baseSlug = slugify(data.titulo, { lower: true, strict: true });
        const barrioSlug = data.barrio ? slugify(data.barrio, { lower: true, strict: true }) : '';
        const shortSuffix = Math.random().toString(36).substring(2, 5); // 3 caracteres son suficientes

        const slug = `${baseSlug}${barrioSlug ? '-' + barrioSlug : ''}-${shortSuffix}`;

        // 3. Generar Código Humano (3 números + 2 letras)
        const generateHumanCode = () => {
            const numbers = Math.floor(100 + Math.random() * 900).toString(); // 3 nros
            const letters = Math.random().toString(36).substring(2, 4).toUpperCase().replace(/[0-9]/g, 'X');
            // Better letter generation:
            const possible = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // exclude confusing ones like I, O
            let randomLetters = "";
            for (let i = 0; i < 2; i++) randomLetters += possible.charAt(Math.floor(Math.random() * possible.length));
            return `${numbers}${randomLetters}`;
        };

        const codigo = generateHumanCode();

        // 4. Insertar en Supabase usando el cliente oficial (service role configurado en supabase.ts)
        const { data: inserted, error } = await supabase
            .from('propiedades')
            .insert({
                ...data,
                slug: slug,
                codigo: codigo,
                // owner_id (opcional): si tuviéramos auth context aquí, lo usaríamos.
            })
            .select()
            .single();

        if (error) {
            console.error("Supabase Error:", error);
            // Manejar errores de unicidad u otros
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true, property: inserted }), { status: 201 });

    } catch (e) {
        console.error("Server Error:", e);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
};
