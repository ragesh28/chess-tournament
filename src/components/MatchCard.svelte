<script>
  import { players, TournamentActions, isSimulating } from '../lib/stores.js';
  import AppIcon from './AppIcon.svelte';

  export let match;

  let isCardSimulating = false;

  $: playerMap = new Map($players.map(p => [p.id, p]));
  $: whitePlayer = playerMap.get(match.whitePlayerId) || { name: 'Player ' + match.whitePlayerId };
  $: blackPlayer = match.blackPlayerId ? (playerMap.get(match.blackPlayerId) || { name: 'Player ' + match.blackPlayerId }) : null;
  $: winner = match.winnerPlayerId ? playerMap.get(match.winnerPlayerId) : null;

  async function handleSimulate() {
    isCardSimulating = true;
    await new Promise(r => setTimeout(r, 450));
    TournamentActions.simulateMatch(match.id);
    isCardSimulating = false;
  }
</script>

<div class="match-card {match.isCompleted ? 'completed' : 'pending'} {match.isBye ? 'bye-card' : ''}">
  <!-- Match Card Header -->
  <div class="match-header">
    <div class="match-badge">
      <span class="badge-round">ROUND {match.round || 1}</span>
      <span class="badge-num">MATCH #{match.matchNumber || 1}</span>
    </div>

    {#if match.isBye}
      <span class="badge badge-draft">AUTOMATIC BYE</span>
    {:else if match.isCompleted}
      <span class="badge badge-completed"><AppIcon name="check" /> SIMULATION COMPLETE</span>
    {:else if isCardSimulating || $isSimulating}
      <span class="badge badge-in_progress">SIMULATING...</span>
    {:else}
      <span class="badge badge-in_progress">PENDING SIMULATION</span>
    {/if}
  </div>

  <!-- Head to Head Matchup -->
  <div class="matchup-box">
    <!-- White Player Row -->
    <div class="player-slot {match.winnerPlayerId === match.whitePlayerId ? 'winner-slot' : ''}">
      <div class="player-identity">
        <AppIcon name="piece" className="piece-indicator white-piece" />
        <div class="player-names-box">
          <span class="player-display-name">{whitePlayer.name}</span>
          <span class="player-side text-muted">White</span>
        </div>
      </div>

      <div class="score-outcome">
        {#if match.isCompleted}
          <span class="score-digit {match.winnerPlayerId === match.whitePlayerId ? 'score-win' : 'score-loss'}">
            {match.winnerPlayerId === match.whitePlayerId ? '1' : '0'}
          </span>
        {:else}
          <span class="score-digit text-muted">-</span>
        {/if}
      </div>
    </div>

    <!-- Center VS Divider -->
    <div class="vs-bar">
      <div class="vs-line"></div>
      <span class="vs-text">VS</span>
      <div class="vs-line"></div>
    </div>

    <!-- Black Player Row -->
    <div class="player-slot {match.winnerPlayerId === match.blackPlayerId ? 'winner-slot' : ''}">
      {#if match.isBye}
        <div class="player-identity">
          <AppIcon name="piece" className="piece-indicator black-piece" />
          <div class="player-names-box">
            <span class="player-display-name text-muted italic">No Opponent (Bye Round)</span>
            <span class="player-side text-muted">Automatic Advancement</span>
          </div>
        </div>
        <div class="score-outcome">
          <span class="score-digit score-bye">+1</span>
        </div>
      {:else}
        <div class="player-identity">
          <AppIcon name="piece" className="piece-indicator black-piece" />
          <div class="player-names-box">
            <span class="player-display-name">{blackPlayer ? blackPlayer.name : 'Unknown'}</span>
            <span class="player-side text-muted">Black</span>
          </div>
        </div>

        <div class="score-outcome">
          {#if match.isCompleted}
            <span class="score-digit {match.winnerPlayerId === match.blackPlayerId ? 'score-win' : 'score-loss'}">
              {match.winnerPlayerId === match.blackPlayerId ? '1' : '0'}
            </span>
          {:else}
            <span class="score-digit text-muted">-</span>
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <!-- Winner Banner or Action Footer -->
  <div class="match-footer">
    {#if !match.isCompleted}
      <button
        class="btn btn-primary btn-sm"
        on:click={handleSimulate}
        disabled={isCardSimulating || $isSimulating}
        style="width: 100%;"
      >
        {#if isCardSimulating || $isSimulating}
          <AppIcon name="dice" />
          <span>Simulating Outcome...</span>
        {:else}
          <AppIcon name="dice" />
          <span>Simulate Match Outcome</span>
        {/if}
      </button>
    {:else}
      <div class="winner-announcement">
        <span class="winner-label"><AppIcon name="trophy" /> WINNER:</span>
        <strong class="winner-name">{winner ? winner.name : 'Completed'}</strong>
        <span class="points-awarded">(+1 Point)</span>
      </div>
    {/if}
  </div>
</div>

<style>
  .match-card {
    background-color: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    box-shadow: var(--shadow-sm);
    transition: all 0.2s ease;
  }

  .match-card:hover {
    border-color: rgba(99, 102, 241, 0.4);
    box-shadow: var(--shadow-md);
  }

  .match-card.completed {
    border-color: rgba(16, 185, 129, 0.25);
    background: linear-gradient(180deg, var(--bg-card) 0%, rgba(16, 185, 129, 0.03) 100%);
  }

  .match-card.bye-card {
    border-style: dashed;
  }

  .match-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border-color);
  }

  .match-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .badge-round {
    font-size: 0.6875rem;
    font-weight: 800;
    color: var(--primary);
    background-color: var(--primary-light);
    padding: 0.15rem 0.45rem;
    border-radius: 4px;
    letter-spacing: 0.05em;
  }

  .badge-num {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-secondary);
  }

  /* Matchup Box */
  .matchup-box {
    display: flex;
    flex-direction: column;
    background-color: var(--bg-main);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  .player-slot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    transition: background-color 0.15s ease;
  }

  .player-slot.winner-slot {
    background-color: rgba(16, 185, 129, 0.12);
  }

  .player-identity {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  :global(.piece-indicator) {
    width: 1.15rem;
    height: 1.15rem;
    line-height: 1;
  }

  .player-names-box {
    display: flex;
    flex-direction: column;
  }

  .player-display-name {
    font-weight: 700;
    font-size: 0.9375rem;
    color: var(--text-primary);
  }

  .player-side {
    font-size: 0.6875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .vs-bar {
    display: flex;
    align-items: center;
    padding: 0 1rem;
    gap: 0.5rem;
    background-color: var(--bg-card-alt);
    height: 22px;
  }

  .vs-line {
    flex: 1;
    height: 1px;
    background-color: var(--border-color);
  }

  .vs-text {
    font-size: 0.625rem;
    font-weight: 800;
    color: var(--text-muted);
    letter-spacing: 0.1em;
  }

  .score-outcome {
    display: flex;
    align-items: center;
  }

  .score-digit {
    font-size: 1.125rem;
    font-weight: 800;
    min-width: 24px;
    text-align: right;
  }

  .score-win {
    color: var(--success);
  }

  .score-loss {
    color: var(--text-muted);
    opacity: 0.6;
  }

  .score-bye {
    color: var(--primary);
  }

  .winner-announcement {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background-color: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: var(--radius-sm);
    padding: 0.5rem;
    font-size: 0.8125rem;
  }

  .winner-label {
    font-weight: 800;
    color: var(--success);
  }

  .winner-name {
    color: #ffffff;
  }

  .points-awarded {
    color: var(--success);
    font-size: 0.75rem;
  }

  .italic {
    font-style: italic;
  }
</style>
