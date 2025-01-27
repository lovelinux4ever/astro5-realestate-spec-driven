import { defineMiddleware } from "astro:middleware";
import { supabase } from "./lib/server/supabase";

export const onRequest = defineMiddleware(async (context, next) => {
    const { url, request, redirect } = context;

    // 1. Proteger rutas de Admin
    if (url.pathname.startsWith("/admin") && url.pathname !== "/admin") {
        // Aquí implementaremos la lógica de validación de sesión real
        // Por ahora, permitimos el acceso para no bloquear el desarrollo
        // TODO: Implementar validación de cookie/token de Supabase

        // Ejemplo (comentado hasta tener auth flows):
        /*
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            return redirect("/admin");
        }
        */
    }

    return next();
});
