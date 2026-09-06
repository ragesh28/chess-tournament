<script>
  import Navigation from './components/Navigation.svelte';
  import Dashboard from './components/Dashboard.svelte';
  import PlayerManager from './components/PlayerManager.svelte';
  import TournamentList from './components/TournamentList.svelte';
  import TournamentHub from './components/TournamentHub.svelte';
  import Toast from './components/Toast.svelte';
  import ArenaMark from './components/ArenaMark.svelte';
  import { currentTab } from './lib/stores.js';
</script>

<div class="app-layout">
  <Navigation />

  <main class="container main-content">
    {#if $currentTab === 'dashboard'}
      <Dashboard />
    {:else if $currentTab === 'players'}
      <PlayerManager />
    {:else if $currentTab === 'tournaments'}
      <TournamentList />
    {:else if $currentTab === 'tournament-detail'}
      <TournamentHub />
    {/if}
  </main>

  <footer class="app-footer">
    <div class="container footer-container">
      <div class="footer-left">
        <div class="footer-brand">
          <ArenaMark className="footer-arena-mark" />
          <span class="footer-title">CHESS ARENA</span>
          <span class="footer-sub">Tournament Management System</span>
        </div>
        <p class="text-muted text-sm" style="margin-top: 0.35rem;">
          Built for the Bytelogik Software Developer Assignment. Pure Svelte, JavaScript, Vite & LocalStorage persistence.
        </p>
      </div>

      <div class="footer-right text-sm text-secondary">
        <div class="tech-pill">No Chess Engine / Board Moves Required</div>
        <div class="tech-pill">100% Client-Side Simulation</div>
      </div>
    </div>
  </footer>

  <!-- Floating Toast Notifications -->
  <Toast />
</div>

<style>
  .app-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: transparent;
  }

  .main-content {
    flex: 1;
    padding-top: 2.75rem;
    padding-bottom: 3.5rem;
  }

  .app-footer {
    background: rgba(17, 16, 14, 0.78);
    border-top: 1px solid var(--border-color);
    padding: 2.25rem 0;
    margin-top: auto;
  }

  .footer-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
    padding-bottom: 0 !important;
  }

  .footer-left {
    display: flex;
    flex-direction: column;
    max-width: 520px;
  }

  .footer-brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .footer-arena-mark {
    width: 26px;
    height: 26px;
  }

  .footer-title {
    font-weight: 800;
    font-size: 0.9375rem;
    letter-spacing: 0.05em;
    color: #ffffff;
  }

  .footer-sub {
    font-size: 0.8125rem;
    color: var(--text-secondary);
  }

  .footer-right {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-end;
  }

  .tech-pill {
    background-color: var(--bg-main);
    border: 1px solid var(--border-color);
    padding: 0.25rem 0.625rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    color: var(--text-secondary);
  }

  .text-sm {
    font-size: 0.8125rem;
  }

  @media (max-width: 768px) {
    .footer-right {
      align-items: flex-start;
    }
  }
</style>
