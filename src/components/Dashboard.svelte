<script>
  import {
    dashboardStats,
    tournaments,
    players,
    currentTab,
    activeTournamentId,
    seedSampleData
  } from '../lib/stores.js';
  import AppIcon from './AppIcon.svelte';

  function openTournament(id) {
    activeTournamentId.set(id);
    currentTab.set('tournament-detail');
  }
</script>

<div class="dashboard-view">
  <!-- Hero Section -->
  <div class="hero-banner card">
    <div class="hero-content">
      <div class="hero-badge">CHESS TOURNAMENT OPERATIONS</div>
      <h2>Executive Tournament Dashboard</h2>
      <p class="text-secondary">
        Manage participants, organize tournament brackets, run unbiased random match simulations, and compute podium standings.
      </p>
    </div>
    <div class="hero-actions">
      <button class="btn btn-primary" on:click={() => currentTab.set('tournaments')}>
        <AppIcon name="trophy" />
        <span>Tournaments Hub</span>
      </button>
      <button class="btn btn-secondary" on:click={() => currentTab.set('players')}>
        <AppIcon name="player" />
        <span>Manage Players</span>
      </button>
    </div>
  </div>

  <!-- 4-Column KPI Metric Grid -->
  <div class="stats-grid">
    <!-- Stat 1: Total Players -->
    <div class="card stat-card">
      <div class="stat-header">
        <span class="stat-title">TOTAL PLAYERS</span>
        <div class="stat-icon-wrapper icon-indigo"><AppIcon name="player" /></div>
      </div>
      <div class="stat-value">{$dashboardStats.totalPlayers}</div>
      <div class="stat-footer text-secondary">
        <span>Registered in Master Roster</span>
      </div>
    </div>

    <!-- Stat 2: Total Tournaments -->
    <div class="card stat-card">
      <div class="stat-header">
        <span class="stat-title">TOURNAMENTS</span>
        <div class="stat-icon-wrapper icon-amber"><AppIcon name="trophy" /></div>
      </div>
      <div class="stat-value">{$dashboardStats.totalTournaments}</div>
      <div class="stat-footer text-secondary">
        <span>{$dashboardStats.activeTourneys} Active • {$dashboardStats.completedTourneys} Completed</span>
      </div>
    </div>

    <!-- Stat 3: Active Event -->
    <div class="card stat-card">
      <div class="stat-header">
        <span class="stat-title">ACTIVE TOURNAMENT</span>
        <div class="stat-icon-wrapper icon-emerald"><AppIcon name="spark" /></div>
      </div>
      <div class="stat-value stat-truncate" title={$dashboardStats.activeTournamentTitle}>
        {$dashboardStats.activeTournamentTitle}
      </div>
      <div class="stat-footer">
        {#if $dashboardStats.activeTournamentStatus === 'in_progress'}
          <span class="badge badge-in_progress">In Progress</span>
        {:else if $dashboardStats.activeTournamentStatus === 'completed'}
          <span class="badge badge-completed">Completed</span>
        {:else if $dashboardStats.activeTournamentStatus === 'draft'}
          <span class="badge badge-draft">Draft</span>
        {:else}
          <span class="text-muted">None Active</span>
        {/if}
      </div>
    </div>

    <!-- Stat 4: Completed Matches -->
    <div class="card stat-card">
      <div class="stat-header">
        <span class="stat-title">MATCHES SIMULATED</span>
        <div class="stat-icon-wrapper icon-purple"><AppIcon name="dice" /></div>
      </div>
      <div class="stat-value">{$dashboardStats.totalCompletedMatches}</div>
      <div class="stat-footer text-secondary">
        <span>{$dashboardStats.pendingMatches} Pending Simulation</span>
      </div>
    </div>
  </div>

  <!-- Dual Layout: Recent Events & Quick Actions -->
  <div class="dashboard-grid">
    <!-- Left: Active & Recent Events -->
    <div class="card event-list-card">
      <div class="card-header-row">
        <div>
          <h3>Recent Tournaments</h3>
          <p class="text-secondary text-sm">Jump directly into a tournament dashboard to pair or simulate.</p>
        </div>
        <button class="btn btn-secondary btn-sm" on:click={() => currentTab.set('tournaments')}>
          <span>View All ({$tournaments.length})</span>
        </button>
      </div>

      {#if $tournaments.length === 0}
        <div class="empty-box">
          <AppIcon name="trophy" className="empty-icon" />
          <p>No tournaments created yet.</p>
          <button class="btn btn-primary btn-sm" on:click={() => currentTab.set('tournaments')}>
            <span>+ Create Tournament</span>
          </button>
        </div>
      {:else}
        <div class="recent-list">
          {#each $tournaments.slice(0, 4) as tourney (tourney.id)}
            <div class="event-item">
              <div class="event-info">
                <span class="event-name">{tourney.title}</span>
                <div class="event-meta">
                  <span class="badge badge-{tourney.status}">{tourney.status.replace('_', ' ')}</span>
                  <span class="text-muted text-sm">{tourney.playerIds.length} players enrolled</span>
                </div>
              </div>
              <button class="btn btn-primary btn-sm" on:click={() => openTournament(tourney.id)}>
                <span>Open Dashboard →</span>
              </button>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Right: Quick Operational Shortcuts -->
    <div class="card shortcuts-card">
      <h3>Quick Actions</h3>
      <p class="text-secondary text-sm">Common workflows for tournament organizers.</p>

      <div class="action-buttons-list">
        <button class="action-tile" on:click={() => currentTab.set('players')}>
          <div class="tile-icon"><AppIcon name="plus" /></div>
          <div class="tile-text">
            <span class="tile-title">Register New Player</span>
            <span class="tile-desc">Add a participant to the master roster</span>
          </div>
        </button>

        <button class="action-tile" on:click={() => currentTab.set('tournaments')}>
          <div class="tile-icon"><AppIcon name="trophy" /></div>
          <div class="tile-text">
            <span class="tile-title">Create New Tournament</span>
            <span class="tile-desc">Setup a new event bracket in Draft state</span>
          </div>
        </button>

        <button class="action-tile" on:click={seedSampleData}>
          <div class="tile-icon"><AppIcon name="spark" /></div>
          <div class="tile-text">
            <span class="tile-title">Load Sample Grandmasters</span>
            <span class="tile-desc">Quick-fill Magnus, Hikaru, Ding, and Gukesh</span>
          </div>
        </button>
      </div>

      <div class="system-note">
        <AppIcon name="shield" className="note-icon" />
        <div class="note-text">
          <strong>Non-Gameplay Simulation System</strong>
          <p class="text-muted text-sm">
            This application simulates round pairings and outcomes without requiring chess boards or move engines.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .dashboard-view {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    animation: reveal-up 0.55s ease both;
  }

  .hero-banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
    position: relative;
    overflow: hidden;
    background: linear-gradient(120deg, rgba(65, 48, 27, 0.98), rgba(40, 37, 31, 0.96) 50%, rgba(35, 47, 59, 0.92));
    border: 1px solid rgba(213, 167, 77, 0.32);
    flex-wrap: wrap;
    padding: clamp(2rem, 5vw, 3.5rem);
    box-shadow: var(--shadow-lg);
  }

  .hero-banner::after { content: ''; position: absolute; right: -3.5rem; bottom: -6rem; width: 22rem; height: 22rem; opacity: 0.2; background: conic-gradient(from 45deg, rgba(243, 210, 132, 0.65) 0 25%, transparent 0 50%, rgba(243, 210, 132, 0.65) 0 75%, transparent 0); background-size: 4rem 4rem; transform: rotate(-12deg); pointer-events: none; }
  .hero-content, .hero-actions { position: relative; z-index: 1; }

  .hero-badge {
    display: inline-block;
    font-size: 0.6875rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    color: #f1ce7a;
    background-color: var(--primary-light);
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
    margin-bottom: 0.5rem;
  }

  .hero-content h2 {
    font-size: clamp(2rem, 4vw, 3.15rem);
    margin-bottom: 0.6rem;
  }

  .hero-actions {
    display: flex;
    gap: 0.75rem;
  }

  /* 4-Column Stat Cards */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1rem;
  }

  .stat-card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.25rem;
    transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
    animation: reveal-up 0.5s ease both;
  }

  .stat-card:hover {
    transform: translateY(-5px);
    border-color: var(--primary);
    box-shadow: 0 18px 38px rgba(0,0,0,.28);
  }

  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .stat-title {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: var(--text-secondary);
  }

  .stat-icon-wrapper {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-size: 1.1rem;
  }

  .icon-indigo { background: rgba(99, 102, 241, 0.15); color: var(--primary); }
  .icon-amber { background: rgba(245, 158, 11, 0.15); color: var(--warning); }
  .icon-emerald { background: rgba(16, 185, 129, 0.15); color: var(--success); }
  .icon-purple { background: rgba(168, 85, 247, 0.15); color: #c084fc; }

  .stat-value {
    font-family: var(--font-display);
    font-size: 2.25rem;
    font-weight: 800;
    color: var(--text-primary);
    line-height: 1.2;
  }

  .stat-truncate {
    font-size: 1.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .stat-footer {
    font-size: 0.8125rem;
    margin-top: 0.25rem;
  }

  /* Dual Grid */
  .dashboard-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 1.5rem;
    align-items: start;
  }

  .card-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
  }

  .recent-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .event-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--bg-main);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    padding: 0.875rem 1rem;
    gap: 1rem;
  }

  .event-info {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .event-name {
    font-weight: 700;
    color: var(--text-primary);
    font-size: 0.9375rem;
  }

  .event-meta {
    display: flex;
    align-items: center;
    gap: 0.625rem;
  }

  /* Action Tiles */
  .action-buttons-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin: 1.25rem 0;
  }

  .action-tile {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    background-color: var(--bg-main);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    padding: 0.875rem 1rem;
    text-align: left;
    cursor: pointer;
    transition: all 0.15s ease;
    color: var(--text-primary);
  }

  .action-tile:hover {
    background-color: var(--bg-card-hover);
    border-color: var(--primary);
    transform: translateX(3px);
  }

  .tile-icon {
    width: 2.25rem;
    height: 2.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.16);
    color: #ffffff;
    flex-shrink: 0;
    transition: all 0.15s ease;
  }

  .tile-icon :global(.app-icon) {
    width: 1.25rem;
    height: 1.25rem;
    color: #ffffff;
    stroke: #ffffff;
  }

  .action-tile:hover .tile-icon {
    background: rgba(255, 255, 255, 0.16);
    border-color: #ffffff;
    box-shadow: 0 0 12px rgba(255, 255, 255, 0.25);
  }

  .tile-text {
    display: flex;
    flex-direction: column;
  }

  .tile-title {
    font-weight: 700;
    color: var(--text-primary);
    font-size: 0.875rem;
  }

  .tile-desc {
    font-size: 0.75rem;
    color: var(--text-secondary);
  }

  .system-note {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    background-color: rgba(99, 102, 241, 0.08);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: var(--radius-sm);
    padding: 0.875rem;
  }

  :global(.note-icon) {
    width: 1.2rem;
    height: 1.2rem;
    color: var(--primary);
  }

  .empty-box {
    text-align: center;
    padding: 2.5rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    color: var(--text-muted);
  }

  :global(.empty-icon) {
    width: 2.5rem;
    height: 2.5rem;
    opacity: 0.4;
  }

  @media (max-width: 900px) {
    .dashboard-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
