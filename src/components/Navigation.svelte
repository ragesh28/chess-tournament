<script>
  import { currentTab, activeTournament, seedSampleData, resetSystemData, players, tournaments } from '../lib/stores.js';
  import ArenaMark from './ArenaMark.svelte';
  import AppIcon from './AppIcon.svelte';

  function handleSeed() {
    if (confirm('Load 6 Grandmaster players and a sample tournament for testing?')) {
      seedSampleData();
    }
  }

  function handleReset() {
    if (confirm('Are you sure you want to clear all local data? This cannot be undone.')) {
      resetSystemData();
    }
  }
</script>

<header class="navbar">
  <div class="navbar-container">
    <!-- Brand with Big Pure White Chess Logo -->
    <button type="button" class="brand-btn" on:click={() => currentTab.set('dashboard')}>
      <div class="logo-wrapper">
        <ArenaMark className="arena-logo" />
      </div>
      <div class="brand-text">
        <div class="brand-name-row">
          <span class="brand-name">CHESS ARENA</span>
          <span class="brand-badge">PRO</span>
        </div>
        <span class="brand-sub">Tournament Director</span>
      </div>
    </button>

    <!-- Navigation Tabs -->
    <nav class="nav-links">
      <button
        class="nav-tab {$currentTab === 'dashboard' ? 'active' : ''}"
        on:click={() => currentTab.set('dashboard')}
      >
        <AppIcon name="dashboard" className="tab-icon" />
        <span>Dashboard</span>
      </button>

      <button
        class="nav-tab {$currentTab === 'players' ? 'active' : ''}"
        on:click={() => currentTab.set('players')}
      >
        <AppIcon name="player" className="tab-icon" />
        <span>Players</span>
        <span class="count-pill">{$players.length}</span>
      </button>

      <button
        class="nav-tab {$currentTab === 'tournaments' ? 'active' : ''}"
        on:click={() => currentTab.set('tournaments')}
      >
        <AppIcon name="trophy" className="tab-icon" />
        <span>Tournaments</span>
        <span class="count-pill">{$tournaments.length}</span>
      </button>

      {#if $activeTournament}
        <button
          class="nav-tab tab-active-event {$currentTab === 'dashboard' ? '' : ($currentTab === 'tournaments' ? '' : 'active')}"
          on:click={() => currentTab.set('tournaments')}
          title="Active Tournament: {$activeTournament.title}"
        >
          <span class="event-indicator">●</span>
          <span class="event-title">{$activeTournament.title}</span>
        </button>
      {/if}
    </nav>

    <!-- Quick Utilities -->
    <div class="nav-actions">
      <button
        class="btn btn-secondary btn-sm"
        on:click={handleSeed}
        title="Load Grandmaster players and test tournament"
      >
        <AppIcon name="spark" />
        <span>Demo Data</span>
      </button>
      <button
        class="btn btn-ghost btn-sm text-danger"
        on:click={handleReset}
        title="Clear all stored data"
      >
        <span>Reset Data</span>
      </button>
    </div>
  </div>
</header>

<style>
  .navbar {
    background: rgba(17, 16, 14, 0.78);
    border-bottom: 1px solid var(--border-color);
    padding: 0.85rem 0;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.16);
    backdrop-filter: blur(18px);
  }

  .navbar-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  /* Big White Chess Logo Styling */
  .brand-btn {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-sm);
    transition: transform 0.15s ease;
    text-align: left;
  }

  .brand-btn:hover {
    transform: translateY(-1px);
  }

  .logo-wrapper {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #e5c06b, #936326);
    border: 1px solid rgba(255, 224, 150, 0.55);
    border-radius: 12px;
    box-shadow: 0 8px 22px rgba(184, 128, 36, 0.27);
  }

  .arena-logo {
    width: 32px;
    height: 32px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.45));
  }

  .brand-text {
    display: flex;
    flex-direction: column;
  }

  .brand-name-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .brand-name {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: 0.05em;
    color: #ffffff;
  }

  .brand-badge {
    background-color: rgba(213, 167, 77, 0.16);
    color: #edca7a;
    border: 1px solid rgba(213, 167, 77, 0.3);
    font-size: 0.625rem;
    font-weight: 800;
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
    letter-spacing: 0.05em;
  }

  .brand-sub {
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-weight: 500;
  }

  /* Navigation Links */
  .nav-links {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .nav-tab {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-secondary);
    background: transparent;
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .nav-tab:hover {
    color: var(--text-primary);
    background-color: var(--bg-card-hover);
  }

  .nav-tab.active {
    color: #1d160a;
    background: linear-gradient(135deg, #e6c36f, #c7933c);
    box-shadow: 0 8px 18px rgba(184, 128, 36, 0.22);
  }

  .tab-icon {
    width: 1rem;
    height: 1rem;
  }

  .count-pill {
    background-color: rgba(255, 255, 255, 0.15);
    color: inherit;
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.1rem 0.45rem;
    border-radius: 9999px;
  }

  .tab-active-event {
    background-color: rgba(16, 185, 129, 0.1);
    border-color: rgba(16, 185, 129, 0.25);
    color: #a7f3d0;
    max-width: 180px;
  }

  .event-indicator {
    color: var(--success);
    font-size: 0.75rem;
    animation: pulse 2s infinite;
  }

  .event-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Quick Utilities */
  .nav-actions {
    display: flex;
    align-items: center;
    gap: 0.625rem;
  }

  .btn-ghost {
    background: transparent;
    border: 1px solid transparent;
    color: var(--text-secondary);
  }

  .btn-ghost:hover {
    background-color: rgba(239, 68, 68, 0.1);
    color: #fca5a5;
  }

  .text-danger {
    color: #f87171;
  }

  @keyframes pulse {
    0% { opacity: 0.5; }
    50% { opacity: 1; }
    100% { opacity: 0.5; }
  }

  @media (max-width: 880px) {
    .navbar-container {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    .nav-links {
      width: 100%;
      overflow-x: auto;
      padding-bottom: 0.25rem;
    }
    .nav-actions {
      width: 100%;
      justify-content: flex-end;
    }
  }
</style>
