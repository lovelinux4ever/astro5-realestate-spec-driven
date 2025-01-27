import { z } from 'astro/zod';
import { PropiedadInsertSchema } from '../lib/constants';

// 🛡️ GUARDIANES DEL CONTRATO

// Input Schema: Filter for User Input fields ONLY.
// We leverage the PropiedadInsertSchema from constants but omit system fields that might be generic there,
// although PropiedadInsertSchema was designed to match ODS input.
// We explicitly refine it here if needed, or re-export it as the Input Contract.
// ODS says: id, slug, created_at, owner_id are SYSTEM generated.
// PropiedadInsertSchema in constants already omits id, slug, owner_id, created_at.
// So we can reuse it, but let's wrap it to be explicit about the "Guard" role.

// GeoJSON Point Schema (RFC 7946)
export const GeoJSONPointSchema = z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([
        z.number().min(-180).max(180), // Longitude
        z.number().min(-90).max(90)    // Latitude
    ])
});

export const InmuebleInputSchema = PropiedadInsertSchema.extend({
    // Enhance basic input with strict GeoJSON validation if provided
    ubicacion_gps: GeoJSONPointSchema.optional().or(z.unknown()) // Allow unknown for now if DB raw handling is different, but aim for strict
});

export type InmuebleInput = z.infer<typeof InmuebleInputSchema>;

// Auto-DTO: Transform DB Row to Safe Frontend Object
// Removes sensitive fields like owner_id before sending to client.
export const InmuebleDTOSchema = z.object({
    id: z.string().uuid(),
    titulo: z.string(),
    slug: z.string(),
    descripcion: z.string().nullable(),
    precio: z.number(),
    moneda: z.string().nullable(),
    precio_oculto: z.boolean().default(false),
    publicado: z.boolean(),
    tipo_operacion: z.string(),
    estado_propiedad: z.string(),
    tipo_propiedad: z.string().nullable(), // New category field
    barrio: z.string().nullable(),
    caracteristicas: z.record(z.unknown()), // Generic for frontend display, or use specific type
    fotos_nombres: z.array(z.string()).nullable(),
    video_360_url: z.string().nullable(),
    destacado: z.boolean().default(false),
    codigo: z.string().nullable(),
    // EXCLUDED: owner_id, created_at, updated_at (unless needed for display), ubicacion_gps (privacy?)
}).transform((data) => ({
    ...data,
    // Add any computed frontend fields here if needed
}));

export type InmuebleDTO = z.infer<typeof InmuebleDTOSchema>;
