import type { PropertyFeatures, SEOMeta } from '../lib/constants';

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            propiedades: {
                Row: {
                    id: string
                    publicado: boolean
                    tipo_operacion: string
                    estado_propiedad: string
                    tipo_propiedad: string | null
                    titulo: string
                    slug: string
                    descripcion: string | null
                    precio: number
                    moneda: string | null
                    precio_oculto: boolean
                    direccion_manual: string | null
                    barrio: string | null
                    fotos_nombres: string[] | null
                    video_360_url: string | null
                    caracteristicas: PropertyFeatures
                    metadatos_seo: SEOMeta
                    destacado: boolean
                    codigo: string | null
                    owner_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    publicado?: boolean
                    tipo_operacion?: string
                    estado_propiedad?: string
                    tipo_propiedad?: string | null
                    titulo: string
                    slug: string
                    descripcion?: string | null
                    precio: number
                    moneda?: string | null
                    precio_oculto?: boolean
                    direccion_manual?: string | null
                    barrio?: string | null
                    fotos_nombres?: string[] | null
                    video_360_url?: string | null
                    caracteristicas?: PropertyFeatures
                    metadatos_seo?: SEOMeta
                    destacado?: boolean
                    codigo?: string | null
                    owner_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    publicado?: boolean
                    tipo_operacion?: string
                    estado_propiedad?: string
                    tipo_propiedad?: string | null
                    titulo?: string
                    slug?: string
                    descripcion?: string | null
                    precio?: number
                    moneda?: string | null
                    precio_oculto?: boolean
                    direccion_manual?: string | null
                    barrio?: string | null
                    fotos_nombres?: string[] | null
                    video_360_url?: string | null
                    caracteristicas?: PropertyFeatures
                    metadatos_seo?: SEOMeta
                    destacado?: boolean
                    codigo?: string | null
                    owner_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            suscripciones: {
                Row: {
                    email: string
                    origen: string | null
                    estado_sync: boolean | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    email: string
                    origen?: string | null
                    estado_sync?: boolean | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    email?: string
                    origen?: string | null
                    estado_sync?: boolean | null
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}
