<script lang="ts">
    import { onMount } from "svelte";

    let isMenuOpen = false;

    const navLinks = [
        { name: "Inicio", href: "/" },
        { name: "Ventas", href: "/buscar?operacion=En Venta" },
        { name: "Tasaciones", href: "/tasaciones" },
        { name: "Quienes Somos", href: "/nosotros" },
    ];

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }
</script>

<nav class="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-20">
            <!-- Logo area -->
            <div class="flex items-center">
                <a href="/" class="flex items-center gap-3 group">
                    <div
                        class="w-10 h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center text-white shadow-sm group-hover:bg-[#b8962e] transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-6 h-6"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            ><path
                                d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                            /><polyline points="9 22 9 12 15 12 15 22" /></svg
                        >
                    </div>
                    <div class="flex flex-col">
                        <span
                            class="text-xl font-bold text-[#003B5C] tracking-tight leading-none"
                            >Proyecto Inmobiliaria S.L.</span
                        >
                        <span
                            class="text-[10px] font-medium text-gray-400 uppercase tracking-[0.2em] mt-1"
                            >Proyecto Inmobiliaria S.L.</span
                        >
                    </div>
                </a>
            </div>

            <!-- Desktop Navigation -->
            <div class="hidden md:flex items-center space-x-8">
                <div class="flex space-x-6">
                    {#each navLinks as link}
                        <a
                            href={link.href}
                            class="text-sm font-bold text-[#003B5C] hover:text-[#D4AF37] transition-colors"
                        >
                            {link.name}
                        </a>
                    {/each}
                </div>

                <div
                    class="flex items-center gap-6 border-l pl-8 border-gray-100"
                >
                    <a
                        href="/contacto"
                        class="text-sm font-bold text-[#003B5C] hover:text-[#D4AF37] transition-colors"
                    >
                        Contacto
                    </a>
                    <a
                        href="/buscar"
                        class="text-sm font-bold text-[#003B5C] border-2 border-[#003B5C] px-5 py-2 rounded hover:bg-[#003B5C] hover:text-white transition-all"
                    >
                        Propiedades
                    </a>
                </div>
            </div>

            <!-- Mobile menu button -->
            <div class="md:hidden flex items-center">
                <button
                    on:click={toggleMenu}
                    class="text-[#003B5C] p-2 rounded-md hover:bg-gray-50 focus:outline-none"
                    aria-label="Abrir menú"
                >
                    {#if isMenuOpen}
                        <svg
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    {:else}
                        <svg
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    {/if}
                </button>
            </div>
        </div>
    </div>

    <!-- Mobile Navigation -->
    {#if isMenuOpen}
        <div
            class="md:hidden bg-white border-t border-gray-50 py-4 px-4 space-y-3 shadow-xl"
        >
            {#each navLinks as link}
                <a
                    href={link.href}
                    on:click={() => (isMenuOpen = false)}
                    class="block text-base font-bold text-[#003B5C] hover:bg-gray-50 p-2 rounded-md transition-colors"
                >
                    {link.name}
                </a>
            {/each}
            <div class="pt-4 border-t border-gray-50 flex flex-col gap-3">
                <a
                    href="/contacto"
                    on:click={() => (isMenuOpen = false)}
                    class="text-base font-bold text-[#003B5C] p-2"
                >
                    Contacto
                </a>
                <a
                    href="/buscar"
                    on:click={() => (isMenuOpen = false)}
                    class="text-center bg-[#003B5C] text-white font-bold py-3 rounded-md shadow-md"
                >
                    Ver Propiedades
                </a>
            </div>
        </div>
    {/if}
</nav>
