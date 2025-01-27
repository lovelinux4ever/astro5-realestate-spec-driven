import type { InmuebleDTO } from '../schemas/inmuebles';
import { InmuebleDTOSchema } from '../schemas/inmuebles';

// 🧩 FACTORY DE PLUGINS (Islands Orchestrator)

// This factory function ensures that any data passed to a Svelte Component (Plugin)
// is strictly typed and sanitized (DTO), preventing leaking of backend objects.

export function createPluginProps<T>(data: unknown, schema: any): T | null {
    const result = schema.safeParse(data);
    if (!result.success) {
        console.error('Plugin Prop Serialization Error:', result.error);
        return null;
    }
    return result.data;
}

// Specialized helpers
export function createPropertyCardProps(rawData: unknown): InmuebleDTO | null {
    return createPluginProps<InmuebleDTO>(rawData, InmuebleDTOSchema);
}
