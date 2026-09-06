<script>
  import {
    activeTournament,
    activeTournamentMatches,
    players,
    currentTab,
    isSimulating,
    TournamentActions
  } from '../lib/stores.js';
  import MatchCard from './MatchCard.svelte';
  import Podium from './Podium.svelte';
  import Modal from './Modal.svelte';
  import AppIcon from './AppIcon.svelte';

  let selectedPlayerToAdd = '';
  let isResetModalOpen = false;

  $: playerMap = new Map($players.map(p => [p.id, p]));

  // Available players (not yet enrolled in this tournament)
  $: availablePlayers = $activeTournament
    ? $players.filter(p => !$activeTournament.playerIds.includes(p.id))
    : [];

  // Enrolled players objects
  $: enrolledPlayers = $activeTournament
    ? $activeTournament.playerIds.map(id => playerMap.get(id)).filter(Boolean)
    : [];

  function handleEnroll() {
    if (!selectedPlayerToAdd) return;
    try {
      TournamentActions.addPlayer($activeTournament.id, selectedPlayerToAdd);
      selectedPlayerToAdd = '';
    } catch (err) {
      // Error handled by store toast
    }
  }

  function handleRemove(playerId) {
    try {
      TournamentActions.removePlayer($activeTournament.id, playerId);
    } catch (err) {
      // Error handled by store toast
    }
  }

  function handleStart() {
    try {
      TournamentActions.startTournament($activeTournament.id);
    } catch (err) {
      // Error handled by store toast
    }
  }

  async function handleSimulateAll() {
    await TournamentActions.simulateAllMatches($activeTournament.id);
  }

  function confirmReset() {
    TournamentActions.resetTournament($activeTournament.id);
    isResetModalOpen = false;
  }
</script>

{#if !$activeTournament}
  <div class="card empty-container">
    <AppIcon name="trophy" className="empty-icon" />
    <h3>No Tournament Selected</h3>
    <p class="text-secondary text-sm">Please select a tournament from the directory to manage.</p>
    <button class="btn btn-primary" on:click={() => currentTab.set('tournaments')}>
      <AppIcon name="arrow-left" />
      <span>Go to Tournaments</span>
    </button>
  </div>
{:else}
  <div class="tournament-hub">
    <!-- Top Breadcrumb & Hero Header -->
    <div class="hub-header card">
      <div class="header-left">
        <button class="back-link" on:click={() => currentTab.set('tournaments')}>
          <AppIcon name="arrow-left" />
          <span>Back to Tournaments</span>
        </button>
        <div class="title-row">
          <AppIcon name="trophy" className="trophy-icon" />
          <h2>{$activeTournament.title}</h2>
          <span class="badge badge-{$activeTournament.status}">
            {$activeTournament.status.replace('_', ' ')}
          </span>
        </div>
        <div class="header-meta text-secondary text-sm">
          <span>{enrolledPlayers.length} Participants Enrolled</span>
          <span>•</span>
          <span>Created on {new Date($activeTournament.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
        </div>
      </div>

      <div class="header-controls">
        {#if $activeTournament.status === 'draft'}
          <button
            class="btn btn-success btn-lg"
            on:click={handleStart}
            disabled={enrolledPlayers.length < 2}
          >
            <AppIcon name="play" />
            <span>Start & Generate Pairings</span>
          </button>
        {:else}
          <button
            class="btn btn-primary btn-lg"
            on:click={handleSimulateAll}
            disabled={$isSimulating || $activeTournamentMatches.every(m => m.isCompleted)}
          >
            {#if $isSimulating}
              <AppIcon name="timer" className="spinner" />
              <span>Simulating Outcomes...</span>
            {:else if $activeTournamentMatches.every(m => m.isCompleted)}
              <AppIcon name="check" />
              <span>Simulation Complete</span>
            {:else}
              <AppIcon name="spark" />
              <span>Simulate All Matches</span>
            {/if}
          </button>
          <button class="btn btn-secondary" on:click={() => (isResetModalOpen = true)}>
            <AppIcon name="reset" />
            <span>Reset Event</span>
          </button>
        {/if}
      </div>
    </div>

    <!-- SECTION 1: Registered Participants & Enrollment -->
    <div class="card section-card">
      <div class="section-header-row">
        <div>
          <h3>1. Registered Competitors ({enrolledPlayers.length})</h3>
          <p class="text-secondary text-sm">
            {#if $activeTournament.status === 'draft'}
              Select players from your roster to participate. At least 2 players are required to begin.
            {:else}
              Participant roster is locked while this tournament round is active.
            {/if}
          </p>
        </div>
      </div>

      {#if $activeTournament.status === 'draft'}
        <div class="enrollment-bar">
          <select class="form-control enrollment-select" bind:value={selectedPlayerToAdd}>
            <option value="">-- Select an available player from master roster --</option>
            {#each availablePlayers as player (player.id)}
              <option value={player.id}>{player.name}</option>
            {/each}
          </select>
          <button
            class="btn btn-primary"
            on:click={handleEnroll}
            disabled={!selectedPlayerToAdd}
          >
            <AppIcon name="plus" />
            <span>Enroll Player</span>
          </button>
        </div>
      {/if}

      <div class="chips-container">
        {#if enrolledPlayers.length === 0}
          <div class="empty-chips-box">
            <span class="text-muted text-sm">No players enrolled yet. Choose players above to register.</span>
          </div>
        {:else}
          {#each enrolledPlayers as player (player.id)}
            <div class="player-chip">
              <AppIcon name="piece" className="chip-icon" />
              <span class="chip-name">{player.name}</span>
              {#if $activeTournament.status === 'draft'}
                <button
                  class="chip-remove-btn"
                  on:click={() => handleRemove(player.id)}
                  title="Remove from tournament"
                >
                  <AppIcon name="close" />
                </button>
              {/if}
            </div>
          {/each}
        {/if}
      </div>
    </div>

    <!-- SECTION 2 & 3: Match Simulation -->
    {#if $activeTournamentMatches.length > 0}
      <div class="card section-card matches-container">
        <div class="simulation-notice-banner">
          <AppIcon name="dice" className="notice-icon" />
          <div class="notice-text">
            <strong>Random Match Simulation Engine</strong>
            <p class="text-secondary text-sm">
              Pairings are formed using the Fisher-Yates shuffle algorithm. Outcomes are simulated with unbiased 50/50 probability. No board moves or chess engine required.
            </p>
          </div>
        </div>

        <div class="section-header-row">
          <div>
            <h3>2. Head-to-Head Matchups (Round 1)</h3>
            <p class="text-secondary text-sm">
              Simulate individual pairings below or use "Simulate All Matches" above.
            </p>
          </div>
          <div class="round-status-pill">
            <span class="text-secondary text-sm">
              Matches Resolved: <strong>{$activeTournamentMatches.filter(m => m.isCompleted).length} / {$activeTournamentMatches.length}</strong>
            </span>
          </div>
        </div>

        <div class="matches-grid">
          {#each $activeTournamentMatches as match (match.id)}
            <MatchCard {match} />
          {/each}
        </div>
      </div>

      <!-- SECTION 4: Rankings & Podium -->
      <div class="section-card">
        <Podium />
      </div>
    {/if}
  </div>
{/if}

<!-- Reset Tournament Confirmation Modal -->
<Modal title="Confirm Tournament Reset" isOpen={isResetModalOpen} on:close={() => (isResetModalOpen = false)}>
  <div>
    <p>Are you sure you want to reset <strong>"{$activeTournament ? $activeTournament.title : ''}"</strong> back to Draft status?</p>
    <p class="text-secondary text-sm" style="margin-top: 0.5rem;">
      All match pairings, simulated results, and podium standings for this event will be cleared. Enrolled players will remain registered.
    </p>

    <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
      <button type="button" class="btn btn-secondary" on:click={() => (isResetModalOpen = false)}>
        Cancel
      </button>
      <button type="button" class="btn btn-danger" on:click={confirmReset}>
        Reset Tournament
      </button>
    </div>
  </div>
</Modal>

<style>
  .tournament-hub {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .hub-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
    background: linear-gradient(135deg, #131b2e 0%, #16223d 100%);
    border: 1px solid rgba(99, 102, 241, 0.25);
    padding: 1.75rem;
  }

  .header-left {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .back-link {
    background: transparent;
    border: none;
    color: var(--primary);
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
    text-align: left;
    padding: 0;
    margin-bottom: 0.25rem;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }

  .back-link:hover {
    text-decoration: underline;
  }

  .title-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .trophy-icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  .header-meta {
    display: flex;
    align-items: center;
    gap: 0.625rem;
  }

  .header-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .btn-lg {
    padding: 0.75rem 1.35rem;
    font-size: 0.9375rem;
  }

  .section-card {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .section-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .enrollment-bar {
    display: flex;
    gap: 0.75rem;
    max-width: 600px;
    flex-wrap: wrap;
  }

  .enrollment-select {
    flex: 1;
    min-width: 260px;
  }

  .chips-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .empty-chips-box {
    padding: 1rem 0;
  }

  .player-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background-color: var(--bg-main);
    border: 1px solid var(--border-color);
    padding: 0.4rem 0.85rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    transition: border-color 0.15s ease;
  }

  .player-chip:hover {
    border-color: var(--primary);
  }

  .chip-icon {
    color: var(--primary);
    width: 0.95rem;
    height: 0.95rem;
  }

  .chip-name {
    font-weight: 600;
    color: var(--text-primary);
  }

  .chip-remove-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-size: 0.75rem;
    cursor: pointer;
    padding: 0.1rem 0.3rem;
    border-radius: 50%;
  }

  .chip-remove-btn:hover {
    color: var(--danger);
  }

  /* Simulation Notice Banner */
  .simulation-notice-banner {
    display: flex;
    align-items: flex-start;
    gap: 0.875rem;
    background-color: rgba(99, 102, 241, 0.08);
    border: 1px solid rgba(99, 102, 241, 0.25);
    border-radius: var(--radius-sm);
    padding: 1rem 1.25rem;
  }

  .notice-icon {
    width: 1.4rem;
    height: 1.4rem;
  }

  .matches-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.25rem;
  }

  .spinner {
    display: inline-block;
    animation: spin 1s infinite linear;
  }

  .empty-container {
    text-align: center;
    padding: 4rem 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  .empty-icon {
    width: 3rem;
    height: 3rem;
    opacity: 0.4;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .text-sm {
    font-size: 0.8125rem;
  }
</style>
