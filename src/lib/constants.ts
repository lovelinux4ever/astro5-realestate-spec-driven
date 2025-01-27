import { z } from 'astro/zod';

export const BARRIOS = [
    'Alfar',
    'Arenas del Sur',
    'Barrio Sarmiento',
    'Bernardino Rivadavia',
    'Caisamar',
    'Carilo',
    'Casonas Del Haras',
    'Centro',
    'Champagnat',
    'Chauvin',
    'Colinas de Peralta Ramos',
    'Constitución',
    'Costa del Sol. Mar Chiquita',
    'Divino Rostro',
    'El Grosellar',
    'Felix U Camet',
    'General Roca',
    'Guemes',
    'La Armonía',
    'La Caleta',
    'La perla',
    'Las Avenidas',
    'Lopez de Gomara',
    'Los Andes',
    'Los Pinares',
    'Los Troncos',
    'Macrocentro',
    'Mundialista',
    'Parque Luro',
    'Pinos de Anchorena',
    'Playa Grande',
    'Plaza Colon',
    'Plaza Mitre',
    'Pompeya',
    'Puerto',
    'Punta Mogotes',
    'Rumenco',
    'Rumenco joven',
    'San Carlos',
    'San Geronimo',
    'San Jose',
    'San Juan',
    'Santa Monica',
    'shoping aldrey',
    'Sierra de Los Padres',
    'Stella Maris',
    'Varesse',
    'Villa Primera',
    'Zacagnini'
] as const;

export const ESTADOS_PROPIEDAD = [
    'En Venta',
    'En Alquiler',
    'Vendido',
    'Alquilado',
    'Reservado'
] as const;

export const TIPOS_OPERACION = [
    'Venta',
    'Alquiler',
    'Venta en Pozo'
] as const;

export const TIPOS_PROPIEDAD = [
    'Casas / Chalets',
    'Departamentos',
    'Edificios a Estrenar',
    'Locales y Oficinas',
    'Lotes / Campos',
    'PH / Duplex'
] as const;

export const AMENITIES_LIST = [
    'Aire Acondicionado',
    'Cochera',
    'Gimnasio',
    'Lavadero',
    'Parrilla',
    'Patio',
    'Pileta',
    'Quincho',
    'Sala de juegos',
    'Spa',
    'SUM'
] as const;

// Schema defining the strict structure of PropertyFeatures
export const PropertyFeaturesSchema = z.object({
    ambientes: z.number().int().positive().optional(),
    dormitorios: z.number().int().nonnegative().optional(),
    banios: z.number().int().nonnegative().optional(),
    cocheras: z.number().int().nonnegative().optional(),
    superficie_total: z.number().positive().optional(),
    superficie_cubierta: z.number().positive().optional(),
    amenities: z.array(z.string()).optional(),
    antiguedad: z.number().int().nonnegative().optional(),
    disposicion: z.enum(['Frente', 'Contrafrente', 'Lateral', 'Interno']).optional(),
    // Individual Tags
    aire_acondicionado: z.boolean().optional(),
    cochera: z.boolean().optional(),
    gimnasio: z.boolean().optional(),
    lavadero: z.boolean().optional(),
    parrilla: z.boolean().optional(),
    patio: z.boolean().optional(),
    pileta: z.boolean().optional(),
    quincho: z.boolean().optional(),
    sala_de_juegos: z.boolean().optional(),
    spa: z.boolean().optional(),
    sum: z.boolean().optional(),
}).strict();

export type PropertyFeatures = z.infer<typeof PropertyFeaturesSchema>;

// Schema defining the strict structure of SEOMeta
export const SEOMetaSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    canonical_url: z.string().url().optional(),
    og_image: z.string().url().optional(),
}).strict();

export type SEOMeta = z.infer<typeof SEOMetaSchema>;

// FULL PROP SCHEMA
export const PropiedadInsertSchema = z.object({
    publicado: z.boolean().default(false),
    tipo_operacion: z.enum(TIPOS_OPERACION).default('Venta'), // New Field
    estado_propiedad: z.enum(ESTADOS_PROPIEDAD).default('En Venta'), // New Field
    tipo_propiedad: z.enum(TIPOS_PROPIEDAD),
    titulo: z.string().min(10, "El título debe tener al menos 10 caracteres"),
    descripcion: z.string().optional(),
    precio: z.number().min(0),
    moneda: z.enum(['USD', 'ARS']).default('USD'),
    precio_oculto: z.boolean().default(false),
    direccion_manual: z.string().optional(),
    barrio: z.enum(BARRIOS).optional(),
    video_360_url: z.string().url().optional(),
    fotos_nombres: z.array(z.string()).optional(),
    destacado: z.boolean().default(false),
    codigo: z.string().optional(),
    caracteristicas: PropertyFeaturesSchema.default({}),
    metadatos_seo: SEOMetaSchema.default({}),
});

export const SuscripcionInsertSchema = z.object({
    email: z.string().email(),
    origen: z.string().optional(),
});
