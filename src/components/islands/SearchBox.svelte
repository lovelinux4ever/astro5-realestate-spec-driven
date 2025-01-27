<script lang="ts">
    import { onMount } from "svelte";
    import { slide } from "svelte/transition";
    import {
        BARRIOS,
        TIPOS_OPERACION,
        TIPOS_PROPIEDAD,
    } from "../../lib/constants";

    // Main filter states
    let operation: string = $state("");
    let category: string = $state("");
    let zone: string = $state("");
    let keyword: string = $state("");
    let currency: string = $state("USD");

    // Price Range State
    let minPrice: number = $state(0);
    let maxPrice: number = $state(5000000);
    let sliderMax: number = 5000000;
    let hasTouchedPrice: boolean = $state(false);

    let loading = $state(false);
    let showAdvanced: boolean = $state(false);

    onMount(() => {
        const params = new URLSearchParams(window.location.search);
        operation = params.get("operacion") || "";
        category = params.get("categoria") || "";
        zone = params.get("barrio") || "";
        keyword = params.get("q") || "";
        currency = params.get("moneda") || "USD";

        // Parse prices from URL
        const pMin = params.get("min");
        const pMax = params.get("max");
        if (pMin) {
            minPrice = parseInt(pMin);
            hasTouchedPrice = true;
            showAdvanced = true;
        }
        if (pMax) {
            maxPrice = parseInt(pMax);
            hasTouchedPrice = true;
            showAdvanced = true;
        }
        if (keyword) {
            showAdvanced = true;
        }
    });

    function formatPrice(val: number): string {
        return val.toLocaleString("es-AR");
    }

    function formatPriceShort(val: number): string {
        if (val >= 1000000) return (val / 1000000).toFixed(1) + "M";
        if (val >= 1000) return (val / 1000).toFixed(0) + "k";
        return val.toString();
    }

    async function handleSearch() {
        loading = true;
        try {
            const params = new URLSearchParams();
            if (operation) params.append("operacion", operation);
            if (category) params.append("categoria", category);
            if (zone) params.append("barrio", zone);
            if (keyword) params.append("q", keyword);
            if (currency) params.append("moneda", currency);

            if (hasTouchedPrice) {
                params.append("min", minPrice.toString());
                params.append("max", maxPrice.toString());
            }

            window.location.href = `/buscar?${params.toString()}`;
        } catch (e) {
            console.error(e);
        } finally {
            loading = false;
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSearch();
        }
    }

    function handleSliderChange() {
        hasTouchedPrice = true;
        // Ensure min doesn't exceed max
        if (minPrice > maxPrice) {
            const temp = minPrice;
            minPrice = maxPrice;
            maxPrice = temp;
        }
    }

    function handleMinPriceInput(event: Event) {
        const target = event.target as HTMLInputElement;
        const value = parseInt(target.value.replace(/\D/g, "")) || 0;
        minPrice = Math.min(value, sliderMax);
        hasTouchedPrice = true;
        if (minPrice > maxPrice) {
            maxPrice = minPrice;
        }
    }

    function handleMaxPriceInput(event: Event) {
        const target = event.target as HTMLInputElement;
        const value = parseInt(target.value.replace(/\D/g, "")) || 0;
        maxPrice = Math.min(value, sliderMax);
        hasTouchedPrice = true;
        if (maxPrice < minPrice) {
            minPrice = maxPrice;
        }
    }

    function resetPrices() {
        minPrice = 0;
        maxPrice = sliderMax;
        hasTouchedPrice = false;
    }

    // Calculate slider track fill
    let sliderFillStyle = $derived(
        `left: ${(minPrice / sliderMax) * 100}%; right: ${100 - (maxPrice / sliderMax) * 100}%`,
    );
</script>

<div class="w-full max-w-5xl mx-auto" onkeydown={handleKeydown}>
    <div
        class="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-200"
    >
        <!-- Top Row: Main Filters -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-2">
            <!-- Operation -->
            <div class="space-y-1.5">
                <label
                    for="operation"
                    class="text-[10px] uppercase font-bold text-[#003B5C]/60 tracking-[0.1em] ml-1"
                    >Operación</label
                >
                <div class="relative group">
                    <select
                        id="operation"
                        bind:value={operation}
                        class="w-full pl-4 pr-10 py-3.5 bg-white border-2 border-gray-200 group-hover:border-[#003B5C]/30 focus:border-[#003B5C] rounded-xl text-gray-800 text-sm font-medium transition-all outline-none appearance-none cursor-pointer shadow-sm"
                    >
                        <option value="">Cualquiera</option>
                        {#each TIPOS_OPERACION as op}
                            <option value={op}>{op}</option>
                        {/each}
                    </select>
                    <div
                        class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                    >
                        <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            ><path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 9l-7 7-7-7"
                            /></svg
                        >
                    </div>
                </div>
            </div>

            <!-- Category -->
            <div class="space-y-1.5">
                <label
                    for="category"
                    class="text-[10px] uppercase font-bold text-[#003B5C]/60 tracking-[0.1em] ml-1"
                    >Categoría</label
                >
                <div class="relative group">
                    <select
                        id="category"
                        bind:value={category}
                        class="w-full pl-4 pr-10 py-3.5 bg-white border-2 border-gray-200 group-hover:border-[#003B5C]/30 focus:border-[#003B5C] rounded-xl text-gray-800 text-sm font-medium transition-all outline-none appearance-none cursor-pointer shadow-sm"
                    >
                        <option value="">Todas</option>
                        {#each TIPOS_PROPIEDAD as tipo}
                            <option value={tipo}>{tipo}</option>
                        {/each}
                    </select>
                    <div
                        class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                    >
                        <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            ><path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 9l-7 7-7-7"
                            /></svg
                        >
                    </div>
                </div>
            </div>

            <!-- Zone -->
            <div class="space-y-1.5">
                <label
                    for="zone"
                    class="text-[10px] uppercase font-bold text-[#003B5C]/60 tracking-[0.1em] ml-1"
                    >Ubicación</label
                >
                <div class="relative group">
                    <select
                        id="zone"
                        bind:value={zone}
                        class="w-full pl-4 pr-10 py-3.5 bg-white border-2 border-gray-200 group-hover:border-[#003B5C]/30 focus:border-[#003B5C] rounded-xl text-gray-800 text-sm font-medium transition-all outline-none appearance-none cursor-pointer shadow-sm"
                    >
                        <option value="">Todas las zonas</option>
                        {#each BARRIOS as barrio}
                            <option value={barrio}>{barrio}</option>
                        {/each}
                    </select>
                    <div
                        class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                    >
                        <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            ><path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 9l-7 7-7-7"
                            /></svg
                        >
                    </div>
                </div>
            </div>

            <!-- Currency & Search Button -->
            <div class="flex gap-4 items-end">
                <div class="flex-[1.3] space-y-1.5">
                    <label
                        for="moneda"
                        class="text-[10px] uppercase font-bold text-[#003B5C]/60 tracking-[0.1em] ml-1"
                        >Moneda</label
                    >
                    <select
                        id="moneda"
                        bind:value={currency}
                        class="w-full px-4 py-3.5 bg-white border-2 border-gray-200 focus:border-[#003B5C] rounded-xl text-gray-800 text-sm font-bold transition-all outline-none cursor-pointer shadow-sm"
                    >
                        <option value="USD">USD</option>
                        <option value="ARS">ARS</option>
                    </select>
                </div>
                <button
                    onclick={handleSearch}
                    disabled={loading}
                    class="flex-[1.5] py-4 bg-[#003B5C] text-white font-black rounded-xl hover:bg-[#002d47] active:scale-[0.98] transition-all shadow-lg shadow-[#003B5C]/20 flex items-center justify-center gap-2 disabled:opacity-70 uppercase tracking-widest text-[11px] cursor-pointer"
                >
                    {#if loading}
                        <div
                            class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"
                        ></div>
                    {:else}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 text-[#D4AF37]"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        BUSCAR
                    {/if}
                </button>
            </div>
        </div>

        <!-- Toggle Advanced Filters -->
        <div class="flex justify-center mb-4">
            <button
                type="button"
                onclick={() => (showAdvanced = !showAdvanced)}
                class="flex items-center gap-2 py-2 px-4 rounded-full hover:bg-gray-50 transition-colors group cursor-pointer"
            >
                <span
                    class="text-[10px] font-bold text-[#003B5C]/50 uppercase tracking-[0.2em] group-hover:text-[#003B5C] transition-colors"
                >
                    {showAdvanced
                        ? "Ocultar Filtros Avanzados"
                        : "Precio y Búsqueda Avanzada"}
                </span>
                <svg
                    class="w-4 h-4 text-[#D4AF37] transition-transform duration-300 {showAdvanced
                        ? 'rotate-180'
                        : ''}"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>
        </div>

        {#if showAdvanced}
            <div transition:slide={{ duration: 300 }}>
                <div
                    class="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-gray-100"
                >
                    <!-- Price Range Section -->
                    <div class="space-y-4">
                        <div class="flex justify-between items-center">
                            <span
                                class="text-[11px] font-bold text-[#003B5C] uppercase tracking-wider flex items-center gap-2"
                            >
                                <svg
                                    class="w-4 h-4 text-[#D4AF37]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                Rango de Precio
                            </span>
                            {#if hasTouchedPrice}
                                <button
                                    type="button"
                                    onclick={resetPrices}
                                    class="text-[9px] text-[#003B5C]/50 hover:text-[#D4AF37] transition-colors uppercase tracking-wider cursor-pointer"
                                >
                                    Restablecer
                                </button>
                            {/if}
                        </div>

                        <!-- Price Input Fields -->
                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-1">
                                <label
                                    for="minPriceInput"
                                    class="text-[9px] uppercase font-bold text-[#003B5C]/40 tracking-wider ml-1"
                                >
                                    Mínimo ({currency})
                                </label>
                                <div class="relative">
                                    <span
                                        class="absolute left-3 top-1/2 -translate-y-1/2 text-[#003B5C]/40 text-sm font-medium"
                                    >
                                        $
                                    </span>
                                    <input
                                        id="minPriceInput"
                                        type="text"
                                        value={formatPrice(minPrice)}
                                        oninput={handleMinPriceInput}
                                        class="w-full pl-8 pr-4 py-3 bg-white border-2 border-gray-200 focus:border-[#D4AF37] rounded-xl text-gray-800 text-sm font-medium transition-all outline-none shadow-sm text-right"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div class="space-y-1">
                                <label
                                    for="maxPriceInput"
                                    class="text-[9px] uppercase font-bold text-[#003B5C]/40 tracking-wider ml-1"
                                >
                                    Máximo ({currency})
                                </label>
                                <div class="relative">
                                    <span
                                        class="absolute left-3 top-1/2 -translate-y-1/2 text-[#003B5C]/40 text-sm font-medium"
                                    >
                                        $
                                    </span>
                                    <input
                                        id="maxPriceInput"
                                        type="text"
                                        value={formatPrice(maxPrice)}
                                        oninput={handleMaxPriceInput}
                                        class="w-full pl-8 pr-4 py-3 bg-white border-2 border-gray-200 focus:border-[#D4AF37] rounded-xl text-gray-800 text-sm font-medium transition-all outline-none shadow-sm text-right"
                                        placeholder="5.000.000"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Price Slider - Simple Single Range -->
                        <div class="pt-2">
                            <div class="flex items-center gap-3">
                                <span
                                    class="text-[9px] text-gray-400 font-bold whitespace-nowrap"
                                    >{currency} 0</span
                                >
                                <div
                                    class="flex-1 relative h-6 flex items-center"
                                >
                                    <!-- Single slider for simplicity -->
                                    <input
                                        type="range"
                                        min="0"
                                        max={sliderMax}
                                        step="50000"
                                        bind:value={maxPrice}
                                        oninput={handleSliderChange}
                                        class="w-full h-2 appearance-none bg-gray-200 rounded-full cursor-pointer simple-slider"
                                    />
                                </div>
                                <span
                                    class="text-[9px] text-gray-400 font-bold whitespace-nowrap"
                                    >{currency}
                                    {formatPriceShort(sliderMax)}</span
                                >
                            </div>
                            <p
                                class="text-center text-[9px] text-[#003B5C]/50 mt-2"
                            >
                                {hasTouchedPrice
                                    ? `Hasta ${currency} ${formatPrice(maxPrice)}`
                                    : "Desliza para fijar precio máximo"}
                            </p>
                        </div>
                    </div>

                    <!-- Keyword Search Section -->
                    <div
                        class="bg-gradient-to-br from-[#003B5C]/5 to-[#D4AF37]/5 p-5 rounded-2xl border border-[#003B5C]/10"
                    >
                        <label
                            for="keyword"
                            class="flex items-center gap-2 text-[11px] font-black text-[#003B5C] uppercase tracking-widest mb-3"
                        >
                            <svg
                                class="w-4 h-4 text-[#D4AF37]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            Búsqueda Inteligente por Palabras
                        </label>
                        <input
                            id="keyword"
                            type="text"
                            bind:value={keyword}
                            placeholder="Ej: 'Planta baja', 'Frente al mar', '2 cocheras', '4 habitaciones'..."
                            class="w-full bg-white px-4 py-3.5 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 border-2 border-gray-200 focus:border-[#D4AF37] outline-none transition-all shadow-sm"
                        />
                        <p class="text-[9px] text-[#003B5C]/40 mt-2 ml-1">
                            Busca por características, amenidades, ubicación
                            específica o cualquier detalle de la propiedad.
                        </p>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    /* Simple Slider Styling */
    input[type="range"].simple-slider {
        -webkit-appearance: none;
        appearance: none;
        background: linear-gradient(
            to right,
            #003b5c 0%,
            #003b5c var(--progress, 40%),
            #e5e7eb var(--progress, 40%),
            #e5e7eb 100%
        );
        border-radius: 9999px;
        cursor: pointer;
        height: 8px;
    }

    input[type="range"].simple-slider::-webkit-slider-runnable-track {
        height: 8px;
        border-radius: 9999px;
    }

    input[type="range"].simple-slider::-moz-range-track {
        height: 8px;
        border-radius: 9999px;
        background: #e5e7eb;
    }

    input[type="range"].simple-slider::-moz-range-progress {
        background: #003b5c;
        height: 8px;
        border-radius: 9999px;
    }

    /* Thumb Design - WebKit */
    input[type="range"].simple-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        background: linear-gradient(
            135deg,
            #f4d03f 0%,
            #d4af37 50%,
            #c5a028 100%
        );
        border: 3px solid white;
        border-radius: 50%;
        cursor: grab;
        box-shadow:
            0 2px 8px rgba(212, 175, 55, 0.4),
            0 4px 12px rgba(0, 59, 92, 0.15);
        transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        margin-top: -6px;
    }

    input[type="range"].simple-slider::-webkit-slider-thumb:hover {
        transform: scale(1.15);
        box-shadow:
            0 4px 12px rgba(212, 175, 55, 0.6),
            0 6px 20px rgba(0, 59, 92, 0.2);
    }

    input[type="range"].simple-slider::-webkit-slider-thumb:active {
        cursor: grabbing;
        transform: scale(1.1);
    }

    /* Thumb Design - Firefox */
    input[type="range"].simple-slider::-moz-range-thumb {
        width: 18px;
        height: 18px;
        background: linear-gradient(
            135deg,
            #f4d03f 0%,
            #d4af37 50%,
            #c5a028 100%
        );
        border: 3px solid white;
        border-radius: 50%;
        cursor: grab;
        box-shadow:
            0 2px 8px rgba(212, 175, 55, 0.4),
            0 4px 12px rgba(0, 59, 92, 0.15);
        transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
    }

    input[type="range"].simple-slider::-moz-range-thumb:hover {
        transform: scale(1.15);
        box-shadow:
            0 4px 12px rgba(212, 175, 55, 0.6),
            0 6px 20px rgba(0, 59, 92, 0.2);
    }

    input[type="range"].simple-slider::-moz-range-thumb:active {
        cursor: grabbing;
        transform: scale(1.1);
    }

    input[type="range"].simple-slider:focus {
        outline: none;
    }

    input[type="range"].simple-slider:focus::-webkit-slider-thumb {
        box-shadow:
            0 2px 8px rgba(212, 175, 55, 0.4),
            0 4px 12px rgba(0, 59, 92, 0.15),
            0 0 0 4px rgba(212, 175, 55, 0.2);
    }
</style>
