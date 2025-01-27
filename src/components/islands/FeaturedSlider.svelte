<script lang="ts">
    import type { InmuebleDTO } from "../../schemas/inmuebles";
    import PropertyCard from "./PropertyCard.svelte";

    export let properties: InmuebleDTO[] = [];

    let scrollContainer: HTMLDivElement;

    function scrollLeft() {
        if (!scrollContainer) return;
        const isMobile = window.innerWidth < 768;
        const scrollAmount = isMobile
            ? scrollContainer.offsetWidth * 0.85
            : scrollContainer.offsetWidth / 3;

        scrollContainer.scrollBy({
            left: -(scrollAmount + 24),
            behavior: "smooth",
        });
    }

    function scrollRight() {
        if (!scrollContainer) return;
        const isMobile = window.innerWidth < 768;
        const scrollAmount = isMobile
            ? scrollContainer.offsetWidth * 0.85
            : scrollContainer.offsetWidth / 3;

        scrollContainer.scrollBy({
            left: scrollAmount + 24,
            behavior: "smooth",
        });
    }
</script>

<div class="relative w-full overflow-hidden px-4 md:px-0">
    <!-- Header Section for Slider Controls -->
    <div
        class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4"
    >
        <h3
            class="text-2xl md:text-3xl font-extrabold text-[#003B5C] leading-tight"
        >
            Propiedades destacadas
        </h3>

        <div
            class="flex items-center gap-2 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 h-12"
        >
            <button
                on:click={scrollLeft}
                class="whitespace-nowrap px-4 py-2 bg-[#00AEEF] text-white text-[10px] md:text-xs font-bold rounded hover:bg-[#008cc0] transition-colors uppercase tracking-wider"
            >
                Anterior
            </button>
            <button
                on:click={scrollRight}
                class="whitespace-nowrap px-4 py-2 bg-[#00AEEF] text-white text-[10px] md:text-xs font-bold rounded hover:bg-[#008cc0] transition-colors uppercase tracking-wider"
            >
                Siguiente
            </button>
            <a
                href="/buscar"
                class="whitespace-nowrap px-4 py-2 bg-[#00AEEF] text-white text-[10px] md:text-xs font-bold rounded hover:bg-[#008cc0] transition-colors uppercase tracking-wider"
            >
                Todas
            </a>
        </div>
    </div>

    <!-- Scrollable Container -->
    <div class="relative w-full">
        <div
            bind:this={scrollContainer}
            class="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 list-none m-0 p-0"
            style="scrollbar-width: none; -ms-overflow-style: none;"
        >
            {#each properties as prop}
                <div
                    class="min-w-[85%] md:min-w-[calc((100%-3rem)/3)] snap-start"
                >
                    <PropertyCard data={prop} />
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
</style>
