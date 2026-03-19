import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
    const { url, redirect, cookies } = context;

    // Buscamos el token secreto en las variables de entorno (servidor)
    const ADMIN_TOKEN = process.env.ADMIN_SECRET_TOKEN || import.meta.env.ADMIN_SECRET_TOKEN;

    if (url.pathname.startsWith("/admin")) {
        const tokenInUrl = url.searchParams.get("token");
        const hasCookie = cookies.has("admin_access");

        // Comparamos contra la variable de entorno, no contra un texto fijo
        if (tokenInUrl === ADMIN_TOKEN && ADMIN_TOKEN !== undefined) {
            cookies.set("admin_access", "true", { path: "/", httpOnly: true });
            return next();
        }

        if (!hasCookie) {
            return redirect("/");
        }
    }

    return next();
});