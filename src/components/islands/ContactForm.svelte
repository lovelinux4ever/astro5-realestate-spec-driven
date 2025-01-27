<script lang="ts">
  import { actions } from 'astro:actions';
  
  // Props
  export let propertyId: string;
  export let propertyTitle: string;
  
  // Logic
  let email = "";
  let message = "Hola, me interesa esta propiedad.";
  let status: 'idle' | 'submitting' | 'success' | 'error' = 'idle';
  
  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!email) return;
    
    status = 'submitting';
    
    // Stubbing the call to a hypothetical 'createLead' action
    // In strict adherence to prompts so far, we haven't created 'createLead' in actions/index.ts
    // We will simulate the network request behavior ROP style.
    
    setTimeout(() => {
        // Mock Success
        // const result = await actions.createLead({ propertyId, email, message });
        console.log(`Lead created for ${propertyId} from ${email}`);
        
        status = 'success';
        email = "";
    }, 1000);
  }
</script>

<form on:submit={handleSubmit} class="bg-gray-50 p-6 rounded-xl border border-gray-100">
  <h4 class="text-md font-bold text-gray-900 mb-4">Consultar por esta propiedad</h4>
  <p class="text-sm text-gray-500 mb-4">
    Interesado en: <strong>{propertyTitle}</strong>
  </p>
  
  <div class="space-y-4">
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Tu Email</label>
      <input 
        id="email"
        type="email" 
        bind:value={email}
        required
        disabled={status === 'submitting' || status === 'success'}
        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
      />
    </div>

    <div>
      <label for="message" class="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
      <textarea 
        id="message"
        bind:value={message}
        rows="3"
        disabled={status === 'submitting' || status === 'success'}
        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
      ></textarea>
    </div>

    <button 
      type="submit"
      disabled={status === 'submitting' || status === 'success'}
      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {#if status === 'idle'}
        Enviar Consulta
      {:else if status === 'submitting'}
        Enviando...
      {:else if status === 'success'}
        ¡Enviado!
      {:else}
        Error. Reintentar.
      {/if}
    </button>
  </div>
</form>
