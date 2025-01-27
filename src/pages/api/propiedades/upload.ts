import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/server/supabase';

export const POST: APIRoute = async ({ request }) => {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const propertyId = formData.get('propertyId') as string;

        if (!file) {
            return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
        }

        // Generate a unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const folder = propertyId || 'general';
        const filePath = `${folder}/${fileName}`;

        // Upload to Supabase Storage
        // NOTE: You must have a bucket named 'fotos-videos-inmo' in Supabase Storage
        const { data, error } = await supabase.storage
            .from('fotos-videos-inmo')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Supabase Storage Error:', JSON.stringify(error, null, 2));
            return new Response(JSON.stringify({
                error: error.message,
                details: error
            }), { status: 500 });
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('fotos-videos-inmo')
            .getPublicUrl(filePath);

        return new Response(JSON.stringify({
            success: true,
            fileName: fileName,
            publicUrl: publicUrl,
            filePath: filePath
        }), { status: 200 });

    } catch (e) {
        console.error('Server Error:', e);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
};
