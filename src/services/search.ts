import type { Database } from '../types/database.types';

type DatabaseProp = Database['public']['Tables']['propiedades']['Row'];

export interface SearchService {
    indexProperty(property: DatabaseProp): Promise<void>;
    searchProperties(intent: string): Promise<DatabaseProp[]>; // Returns partials or full rows
}

// 🧠 BÚSQUEDA SEMÁNTICA (Stub) for Elastic Search
export const searchService: SearchService = {
    async indexProperty(property: DatabaseProp) {
        // Intencionalidad: Send only semantic fields
        const doc = {
            id: property.id,
            titulo: property.titulo,
            descripcion: property.descripcion,
            barrio: property.barrio,
            amenities: property.caracteristicas?.amenities || [],
            // embeddings: generateEmbedding(property.titulo + ...) -- future step
        };

        console.log(`[SearchService] Indexing Property: ${property.slug}`, doc);
        // Simulate Network Latency
        // await fetch(ELASTIC_URL, { method: 'POST', body: JSON.stringify(doc) ... })
    },

    async searchProperties(intent: string) {
        console.log(`[SearchService] Searching for: "${intent}"`);
        // Mock result
        return [];
    }
};
