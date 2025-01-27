<script lang="ts">
    import { onMount } from "svelte";
    import { fade, scale } from "svelte/transition";

    let isVisible = false;

    onMount(() => {
        const handleScroll = () => {
            isVisible = window.scrollY > 400;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    });

    function scrollToTop() {
        // Scroll más controlado
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }
</script>

{#if isVisible}
    <button
        on:click={scrollToTop}
        transition:fade={{ duration: 400 }}
        class="fixed bottom-10 right-10 z-[999] p-4 bg-white/90 backdrop-blur-md border border-gray-100 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.1)] text-[#003B5C] hover:bg-[#003B5C] hover:text-white hover:-translate-y-2 transition-all duration-500 ease-out group overflow-hidden"
        aria-label="Ir arriba"
    >
        <div in:scale={{ duration: 600, delay: 200 }} class="relative z-10">
            <svg
                class="w-5 h-5 transform transition-transform duration-500 group-hover:-translate-y-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                    d="M5 15l7-7 7 7"
                />
            </svg>
        </div>
        <!-- Efecto de brillo de fondo al hover -->
        <div
            class="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        ></div>
    </button>
{/if}
