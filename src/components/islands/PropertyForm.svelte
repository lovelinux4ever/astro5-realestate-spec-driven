<script lang="ts">
    import { onMount } from "svelte";
    import {
        BARRIOS,
        ESTADOS_PROPIEDAD,
        TIPOS_OPERACION,
        TIPOS_PROPIEDAD,
    } from "../../lib/constants";

    export let id: string | undefined = undefined;

    // Form Data
    let formData = {
        titulo: "",
        descripcion: "",
        precio: 0,
        moneda: "USD",
        precio_oculto: false,
        tipo_operacion: "Venta",
        estado_propiedad: "En Venta",
        tipo_propiedad: "Departamentos", // Default value
        publicado: false, // New field for visibility
        direccion_manual: "",
        barrio: "",
        video_360_url: "",
        fotos_nombres: [] as string[],
        destacado: false, // Nuevo campo destacado
        caracteristicas: {
            ambientes: 0,
            dormitorios: 0,
            banios: 0,
            cocheras: 0,
            superficie_total: 0,
            superficie_cubierta: 0,
            aire_acondicionado: false,
            cochera: false,
            gimnasio: false,
            lavadero: false,
            parrilla: false,
            patio: false,
            pileta: false,
            quincho: false,
            sala_de_juegos: false,
            spa: false,
            sum: false,
        },
    };

    let loading = false;
    let message = { type: "", text: "" };

    onMount(async () => {
        if (id) {
            loading = true;
            try {
                const response = await fetch(`/api/propiedades/${id}`);
                const result = await response.json();

                if (!response.ok) throw new Error(result.error);

                const prop = result.property;
                formData = {
                    titulo: prop.titulo,
                    descripcion: prop.descripcion || "",
                    precio: prop.precio,
                    moneda: prop.moneda || "USD",
                    precio_oculto: prop.precio_oculto || false,
                    tipo_operacion: prop.tipo_operacion || "Venta",
                    estado_propiedad: prop.estado_propiedad || "En Venta",
                    tipo_propiedad: prop.tipo_propiedad || "Departamentos",
                    publicado: prop.publicado, // Load published status
                    direccion_manual: prop.direccion_manual || "",
                    barrio: prop.barrio || "",
                    video_360_url: prop.video_360_url || "",
                    fotos_nombres: prop.fotos_nombres || [],
                    destacado: prop.destacado || false, // Load destacado status
                    caracteristicas: {
                        ambientes: prop.caracteristicas?.ambientes || 0,
                        dormitorios: prop.caracteristicas?.dormitorios || 0,
                        banios: prop.caracteristicas?.banios || 0,
                        cocheras: prop.caracteristicas?.cocheras || 0,
                        superficie_total:
                            prop.caracteristicas?.superficie_total || 0,
                        superficie_cubierta:
                            prop.caracteristicas?.superficie_cubierta || 0,
                        aire_acondicionado:
                            !!prop.caracteristicas?.aire_acondicionado,
                        cochera: !!prop.caracteristicas?.cochera,
                        gimnasio: !!prop.caracteristicas?.gimnasio,
                        lavadero: !!prop.caracteristicas?.lavadero,
                        parrilla: !!prop.caracteristicas?.parrilla,
                        patio: !!prop.caracteristicas?.patio,
                        pileta: !!prop.caracteristicas?.pileta,
                        quincho: !!prop.caracteristicas?.quincho,
                        sala_de_juegos: !!prop.caracteristicas?.sala_de_juegos,
                        spa: !!prop.caracteristicas?.spa,
                        sum: !!prop.caracteristicas?.sum,
                    },
                };
            } catch (error) {
                console.error("Error loading property:", error);
                message = {
                    type: "error",
                    text: "Error al cargar los datos de la propiedad.",
                };
            } finally {
                loading = false;
            }
        }
    });

    async function handleDelete() {
        if (
            !confirm(
                "¿Estás seguro de que quieres eliminar esta propiedad? Esta acción no se puede deshacer.",
            )
        )
            return;

        loading = true;
        try {
            const response = await fetch(`/api/propiedades/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || "Error al eliminar");
            }

            window.location.href = "/admin/propiedades";
        } catch (error) {
            console.error(error);
            message = { type: "error", text: error.message };
            loading = false;
        }
    }

    function handleCancel() {
        window.history.back();
    }

    async function handleSubmit() {
        loading = true;
        message = { type: "", text: "" };

        try {
            const cleanData = {
                ...formData,
                barrio: formData.barrio || undefined,
                direccion_manual: formData.direccion_manual || undefined,
                video_360_url: formData.video_360_url || undefined,
                descripcion: formData.descripcion || undefined,
                caracteristicas: {
                    ...formData.caracteristicas,
                    ambientes: formData.caracteristicas.ambientes || undefined,
                    superficie_total:
                        formData.caracteristicas.superficie_total || undefined,
                    superficie_cubierta:
                        formData.caracteristicas.superficie_cubierta ||
                        undefined,
                },
            };

            const url = id ? `/api/propiedades/${id}` : "/api/propiedades";
            const method = id ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cleanData),
            });

            const result = await response.json();

            if (!response.ok) {
                if (result.details && result.details._errors) {
                    throw new Error(result.error || "Error de Validación");
                }
                if (result.details && !result.details._errors) {
                    const errorList = Object.entries(result.details)
                        .filter(
                            ([key, val]: any) =>
                                val._errors && val._errors.length > 0,
                        )
                        .map(
                            ([key, val]: any) =>
                                `${key}: ${val._errors.join(", ")}`,
                        )
                        .join(" | ");
                    throw new Error(`Error: ${errorList}`);
                }
                throw new Error(result.error || "Error al guardar");
            }

            message = {
                type: "success",
                text: "Propiedad guardada con éxito!",
            };

            if (!id && result.property?.id) {
                // Si era una nueva propiedad, redirigimos a la edición para evitar duplicados
                window.location.href = `/admin/propiedades/${result.property.id}`;
            }
        } catch (error: any) {
            console.error(error);
            message = { type: "error", text: error.message };
        } finally {
            loading = false;
        }
    }

    let isDragging = false;
    let uploadProgress = 0;

    async function handleFileUpload(files: FileList) {
        if (!files.length) return;

        loading = true;
        message = { type: "", text: "" };

        try {
            const supabaseUrl = "https://tgdupajzsaoznnraqouj.supabase.co";
            // @ts-ignore
            const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
            
            if (!supabaseAnonKey) {
                throw new Error("Missing PUBLIC_SUPABASE_ANON_KEY env variable");
            }
            
            const { createClient } = await import('@supabase/supabase-js');
            const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
                const folder = id || 'general';
                const filePath = `${folder}/${fileName}`;

                const { data, error } = await supabaseClient.storage
                    .from('fotos-videos-inmo')
                    .upload(filePath, file, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (error) throw new Error(error.message);

                formData.fotos_nombres = [
                    ...formData.fotos_nombres,
                    filePath,
                ];
            }
            message = { type: "success", text: "Archivos subidos con éxito" };
        } catch (error: any) {
            console.error("Upload error:", error);
            message = {
                type: "error",
                text: "Error al subir archivos: " + error.message,
            };
        } finally {
            loading = false;
        }
    }

    function removePhoto(index: number) {
        formData.fotos_nombres = formData.fotos_nombres.filter(
            (_, i) => i !== index,
        );
    }

    // Reactividad para sincronizar Cocheras
    $: if (formData.caracteristicas.cocheras > 0) {
        formData.caracteristicas.cochera = true;
    }
    $: if (
        formData.caracteristicas.cochera &&
        formData.caracteristicas.cocheras === 0
    ) {
        formData.caracteristicas.cocheras = 1;
    }
    $: if (!formData.caracteristicas.cochera) {
        formData.caracteristicas.cocheras = 0;
    }
</script>

<form
    on:submit|preventDefault={handleSubmit}
    class="space-y-8 divide-y divide-gray-200"
>
    <div class="space-y-8 divide-y divide-gray-200">
        <!-- Basic Info -->
        <div>
            <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div class="sm:col-span-4">
                    <label
                        for="titulo"
                        class="block text-sm font-medium text-gray-700"
                        >Título</label
                    >
                    <div class="mt-1">
                        <input
                            type="text"
                            name="titulo"
                            id="titulo"
                            bind:value={formData.titulo}
                            required
                            minlength="10"
                            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        />
                    </div>
                </div>

                <div class="sm:col-span-2">
                    <label
                        for="publicado"
                        class="block text-sm font-medium text-gray-700"
                        >Visibilidad</label
                    >
                    <div class="mt-1">
                        <select
                            id="publicado"
                            name="publicado"
                            bind:value={formData.publicado}
                            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        >
                            <option value={true}>Publicada (Visible)</option>
                            <option value={false}>Borrador (Oculta)</option>
                        </select>
                    </div>
                </div>

                <div class="sm:col-span-2">
                    <label
                        for="destacado"
                        class="block text-sm font-medium text-gray-700"
                        >¿Destacar?</label
                    >
                    <div class="mt-1">
                        <select
                            id="destacado"
                            name="destacado"
                            bind:value={formData.destacado}
                            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        >
                            <option value={true}>Sí (Destacada)</option>
                            <option value={false}>No</option>
                        </select>
                    </div>
                </div>

                <div class="sm:col-span-2">
                    <label
                        for="tipo_operacion"
                        class="block text-sm font-medium text-gray-700"
                        >Operación</label
                    >
                    <div class="mt-1">
                        <select
                            id="tipo_operacion"
                            name="tipo_operacion"
                            bind:value={formData.tipo_operacion}
                            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        >
                            {#each TIPOS_OPERACION as tipo}
                                <option value={tipo}>{tipo}</option>
                            {/each}
                        </select>
                    </div>
                </div>

                <div class="sm:col-span-2">
                    <label
                        for="estado_propiedad"
                        class="block text-sm font-medium text-gray-700"
                        >Estado</label
                    >
                    <div class="mt-1">
                        <select
                            id="estado_propiedad"
                            name="estado_propiedad"
                            bind:value={formData.estado_propiedad}
                            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        >
                            {#each ESTADOS_PROPIEDAD as estado}
                                <option value={estado}>{estado}</option>
                            {/each}
                        </select>
                    </div>
                </div>

                <div class="sm:col-span-2">
                    <label
                        for="tipo_propiedad"
                        class="block text-sm font-medium text-gray-700"
                        >Tipo de Propiedad</label
                    >
                    <div class="mt-1">
                        <select
                            id="tipo_propiedad"
                            name="tipo_propiedad"
                            bind:value={formData.tipo_propiedad}
                            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        >
                            {#each TIPOS_PROPIEDAD as tipo}
                                <option value={tipo}>{tipo}</option>
                            {/each}
                        </select>
                    </div>
                </div>

                <div class="sm:col-span-6">
                    <label
                        for="descripcion"
                        class="block text-sm font-medium text-gray-700"
                        >Descripción</label
                    >
                    <div class="mt-1">
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            rows="3"
                            bind:value={formData.descripcion}
                            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                        ></textarea>
                    </div>
                </div>

                <div class="sm:col-span-2">
                    <label
                        for="moneda"
                        class="block text-sm font-medium text-gray-700"
                        >Moneda</label
                    >
                    <div class="mt-1">
                        <select
                            id="moneda"
                            name="moneda"
                            bind:value={formData.moneda}
                            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        >
                            <option value="USD">USD</option>
                            <option value="ARS">ARS</option>
                        </select>
                    </div>
                </div>

                <div class="sm:col-span-2">
                    <label
                        for="precio"
                        class="block text-sm font-medium text-gray-700"
                        >Precio</label
                    >
                    <div class="mt-1">
                        <input
                            type="number"
                            name="precio"
                            id="precio"
                            bind:value={formData.precio}
                            required
                            min="0"
                            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        />
                    </div>
                </div>

                <div class="sm:col-span-2">
                    <label
                        for="precio_oculto"
                        class="block text-sm font-medium text-gray-700"
                        >Privacidad Precio</label
                    >
                    <div class="mt-1">
                        <select
                            id="precio_oculto"
                            name="precio_oculto"
                            bind:value={formData.precio_oculto}
                            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        >
                            <option value={false}>Público</option>
                            <option value={true}>Reservado (Ocultar)</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <!-- Multimedia -->
        <div class="pt-8">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
                Galería de Multimedia
            </h3>
            <p class="mt-1 text-sm text-gray-500">
                Sube fotos o videos de la propiedad. Puedes arrastrar y soltar
                archivos aquí.
            </p>

            <div class="mt-6">
                <!-- Dropzone -->
                <div
                    class={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${
                        isDragging
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-300"
                    }`}
                    role="button"
                    tabindex="0"
                    aria-label="Zona de carga de archivos"
                    on:dragover|preventDefault={() => (isDragging = true)}
                    on:dragleave|preventDefault={() => (isDragging = false)}
                    on:drop|preventDefault={(e) => {
                        isDragging = false;
                        if (e.dataTransfer?.files) {
                            handleFileUpload(e.dataTransfer.files);
                        }
                    }}
                    on:keydown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            document.getElementById("file-upload")?.click();
                        }
                    }}
                >
                    <div class="space-y-1 text-center">
                        <svg
                            class="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                        >
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                        <div class="flex text-sm text-gray-600">
                            <label
                                for="file-upload"
                                class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                            >
                                <span>Sube un archivo</span>
                                <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    class="sr-only"
                                    multiple
                                    accept="image/*,video/*"
                                    on:change={(e) => {
                                        if (e.currentTarget.files) {
                                            handleFileUpload(
                                                e.currentTarget.files,
                                            );
                                        }
                                    }}
                                />
                            </label>
                            <p class="pl-1">o arrastra y suelta</p>
                        </div>
                        <p class="text-xs text-gray-500">
                            Fotos o videos de cada propiedad
                        </p>
                    </div>
                </div>

                <!-- Preview Grid -->
                {#if formData.fotos_nombres.length > 0}
                    <div
                        class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
                    >
                        {#each formData.fotos_nombres as photo, index}
                            <div
                                class="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
                            >
                                {#if photo
                                    .toLowerCase()
                                    .endsWith(".mp4") || photo
                                        .toLowerCase()
                                        .endsWith(".webm") || photo
                                        .toLowerCase()
                                        .endsWith(".ogg")}
                                    <video
                                        src={`https://tgdupajzsaoznnraqouj.supabase.co/storage/v1/object/public/fotos-videos-inmo/${photo}`}
                                        class="w-full h-full object-cover"
                                        muted
                                        loop
                                        on:mouseenter={(e) =>
                                            e.currentTarget.play()}
                                        on:mouseleave={(e) => {
                                            e.currentTarget.pause();
                                            e.currentTarget.currentTime = 0;
                                        }}
                                    >
                                        <track kind="captions" />
                                    </video>
                                {:else}
                                    <img
                                        src={`https://tgdupajzsaoznnraqouj.supabase.co/storage/v1/object/public/fotos-videos-inmo/${photo}`}
                                        alt={`Archivo ${index + 1}`}
                                        class="w-full h-full object-cover"
                                    />
                                {/if}
                                <div
                                    class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center"
                                >
                                    <button
                                        type="button"
                                        aria-label="Eliminar archivo"
                                        title="Eliminar"
                                        class="hidden group-hover:block p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all transform hover:scale-110"
                                        on:click={() => removePhoto(index)}
                                    >
                                        <svg
                                            class="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>

        <!-- Location -->
        <div class="pt-8">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
                Ubicación
            </h3>
            <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div class="sm:col-span-3">
                    <label
                        for="barrio"
                        class="block text-sm font-medium text-gray-700"
                        >Barrio</label
                    >
                    <div class="mt-1">
                        <select
                            id="barrio"
                            name="barrio"
                            bind:value={formData.barrio}
                            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        >
                            <option value="">Seleccione un barrio</option>
                            {#each BARRIOS as barrio}
                                <option value={barrio}>{barrio}</option>
                            {/each}
                        </select>
                    </div>
                </div>

                <div class="sm:col-span-6">
                    <label
                        for="direccion"
                        class="block text-sm font-medium text-gray-700"
                        >Dirección</label
                    >
                    <div class="mt-1">
                        <input
                            type="text"
                            name="direccion"
                            id="direccion"
                            bind:value={formData.direccion_manual}
                            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- Features -->
        <div class="pt-8">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
                Características
            </h3>
            <div class="mt-6 grid grid-cols-2 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div class="sm:col-span-1">
                    <label
                        for="ambientes"
                        class="block text-sm font-medium text-gray-700"
                        >Ambientes</label
                    >
                    <input
                        type="number"
                        id="ambientes"
                        bind:value={formData.caracteristicas.ambientes}
                        class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                    />
                </div>

                <div class="sm:col-span-1">
                    <label
                        for="dormitorios"
                        class="block text-sm font-medium text-gray-700"
                        >Dormitorios</label
                    >
                    <input
                        type="number"
                        id="dormitorios"
                        bind:value={formData.caracteristicas.dormitorios}
                        class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                    />
                </div>

                <div class="sm:col-span-1">
                    <label
                        for="banios"
                        class="block text-sm font-medium text-gray-700"
                        >Baños</label
                    >
                    <input
                        type="number"
                        id="banios"
                        bind:value={formData.caracteristicas.banios}
                        class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                    />
                </div>

                <div class="sm:col-span-1">
                    <label
                        for="cocheras"
                        class="block text-sm font-medium text-gray-700"
                        >Cocheras</label
                    >
                    <input
                        type="number"
                        id="cocheras"
                        bind:value={formData.caracteristicas.cocheras}
                        class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                    />
                </div>

                <div class="sm:col-span-1">
                    <label
                        for="sup_total"
                        class="block text-sm font-medium text-gray-700"
                        >Sup. Total (m2)</label
                    >
                    <input
                        type="number"
                        id="sup_total"
                        bind:value={formData.caracteristicas.superficie_total}
                        class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                    />
                </div>

                <div class="sm:col-span-1">
                    <label
                        for="sup_cubierta"
                        class="block text-sm font-medium text-gray-700"
                        >Sup. Cubierta (m2)</label
                    >
                    <input
                        type="number"
                        id="sup_cubierta"
                        bind:value={
                            formData.caracteristicas.superficie_cubierta
                        }
                        class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                    />
                </div>
            </div>
        </div>

        <!-- Amenities -->
        <div class="pt-8">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
                Amenities y Extras
            </h3>
            <div class="mt-6 grid grid-cols-2 gap-y-4 gap-x-4 sm:grid-cols-4">
                {#each [{ id: "aire_acondicionado", label: "Aire Acondicionado" }, { id: "cochera", label: "Cochera" }, { id: "gimnasio", label: "Gimnasio" }, { id: "lavadero", label: "Lavadero" }, { id: "parrilla", label: "Parrilla" }, { id: "patio", label: "Patio" }, { id: "pileta", label: "Pileta" }, { id: "quincho", label: "Quincho" }, { id: "sala_de_juegos", label: "Sala de juegos" }, { id: "spa", label: "Spa" }, { id: "sum", label: "SUM" }] as amenity}
                    <div class="relative flex items-start">
                        <div class="flex items-center h-5">
                            <input
                                id={amenity.id}
                                type="checkbox"
                                bind:checked={
                                    formData.caracteristicas[amenity.id]
                                }
                                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                        </div>
                        <div class="ml-3 text-sm">
                            <label
                                for={amenity.id}
                                class="font-medium text-gray-700"
                                >{amenity.label}</label
                            >
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>

    <!-- Actions -->
    <div class="pt-5">
        {#if message.text}
            <div
                class={`p-4 mb-4 rounded-md ${message.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
            >
                {message.text}
            </div>
        {/if}

        <div class="flex justify-between">
            <div>
                {#if id}
                    <button
                        type="button"
                        on:click={handleDelete}
                        disabled={loading}
                        class="bg-red-50 py-2 px-4 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                        Eliminar Propiedad
                    </button>
                {/if}
            </div>

            <div class="flex justify-end">
                <button
                    type="button"
                    on:click={handleCancel}
                    class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {loading ? "Guardando..." : "Guardar Propiedad"}
                </button>
            </div>
        </div>
    </div>
</form>
