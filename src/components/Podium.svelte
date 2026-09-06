<script>
  import { activeTournamentStandings } from '../lib/stores.js';
  import AppIcon from './AppIcon.svelte';

  $: firstPlace = $activeTournamentStandings.find(s => s.rank === 1) || null;
  $: secondPlace = $activeTournamentStandings.find(s => s.rank === 2) || null;
  $: thirdPlace = $activeTournamentStandings.find(s => s.rank === 3) || null;
</script>

<div class="podium-section">
  <!-- Section Title -->
  <div class="section-title-box">
    <div>
      <h3>3. Tournament Podium & Final Rankings</h3>
      <p class="text-secondary text-sm">
        Official standings dynamically calculated from simulated head-to-head match results.
      </p>
    </div>
  </div>

  {#if $activeTournamentStandings.length === 0}
    <div class="card empty-podium">
      <AppIcon name="trophy" className="empty-icon" />
      <h4>No Tournament Results Yet</h4>
      <p class="text-muted text-sm">Standings will be tabulated as soon as matches are simulated.</p>
    </div>
  {:else}
    <!-- Olympic-Style 3D Stepped Podium -->
    <div class="podium-stage">
      <!-- 2nd Place (Silver) - Positioned Left -->
      <div class="podium-pedestal step-silver">
        <div class="medal-badge-box silver-badge">
          <AppIcon name="medal" className="medal-icon silver-medal" />
          <span class="rank-title">2nd Place</span>
        </div>
        <div class="pedestal-card">
          <h4 class="competitor-name">{secondPlace ? secondPlace.playerName : 'TBD'}</h4>
          <div class="record-pill">
            <strong class="points-val">{secondPlace ? secondPlace.points : 0} Pts</strong>
            <span class="win-loss-ratio text-muted">
              ({secondPlace ? secondPlace.wins : 0}W - {secondPlace ? secondPlace.losses : 0}L)
            </span>
          </div>
          <span class="pedestal-step silver-step">2</span>
        </div>
      </div>

      <!-- 1st Place (Gold) - Positioned Center (Highest) -->
      <div class="podium-pedestal step-gold">
        <div class="crown-emblem"><AppIcon name="trophy" /> CHAMPION</div>
        <div class="medal-badge-box gold-badge">
          <AppIcon name="medal" className="medal-icon main-medal gold-medal" />
          <span class="rank-title gold-title">1st Place</span>
        </div>
        <div class="pedestal-card gold-card">
          <h4 class="competitor-name champion-text">{firstPlace ? firstPlace.playerName : 'TBD'}</h4>
          <div class="record-pill gold-pill">
            <strong class="points-val">{firstPlace ? firstPlace.points : 0} Pts</strong>
            <span class="win-loss-ratio text-muted">
              ({firstPlace ? firstPlace.wins : 0}W - {firstPlace ? firstPlace.losses : 0}L)
            </span>
          </div>
          <span class="pedestal-step gold-step">1</span>
        </div>
      </div>

      <!-- 3rd Place (Bronze) - Positioned Right -->
      <div class="podium-pedestal step-bronze">
        <div class="medal-badge-box bronze-badge">
          <AppIcon name="medal" className="medal-icon bronze-medal" />
          <span class="rank-title">3rd Place</span>
        </div>
        <div class="pedestal-card">
          <h4 class="competitor-name">{thirdPlace ? thirdPlace.playerName : 'TBD'}</h4>
          <div class="record-pill">
            <strong class="points-val">{thirdPlace ? thirdPlace.points : 0} Pts</strong>
            <span class="win-loss-ratio text-muted">
              ({thirdPlace ? thirdPlace.wins : 0}W - {thirdPlace ? thirdPlace.losses : 0}L)
            </span>
          </div>
          <span class="pedestal-step bronze-step">3</span>
        </div>
      </div>
    </div>

    <!-- Complete Leaderboard Table -->
    <div class="card leaderboard-card">
      <div class="leaderboard-header">
        <h4>Complete Tournament Standings</h4>
        <span class="text-secondary text-sm">Win = 1 Point • Loss = 0 Points</span>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 70px;">Rank</th>
              <th>Player Name</th>
              <th>Played</th>
              <th>Wins</th>
              <th>Losses</th>
              <th>Byes</th>
              <th>Total Points</th>
              <th style="text-align: right;">Official Standing</th>
            </tr>
          </thead>
          <tbody>
            {#each $activeTournamentStandings as entry (entry.playerId)}
              <tr class={entry.rank <= 3 ? `top-tier rank-${entry.rank}-row` : ''}>
                <td>
                  <div class="rank-circle rank-circle-{entry.rank}">
                    #{entry.rank}
                  </div>
                </td>
                <td>
                  <span class="table-player-name">{entry.playerName}</span>
                </td>
                <td>{entry.matchesPlayed}</td>
                <td class="text-success font-bold">{entry.wins}</td>
                <td class="text-muted">{entry.losses}</td>
                <td class="text-muted">{entry.byes || 0}</td>
                <td>
                  <span class="points-tag">{entry.points} pts</span>
                </td>
                <td style="text-align: right;">
                  {#if entry.rank === 1}
                    <span class="medal-tag gold-tag"><AppIcon name="medal" /> 1st Place (Gold)</span>
                  {:else if entry.rank === 2}
                    <span class="medal-tag silver-tag"><AppIcon name="medal" /> 2nd Place (Silver)</span>
                  {:else if entry.rank === 3}
                    <span class="medal-tag bronze-tag"><AppIcon name="medal" /> 3rd Place (Bronze)</span>
                  {:else}
                    <span class="text-muted text-sm">Participant</span>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>

<style>
  .podium-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .section-title-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /* Olympic 3D Stepped Podium */
  .podium-stage {
    display: grid;
    grid-template-columns: 1fr 1.18fr 1fr;
    gap: 1.25rem;
    align-items: flex-end;
    padding: 2.5rem 1rem 1rem 1rem;
    max-width: 960px;
    margin: 0 auto;
    width: 100%;
  }

  .podium-pedestal {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .step-gold {
    transform: translateY(-20px);
    z-index: 2;
  }

  .step-silver {
    z-index: 1;
  }

  .step-bronze {
    z-index: 1;
  }

  .crown-emblem {
    position: absolute;
    top: -30px;
    background: linear-gradient(135deg, #f59e0b, #b45309);
    color: #ffffff;
    font-size: 0.6875rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    padding: 0.25rem 0.85rem;
    border-radius: 9999px;
    box-shadow: 0 4px 10px rgba(245, 158, 11, 0.4);
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  .medal-badge-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .medal-icon {
    width: 2.5rem;
    height: 2.5rem;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.4));
  }

  .medal-icon.main-medal {
    width: 3.5rem;
    height: 3.5rem;
  }

  .gold-medal { color: var(--gold); }
  .silver-medal { color: var(--silver); }
  .bronze-medal { color: var(--bronze); }

  .rank-title {
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-secondary);
    margin-top: 0.25rem;
  }

  .gold-title {
    color: var(--gold);
  }

  .pedestal-card {
    background-color: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 1.5rem 1.25rem 1rem 1.25rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-shadow: var(--shadow-md);
    gap: 0.5rem;
    position: relative;
    overflow: hidden;
  }

  .pedestal-card.gold-card {
    background: linear-gradient(180deg, rgba(251, 191, 36, 0.14) 0%, var(--bg-card) 100%);
    border: 2px solid var(--gold-border);
    box-shadow: 0 10px 30px -5px rgba(251, 191, 36, 0.3);
    padding-top: 2rem;
  }

  .competitor-name {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-primary);
    word-break: break-word;
  }

  .champion-text {
    font-size: 1.35rem;
    color: #ffffff;
    font-weight: 800;
  }

  .record-pill {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    background-color: var(--bg-main);
    border: 1px solid var(--border-color);
    padding: 0.3rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
  }

  .record-pill.gold-pill {
    border-color: rgba(251, 191, 36, 0.3);
    background-color: rgba(251, 191, 36, 0.1);
  }

  .points-val {
    color: var(--text-primary);
  }

  .pedestal-step {
    font-size: 2.5rem;
    font-weight: 900;
    opacity: 0.15;
    line-height: 1;
    margin-top: 0.5rem;
  }

  .gold-step { color: var(--gold); opacity: 0.35; }
  .silver-step { color: var(--silver); }
  .bronze-step { color: var(--bronze); }

  /* Leaderboard Table */
  .leaderboard-card {
    padding: 0;
    overflow: hidden;
  }

  .leaderboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.5rem;
    background-color: var(--bg-card-alt);
    border-bottom: 1px solid var(--border-color);
  }

  .rank-circle {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 800;
    background-color: var(--bg-card-alt);
    color: var(--text-secondary);
  }

  .rank-circle-1 {
    background-color: var(--gold-bg);
    color: var(--gold);
    border: 1px solid var(--gold-border);
  }

  .rank-circle-2 {
    background-color: var(--silver-bg);
    color: var(--silver);
    border: 1px solid var(--silver-border);
  }

  .rank-circle-3 {
    background-color: var(--bronze-bg);
    color: var(--bronze);
    border: 1px solid var(--bronze-border);
  }

  .table-player-name {
    font-weight: 700;
    color: var(--text-primary);
  }

  .points-tag {
    font-size: 0.8125rem;
    font-weight: 700;
    background-color: var(--primary-light);
    color: var(--primary);
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
  }

  .medal-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
  }

  .gold-tag { background-color: var(--gold-bg); color: var(--gold); border: 1px solid var(--gold-border); }
  .silver-tag { background-color: var(--silver-bg); color: var(--silver); border: 1px solid var(--silver-border); }
  .bronze-tag { background-color: var(--bronze-bg); color: var(--bronze); border: 1px solid var(--bronze-border); }

  .rank-1-row td { background-color: rgba(251, 191, 36, 0.03); }
  .rank-2-row td { background-color: rgba(203, 213, 225, 0.02); }
  .rank-3-row td { background-color: rgba(217, 119, 6, 0.02); }

  .text-success { color: var(--success); }
  .font-bold { font-weight: 700; }
  .text-sm { font-size: 0.8125rem; }

  .empty-podium {
    text-align: center;
    padding: 3rem 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .empty-icon {
    width: 2.5rem;
    height: 2.5rem;
    opacity: 0.4;
  }

  @media (max-width: 768px) {
    .podium-stage {
      grid-template-columns: 1fr;
      padding-top: 1rem;
    }
    .step-gold {
      transform: none;
      order: -1;
    }
  }
</style>
