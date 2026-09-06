<script>
  import { createEventDispatcher } from 'svelte';
  import AppIcon from './AppIcon.svelte';

  export let title = 'Modal Dialog';
  export let isOpen = false;

  const dispatch = createEventDispatcher();

  function close() {
    dispatch('close');
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      close();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
  <div
    class="modal-backdrop"
    on:click|self={close}
    on:keydown|self={(e) => e.key === 'Escape' && close()}
    role="presentation"
  >
    <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title-id">
      <div class="modal-header">
        <h3 id="modal-title-id" class="modal-title">{title}</h3>
        <button class="modal-close-btn" on:click={close} aria-label="Close modal"><AppIcon name="close" /></button>
      </div>

      <div class="modal-body">
        <slot />
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(7, 10, 19, 0.75);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    padding: 1.5rem;
    animation: fadeIn 0.15s ease-out;
  }

  .modal-box {
    background-color: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    width: 100%;
    max-width: 480px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
    background-color: var(--bg-card-alt);
  }

  .modal-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .modal-close-btn {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 1.1rem;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-sm);
    transition: all 0.15s ease;
  }

  .modal-close-btn:hover {
    color: var(--text-primary);
    background-color: var(--bg-card-hover);
  }

  .modal-body {
    padding: 1.5rem;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.96);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>
