<script>
  export let className = '';
  export let title = 'Chess Arena';
</script>

<svg
  class={className}
  viewBox="0 0 84 84"
  role="img"
  aria-label={title}
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    <linearGradient id="arena-mark-gold" x1="10" y1="8" x2="72" y2="76" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F6D98A" />
      <stop offset="1" stop-color="#B77A2C" />
    </linearGradient>
  </defs>
  <path d="M42 5 77 25v34L42 79 7 59V25L42 5Z" fill="#1A1814" stroke="url(#arena-mark-gold)" stroke-width="3" />
  <path d="M42 14 67 28v28L42 70 17 56V28L42 14Z" fill="none" stroke="#EBD18A" stroke-opacity=".25" stroke-width="1.5" />
  <path d="m27 54 15-31 15 31h-8.2L42 39.3 35.2 54H27Z" fill="url(#arena-mark-gold)" />
  <path d="M30 59h24" stroke="#F6D98A" stroke-width="4" stroke-linecap="round" />
  <circle cx="64" cy="20" r="3" fill="#F6D98A" />
</svg>
