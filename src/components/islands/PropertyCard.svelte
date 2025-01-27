<script lang="ts">
  import type { InmuebleDTO } from "../../schemas/inmuebles";
  import { createPropertyCardProps } from "../../plugins/factory";

  // Props - Strictly typed from Phase 1/2 contracts
  export let data: InmuebleDTO;

  // Visual Formatting
  const currencyFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: data.moneda || "USD",
    maximumFractionDigits: 0,
  });

  const formattedPrice = currencyFormatter.format(data.precio);

  // Defensive check via Factory (Runtime Safety)
  // In a real Svelte file we might do this in module script or parent, but good to have safety.
  const safeData = createPropertyCardProps(data);
</script>

{#if safeData}
  <article
    class="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full"
  >
    <!-- Image Slot -->
    <div class="aspect-video bg-gray-100 relative overflow-hidden">
      {#if safeData.fotos_nombres && safeData.fotos_nombres.length > 0}
        <img
          src={`https://tgdupajzsaoznnraqouj.supabase.co/storage/v1/object/public/fotos-videos-inmo/${safeData.fotos_nombres[0]}`}
          alt={safeData.titulo}
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      {:else}
        <div
          class="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50"
        >
          <span class="text-sm">Sin imagen</span>
        </div>
      {/if}

      {#if safeData.destacado}
        <div class="absolute top-3 left-3">
          <span
            class="px-2 py-1 bg-[#4CAF50] text-white text-[10px] font-bold rounded shadow-sm uppercase tracking-wider"
          >
            DESTACADA
          </span>
        </div>
      {/if}

      <div class="absolute top-3 right-3">
        <span
          class="px-2 py-1 bg-[#333] text-white text-[10px] font-bold rounded shadow-sm uppercase tracking-wider"
        >
          {safeData.tipo_operacion}
        </span>
      </div>

      {#if safeData.estado_propiedad === "Reservado"}
        <div class="absolute bottom-3 right-3">
          <span
            class="px-3 py-1.5 bg-white text-red-600 text-[11px] font-black rounded-md shadow-md uppercase tracking-wider"
          >
            RESERVADO
          </span>
        </div>
      {/if}
    </div>

    <!-- Content -->
    <div class="p-5 flex flex-col flex-1 bg-white">
      <div class="flex justify-between items-start mb-3">
        <h3
          class="text-base font-bold text-[#003B5C] leading-tight line-clamp-2 uppercase"
        >
          {safeData.titulo}
        </h3>
      </div>

      <!-- Main Info Row: Price/Features (Left) + Button (Right) -->
      <div class="flex justify-between items-end gap-4 mb-4">
        <div class="flex flex-col flex-1">
          <div class="text-xl font-black text-[#003B5C]">
            {#if safeData.precio_oculto}
              Consulte Precio
            {:else}
              {formattedPrice}
            {/if}
          </div>

          <!-- Features Row -->
          <div
            class="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[11px] font-medium text-gray-500 uppercase tracking-wider"
          >
            {#if safeData.caracteristicas?.dormitorios > 0}
              <span class="flex items-center gap-1">
                <span class="text-[#003B5C]">🛏️</span>
                {safeData.caracteristicas.dormitorios} hab
              </span>
            {/if}
            {#if safeData.caracteristicas?.banios > 0}
              <span class="flex items-center gap-1">
                <span class="text-[#003B5C]">🚿</span>
                {safeData.caracteristicas.banios} bañ
              </span>
            {/if}
            {#if safeData.caracteristicas?.superficie_total > 0}
              <span class="flex items-center gap-1">
                <span class="text-[#003B5C]">📐</span>
                {safeData.caracteristicas.superficie_total} m²
              </span>
            {/if}
          </div>
        </div>

        <a
          href={`/propiedades/${safeData.slug}`}
          class="shrink-0 bg-[#003B5C] text-white text-[10px] font-black py-2.5 px-5 rounded-full shadow-lg uppercase tracking-widest border-2 border-[#D4AF37] transition-all hover:shadow-[#D4AF37]/20 hover:-translate-y-0.5 active:translate-y-0"
        >
          Ver detalle
        </a>
      </div>

      <!-- Footer Info -->
      <div
        class="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between"
      >
        <div class="flex items-center gap-2">
          {#if safeData.barrio}
            <span
              class="text-[11px] font-semibold text-gray-400 flex items-center gap-1 uppercase tracking-tight"
            >
              📍 {safeData.barrio}
            </span>
          {:else}
            <span
              class="text-[11px] font-semibold text-gray-300 italic uppercase tracking-tight"
            >
              📍 Consultar
            </span>
          {/if}
        </div>
        <span
          class="text-[12px] font-black text-gray-600 bg-gray-100 px-2 py-0.5 rounded uppercase"
        >
          ID: {safeData.codigo || safeData.id.split("-")[0].toUpperCase()}
        </span>
      </div>
    </div>
  </article>
{/if}
