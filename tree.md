
proyectoinmo-web/
├── src/
│   ├── actions/             # EL MOTOR (Lógica que procesa datos)
│   │   ├── properties.ts    # Acciones para crear/editar propiedades
│   │   ├── contact.ts       # Acciones para formularios y tasaciones
│   │   └── newsletter.ts    # Conexión segura con Mailchimp/Zoho
│   │
│   ├── islands/             # LAS PIEZAS INTERACTIVAS (Tus "Plugins")
│   │   ├── SearchBar.tsx    # Buscador con filtros JSONB
│   │   ├── ImageGallery.tsx # Galería + Visor de Video 360°
│   │   ├── PropertyForm.tsx # EL ADMIN: Carga de fotos + Checkboxes
│   │   ├── PriceAlert.tsx   # Botón de alerta de precio
│   │   └── ContactButtons.tsx # Botones de WhatsApp con tracking
│   │
│   ├── components/          # PIEZAS ESTÁTICAS (Seguras y veloces)
│   │   ├── layout/          # Header.astro, Footer.astro
│   │   ├── property/        # PropertyCard.astro, AmenitiesGrid.astro
│   │   └── ui/              # Botones simples, Badges (Vendido/Reservado)
│   │
│   ├── pages/               # EL ENSAMBLE (Tus URLs públicas)
│   │   ├── index.astro      # Home (proyectoinmo.demo)
│   │   ├── nosotros.astro   # Quiénes somos
│   │   ├── tasaciones.astro # Captación de propietarios
│   │   ├── contacto.astro   # Formulario general y oficinas
│   │   ├── buscar.astro     # Resultados de búsqueda y filtros
│   │   ├── propiedades/
│   │   │   └── [slug].astro # Ficha de la propiedad (El "Plug" de todo)
│   │   └── admin/           # PANEL PRIVADO
│   │       ├── index.astro  # Login
│   │       └── dashboard.astro # Gestión del inventario
│   │
│   ├── layouts/             # LAS PLANTILLAS
│   │   ├── MainLayout.astro # Estructura para toda la web
│   │   └── AdminLayout.astro # Estructura para el panel de control
│   │
│   ├── lib/                 # EL DICCIONARIO
│   │   ├── supabase.ts      # Conexión a la DB
│   │   └── constants.ts     # Lista de servicios (Parrilla, Pileta, etc.)
│   │
│   └── types/               # EL TRADUCTOR
│       └── database.ts      # Tipos automáticos de Supabase
│
├── supabase/                # EL CIMIENTO (Fuera de la web)
│   ├── migrations/          # Tus archivos SQL (Paso 1)
│   └── functions/           # Edge Functions (Marca de agua automática)
│
├── .env                     # TUS LLAVES (Secretos de API)
└── astro.config.mjs         # Configuración del proyecto