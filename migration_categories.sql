-- Migration: Add tipo_propiedad
-- Description: Adds enum and column for Property Type based on User Request.

-- 1. Create Enum
CREATE TYPE tipo_propiedad_enum AS ENUM (
    'Casas / Chalets',
    'Departamentos',
    'Edificios a Estrenar',
    'Locales y Oficinas',
    'Lotes / Campos',
    'PH / Duplex'
);

-- 2. Add Column to propiedaes
ALTER TABLE public.propiedades 
ADD COLUMN tipo_propiedad tipo_propiedad_enum;

-- Optional: Set default or update existing rows if needed
-- UPDATE public.propiedades SET tipo_propiedad = 'Departamentos' WHERE tipo_propiedad IS NULL;
-- ALTER TABLE public.propiedades ALTER COLUMN tipo_propiedad SET NOT NULL;
