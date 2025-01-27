<script lang="ts">
    import { onMount } from "svelte";

    let timeout: number;
    let isScrolling = false;

    function handleScroll() {
        isScrolling = true;
        window.clearTimeout(timeout);

        // Aumentamos el tiempo de espera para asegurar que el usuario realmente terminó su acción
        timeout = window.setTimeout(() => {
            isScrolling = false;

            const sections = document.querySelectorAll(".snap-section");
            const scrollPos = window.scrollY;
            const threshold = 150; // Zona de snapping muy reducida para evitar saltos accidentales

            let targetSection = null;

            sections.forEach((section) => {
                const rect = (section as HTMLElement).getBoundingClientRect();
                // Si la sección está muy cerca del borde superior (entre -150 y 150 px)
                if (Math.abs(rect.top) < threshold) {
                    targetSection = section;
                }
            });

            if (targetSection) {
                const targetTop = (targetSection as HTMLElement).offsetTop;
                // Verificamos que el salto valga la pena (más de 15px de diferencia)
                if (Math.abs(window.scrollY - targetTop) > 15) {
                    window.scrollTo({
                        top: targetTop,
                        behavior: "smooth",
                    });
                }
            }
        }, 600); // 600ms es un tiempo más natural para detectar el fin de una intención de scroll
    }

    onMount(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.clearTimeout(timeout);
        };
    });
</script>
