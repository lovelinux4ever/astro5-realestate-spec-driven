# BITÁCORA DE PROYECTO (Inmobiliaria Core)

## Inventario
- /database.sql: Script SQL (Tablas, RLS, pgvector, audit).
- migration_categories.sql: Script migración para agregar `tipo_propiedad` y Enum.
- /src/lib/constants.ts: Tipos base, Zod Inputs, Barrios (~50) y Tipos Propiedad.
- /src/types/database.types.ts: Tipos DB actualizados.
- /src/lib/server/supabase.ts: Server Client.
- /src/schemas/inmuebles.ts: Guardianes (Validation & DTOs & GeoJSON Point).
- /src/services/search.ts: Servicio de Búsqueda Semántica (Stub).
- /src/actions/index.ts: Astro Actions (ROP Standard, Session Checks, Sync).
- /src/plugins/factory.ts: Plugins Props Factory.
- /src/components/islands/: Componentes (SearchBox Rediseñado, PropertyCard, ContactForm).
- /src/layouts/Layout.astro: Estructura base.
- /src/pages/index.astro: Landing Real con **Inteligencia de Búsqueda (NL Intent Parser)**.

## Correcciones de Auditoría & UI (Fase 4 - Search)
1. **SearchBox "Estilo Proyecto Inmobiliaria S.L."**:
   - Barra flotante con filtros: Operación, Categoría, Zona.
   - Rango de Precios y selector de Moneda.
2. **Inteligencia de Búsqueda (Parseador de Intenciones)**:
   - El sistema detecta patrones en la barra de texto como:
     - `4 habitaciones` / `4 dorm` / `4 hab` -> Filtra por dormitorios.
     - `3 ambientes` / `3 amb` -> Filtra por ambientes.
     - `2 baños` -> Filtra por baños.
   - Si pones "Casa 3 hab en el centro", el sistema extrae "3 habitaciones" como filtro numérico y busca "Casa" en el texto.
3. **Backend Filtering**:
   - `index.astro` soporta filtros por precio, moneda y JSONB structured features.

## Notas de Mantenimiento
- **Ejecutar Migración**: Correr `migration_categories.sql` en Supabase para sincronizar DB.
- **Estilos**: Tailwind CSS usado exclusivamente.
- **Actions**: Usar `createProperty` para cualquier alta. No insertar directamente desde cliente.
- **Search**: Implementar conector real en `src/services/search.ts` cuando se tenga instancia de ES.
