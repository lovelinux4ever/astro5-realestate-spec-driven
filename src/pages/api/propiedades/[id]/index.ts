import type { APIRoute } from 'astro';
import { supabase } from '../../../../lib/server/supabase';
import { PropiedadInsertSchema } from '../../../../lib/constants';

export const GET: APIRoute = async ({ params }) => {
    const { id } = params;

    if (!id) {
        return new Response(JSON.stringify({ error: "ID is required" }), { status: 400 });
    }

    const { data, error } = await supabase
        .from('propiedades')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        return new Response(JSON.stringify({ error: "Property not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ property: data }), { status: 200 });
};

export const PUT: APIRoute = async ({ params, request }) => {
    const { id } = params;
    if (!id) return new Response(JSON.stringify({ error: "ID is required" }), { status: 400 });

    try {
        const body = await request.json();

        const validation = PropiedadInsertSchema.safeParse(body);

        if (!validation.success) {
            return new Response(JSON.stringify({
                error: "Validation Failed",
                details: validation.error.format()
            }), { status: 400 });
        }

        const { data: updateData } = validation;

        const { data, error } = await supabase
            .from('propiedades')
            .update({
                ...updateData,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error("Supabase Update Error:", error);
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true, property: data }), { status: 200 });

    } catch (e) {
        return new Response(JSON.stringify({ error: "Server Error" }), { status: 500 });
    }
};

export const DELETE: APIRoute = async ({ params }) => {
    const { id } = params;
    if (!id) return new Response(JSON.stringify({ error: "ID is required" }), { status: 400 });

    const { error } = await supabase
        .from('propiedades')
        .delete()
        .eq('id', id);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
};
