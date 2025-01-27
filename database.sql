-- Enable pgvector extension for future semantic search
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;

-- Create Enum for Comercial State
CREATE TYPE estado_comercial_enum AS ENUM ('En Venta', 'Alquilada', 'Reservada', 'Vendida');

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- TABLE: propiedades
CREATE TABLE public.propiedades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, -- ODS Field
    publicado BOOLEAN DEFAULT false, -- ODS Field
    estado_comercial estado_comercial_enum NOT NULL, -- ODS Field
    titulo TEXT NOT NULL, -- ODS Field
    slug TEXT NOT NULL UNIQUE, -- ODS Field
    descripcion TEXT, -- ODS Field
    precio NUMERIC NOT NULL CHECK (precio >= 0), -- ODS Field
    moneda TEXT DEFAULT 'USD', -- ODS Field
    direccion_manual TEXT, -- ODS Field
    ubicacion_gps GEOGRAPHY(POINT), -- ODS Field
    barrio TEXT, -- ODS Field
    fotos_nombres TEXT[], -- ODS Field
    video_360_url TEXT, -- ODS Field
    caracteristicas JSONB NOT NULL DEFAULT '{}'::jsonb, -- ODS Field
    metadatos_seo JSONB NOT NULL DEFAULT '{}'::jsonb, -- ODS Field
    
    -- Audit / Security Fields
    owner_id UUID REFERENCES auth.users(id) DEFAULT auth.uid(), -- [NEW] Security Requirement
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, -- [NEW] Audit Requirement
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL  -- [NEW] Audit Requirement
);

-- RLS: propiedades
ALTER TABLE public.propiedades ENABLE ROW LEVEL SECURITY;

-- Policy: Public Read for Published Properties
CREATE POLICY "Public Read Published" ON public.propiedades
    FOR SELECT TO public
    USING (publicado = true);

-- Policy: Service Role Full Access
CREATE POLICY "Service Role Full Access" ON public.propiedades
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Policy: Authenticated Users (Agents) - STRICT ownership
-- Agents can INSERT (default owner_id will be set to auth.uid())
-- Agents can UPDATE/DELETE only their own records
CREATE POLICY "Agents Insert" ON public.propiedades
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Agents Update Own" ON public.propiedades
    FOR UPDATE TO authenticated
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Agents Delete Own" ON public.propiedades
    FOR DELETE TO authenticated
    USING (auth.uid() = owner_id);

-- Trigger: propiedades updated_at
CREATE TRIGGER update_propiedades_updated_at
    BEFORE UPDATE ON public.propiedades
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- TABLE: suscripciones
CREATE TABLE public.suscripciones (
    email TEXT PRIMARY KEY, -- ODS Field
    origen TEXT, -- ODS Field
    estado_sync BOOLEAN DEFAULT false, -- ODS Field
    
    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- RLS: suscripciones
ALTER TABLE public.suscripciones ENABLE ROW LEVEL SECURITY;

-- Policy: Public Insert (for newsletters)
CREATE POLICY "Public Insert" ON public.suscripciones
    FOR INSERT TO public
    WITH CHECK (true);

-- Policy: Service Role Full Access
CREATE POLICY "Service Role Full Access Subs" ON public.suscripciones
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Authenticated Read/Update (Agents) - Might need generic access or restriction?
-- ODS didn't specify ownership for subscriptions. Assuming Agents can view/manage them?
-- Or "Read/Update restricted to Service Role & Authenticated Users" per plan.
CREATE POLICY "Agents Read Subs" ON public.suscripciones
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Agents Update Subs" ON public.suscripciones
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

-- Trigger: suscripciones updated_at
CREATE TRIGGER update_suscripciones_updated_at
    BEFORE UPDATE ON public.suscripciones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
