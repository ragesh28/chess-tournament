<script>
  export let name = 'spark';
  export let size = '1em';
  export let label = '';
  export let className = '';
</script>

<svg
  class="app-icon {className}"
  style={`--icon-size: ${size}`}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.8"
  stroke-linecap="round"
  stroke-linejoin="round"
  role={label ? 'img' : 'presentation'}
  aria-label={label || undefined}
  aria-hidden={label ? undefined : 'true'}
>
  {#if name === 'dashboard'}
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.2" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.2" /><path d="M14 20.5v-4m3.25 4v-7m3.25 7v-10" />
  {:else if name === 'player'}
    <circle cx="12" cy="8" r="3.5" /><path d="M4.5 20c.9-4 3.4-6 7.5-6s6.6 2 7.5 6" />
  {:else if name === 'trophy'}
    <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" /><path d="M8 6H4.5v1.5A3.5 3.5 0 0 0 8 11m8-5h3.5v1.5A3.5 3.5 0 0 1 16 11M12 13v4m-4 3h8M9 17h6" />
  {:else if name === 'spark'}
    <path d="m13 2-8 12h6l-1 8 9-13h-6l0-7Z" />
  {:else if name === 'dice'}
    <rect x="3.5" y="3.5" width="17" height="17" rx="3" /><circle cx="8" cy="8" r=".7" fill="currentColor" /><circle cx="16" cy="8" r=".7" fill="currentColor" /><circle cx="12" cy="12" r=".7" fill="currentColor" /><circle cx="8" cy="16" r=".7" fill="currentColor" /><circle cx="16" cy="16" r=".7" fill="currentColor" />
  {:else if name === 'plus'}
    <circle cx="12" cy="12" r="8.5" /><path d="M12 8v8m-4-4h8" />
  {:else if name === 'search'}
    <circle cx="10.5" cy="10.5" r="5.5" /><path d="m15 15 4.5 4.5" />
  {:else if name === 'edit'}
    <path d="m4 17.5-.5 3 3-.5L18 8.5 15.5 6 4 17.5Z" /><path d="m14.5 7 2.5 2.5M4 20l2.5-2.5" />
  {:else if name === 'trash'}
    <path d="M5 7h14m-9-3h4m-7 3 1 13h8l1-13M10 11v5m4-5v5" />
  {:else if name === 'shield'}
    <path d="M12 3.5 19 6v5c0 4.6-3 7.7-7 9.5-4-1.8-7-4.9-7-9.5V6l7-2.5Z" /><path d="m8.5 12 2.1 2.1 4.9-5" />
  {:else if name === 'piece'}
    <circle cx="12" cy="6.5" r="2.5" /><path d="M8.5 15.5 10 10h4l1.5 5.5M7 20h10M9 17h6" />
  {:else if name === 'arrow-left'}
    <path d="m11 5-7 7 7 7M4 12h16" />
  {:else if name === 'play'}
    <circle cx="12" cy="12" r="8.5" /><path d="m10 8.5 5.5 3.5-5.5 3.5v-7Z" fill="currentColor" stroke="none" />
  {:else if name === 'reset'}
    <path d="M19 8V4l-2 2a7.5 7.5 0 1 0 2.2 8.2" /><path d="M19 4h-4" />
  {:else if name === 'close'}
    <path d="m7 7 10 10M17 7 7 17" />
  {:else if name === 'timer'}
    <circle cx="12" cy="13" r="7" /><path d="M9 3h6m-3 3V4m0 9 3-2" />
  {:else if name === 'check'}
    <circle cx="12" cy="12" r="8.5" /><path d="m8.5 12 2.4 2.4 4.8-5" />
  {:else if name === 'alert'}
    <path d="M12 3.5 21 20H3l9-16.5Z" /><path d="M12 9v4m0 3h.01" />
  {:else if name === 'info'}
    <circle cx="12" cy="12" r="8.5" /><path d="M12 11v5m0-8h.01" />
  {:else if name === 'folder'}
    <path d="M3.5 7.5h6l1.6 2H20.5v9.5H3.5v-11.5Z" />
  {:else if name === 'medal'}
    <circle cx="12" cy="14" r="5" /><path d="m8.5 4 3.5 5 3.5-5M12 11.5l.8 1.7 1.9.2-1.4 1.3.4 1.9-1.7-.9-1.7.9.4-1.9-1.4-1.3 1.9-.2.8-1.7Z" />
  {:else}
    <circle cx="12" cy="12" r="8.5" /><path d="m9 12 2 2 4-4" />
  {/if}
</svg>

<style>
  .app-icon { width: var(--icon-size); height: var(--icon-size); display: inline-block; flex: 0 0 auto; vertical-align: -0.16em; }
</style>
