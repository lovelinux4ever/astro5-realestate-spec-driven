

# Project: Inmobiliaria Astro 5.0

## Contexto Tecnológico
- **Framework:** Astro 5.0
- **Base de Datos / Auth:** Supabase
- **Frontend:** Svelte (integrado en Astro)
- **Lenguaje:** TypeScript (Strict Mode)

## Rules (Innegociables)

### 1. Seguridad de Credenciales
- **PROHIBIDO** exponer o filtrar la `Service Role Key` de Supabase al lado del cliente.
- Las operaciones que requieran privilegios elevados deben ejecutarse estrictamente en el servidor.

### 2. Estándares de TypeScript
- **PROHIBIDO** el uso de `any`. Se debe utilizar `unknown` o tipado fuerte en su lugar.
- Todo código generado debe respetar la tipicidad estricta para evitar errores en tiempo de ejecución.

### 3. Integridad de Base de Datos
- Todo acceso a las tablas de Supabase debe estar protegido por **RLS (Row Level Security)**.
- No se deben generar consultas que intenten saltarse las políticas de seguridad de la DB.

### 4. Patrones de Diseño
- Las respuestas del servidor deben implementar **Railway Oriented Programming (ROP)**.
- Manejar flujos de éxito y error de forma funcional (ej. estructuras `Result` con `ok` o `error`).

### 5. Hidratación Selectiva (Rendimiento) 
- **JS Cero por defecto:** Todo componente es estático a menos que se indique lo contrario. - Solo usa la directiva `client:load` en componentes de Svelte que requieran interactividad inmediata (ej. buscador, formularios críticos). Para el resto, prefiere `client:visible`.

## Workflow de Desarrollo
Sigue estrictamente este orden en la implementación de nuevas funcionalidades:
1. **SQL:** Definir esquemas y políticas RLS en Supabase.
2. **Types:** Generar o actualizar tipos de TypeScript basados en la DB.
3. **Zod:** Crear esquemas de validación para asegurar la integridad de los datos de entrada.
4. **Actions:** Implementar la lógica de servidor (Astro Actions) integrando los pasos anteriores.

## Instrucciones Adicionales
- Asegúrate de que los componentes de Svelte respeten el tipado de las props definido en el workflow.
- -Los componentes de Svelte deben recibir datos tipados desde las Actions de Astro.
- Al crear nuevos componentes, verifica siempre si realmente necesitan hidratación en el cliente.