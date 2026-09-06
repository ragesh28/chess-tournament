<script>
  import { toast } from '../lib/stores.js';
  import AppIcon from './AppIcon.svelte';
</script>

{#if $toast}
  <div class="toast-container">
    <div class="toast-card toast-{$toast.type}">
      <div class="toast-icon">
        {#if $toast.type === 'success'}
          <AppIcon name="check" />
        {:else if $toast.type === 'danger'}
          <AppIcon name="alert" />
        {:else}
          <AppIcon name="info" />
        {/if}
      </div>
      <div class="toast-message">{$toast.message}</div>
      <button class="toast-close" on:click={() => toast.set(null)} aria-label="Close notification"><AppIcon name="close" /></button>
    </div>
  </div>
{/if}

<style>
  .toast-container {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 1000;
    animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .toast-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.25rem;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    font-size: 0.875rem;
    font-weight: 500;
    max-width: 420px;
    backdrop-filter: blur(8px);
  }

  .toast-success {
    background-color: #064e3b;
    color: #a7f3d0;
    border: 1px solid #059669;
  }

  .toast-danger {
    background-color: #7f1d1d;
    color: #fecaca;
    border: 1px solid #dc2626;
  }

  .toast-info {
    background-color: #1e1b4b;
    color: #c7d2fe;
    border: 1px solid #4f46e5;
  }

  .toast-icon {
    font-size: 1.1rem;
    line-height: 1;
  }

  .toast-message {
    flex: 1;
  }

  .toast-close {
    background: transparent;
    border: none;
    color: inherit;
    opacity: 0.7;
    cursor: pointer;
    font-size: 0.875rem;
    padding: 0.2rem;
  }

  .toast-close:hover {
    opacity: 1;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
