// stores.js - Centralized Svelte stores with localStorage synchronization
import { writable, derived } from 'svelte/store';
import { Storage } from './storage.js';
import {
  generateId,
  createPairings,
  simulateMatchOutcome,
  calculateRankings,
  getSamplePlayers
} from './tournamentEngine.js';

// Initialize from localStorage
const initialPlayers = Storage.get(Storage.KEYS.PLAYERS, []);
const initialTournaments = Storage.get(Storage.KEYS.TOURNAMENTS, []);
const initialMatches = Storage.get(Storage.KEYS.MATCHES, []);
const initialActiveId = Storage.get(Storage.KEYS.ACTIVE_TOURNAMENT, null);

export const players = writable(initialPlayers);
export const tournaments = writable(initialTournaments);
export const matches = writable(initialMatches);
export const activeTournamentId = writable(initialActiveId);
export const currentTab = writable('dashboard'); // 'dashboard' | 'players' | 'tournaments' | 'tournament-detail'
export const isSimulating = writable(false); // Global flag for simulation transition

// Toast Notifications Store
export const toast = writable(null);
let toastTimer = null;

export function showToast(message, type = 'success') {
  if (toastTimer) clearTimeout(toastTimer);
  toast.set({ message, type });
  toastTimer = setTimeout(() => {
    toast.set(null);
  }, 3500);
}

// Synchronize stores to localStorage
players.subscribe(val => Storage.set(Storage.KEYS.PLAYERS, val));
tournaments.subscribe(val => Storage.set(Storage.KEYS.TOURNAMENTS, val));
matches.subscribe(val => Storage.set(Storage.KEYS.MATCHES, val));
activeTournamentId.subscribe(val => Storage.set(Storage.KEYS.ACTIVE_TOURNAMENT, val));

// Derived store: Active tournament object
export const activeTournament = derived(
  [tournaments, activeTournamentId],
  ([$tournaments, $activeId]) => $tournaments.find(t => t.id === $activeId) || null
);

// Derived store: Matches belonging to active tournament
export const activeTournamentMatches = derived(
  [matches, activeTournamentId],
  ([$matches, $activeId]) => $matches.filter(m => m.tournamentId === $activeId)
);

// Derived store: Standings for active tournament
export const activeTournamentStandings = derived(
  [activeTournament, activeTournamentMatches, players],
  ([$activeTournament, $activeMatches, $players]) => {
    if (!$activeTournament || !$activeTournament.playerIds || $activeTournament.playerIds.length === 0) {
      return [];
    }
    return calculateRankings($activeTournament.playerIds, $activeMatches, $players);
  }
);

// Derived store: Dashboard Statistics
export const dashboardStats = derived(
  [players, tournaments, matches, activeTournament],
  ([$players, $tournaments, $matches, $activeTourney]) => {
    const totalPlayers = $players.length;
    const totalTournaments = $tournaments.length;
    const activeTourneys = $tournaments.filter(t => t.status === 'in_progress').length;
    const completedTourneys = $tournaments.filter(t => t.status === 'completed').length;
    const totalCompletedMatches = $matches.filter(m => m.isCompleted).length;
    const pendingMatches = $matches.filter(m => !m.isCompleted).length;

    return {
      totalPlayers,
      totalTournaments,
      activeTourneys,
      completedTourneys,
      totalCompletedMatches,
      pendingMatches,
      activeTournamentTitle: $activeTourney ? $activeTourney.title : 'None Selected',
      activeTournamentStatus: $activeTourney ? $activeTourney.status : 'N/A'
    };
  }
);

// Derived store: Player participation counts map (playerId -> tournament count)
export const playerParticipation = derived(
  [players, tournaments],
  ([$players, $tournaments]) => {
    const map = new Map();
    $players.forEach(p => map.set(p.id, 0));
    $tournaments.forEach(t => {
      t.playerIds.forEach(pid => {
        if (map.has(pid)) {
          map.set(pid, map.get(pid) + 1);
        }
      });
    });
    return map;
  }
);

// ====================
// ACTIONS / DISPATCHERS
// ====================

export const PlayerActions = {
  create(name) {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Player name cannot be empty.');

    const newPlayer = {
      id: generateId('player'),
      name: trimmed,
      createdAt: Date.now()
    };

    players.update(list => [newPlayer, ...list]);
    showToast(`Player "${newPlayer.name}" created successfully!`, 'success');
    return newPlayer;
  },

  update(id, updatedName) {
    const trimmed = updatedName.trim();
    if (!trimmed) throw new Error('Player name cannot be empty.');

    players.update(list =>
      list.map(p => (p.id === id ? { ...p, name: trimmed } : p))
    );
    showToast('Player updated successfully.', 'success');
  },

  delete(id) {
    let isInProgress = false;
    tournaments.subscribe(allTourneys => {
      isInProgress = allTourneys.some(
        t => t.status === 'in_progress' && t.playerIds.includes(id)
      );
    })();

    if (isInProgress) {
      const err = 'Cannot delete a player who is currently competing in an active tournament.';
      showToast(err, 'danger');
      throw new Error(err);
    }

    players.update(list => list.filter(p => p.id !== id));

    tournaments.update(list =>
      list.map(t => ({
        ...t,
        playerIds: t.playerIds.filter(pid => pid !== id)
      }))
    );

    showToast('Player removed from roster.', 'info');
  }
};

export const TournamentActions = {
  create(title) {
    const trimmed = title.trim();
    if (!trimmed) throw new Error('Tournament title cannot be empty.');

    const newTournament = {
      id: generateId('tourney'),
      title: trimmed,
      status: 'draft',
      playerIds: [],
      createdAt: Date.now()
    };

    tournaments.update(list => [newTournament, ...list]);
    showToast(`Tournament "${newTournament.title}" created.`, 'success');
    return newTournament;
  },

  update(id, updatedTitle) {
    const trimmed = updatedTitle.trim();
    if (!trimmed) throw new Error('Tournament title cannot be empty.');

    tournaments.update(list =>
      list.map(t => (t.id === id ? { ...t, title: trimmed } : t))
    );
    showToast('Tournament renamed successfully.', 'success');
  },

  delete(id) {
    tournaments.update(list => list.filter(t => t.id !== id));
    matches.update(list => list.filter(m => m.tournamentId !== id));

    activeTournamentId.update(current => (current === id ? null : current));
    showToast('Tournament deleted.', 'info');
  },

  addPlayer(tournamentId, playerId) {
    tournaments.update(list =>
      list.map(t => {
        if (t.id !== tournamentId) return t;
        if (t.status !== 'draft') {
          throw new Error('Cannot add players to a tournament that has already started.');
        }
        if (t.playerIds.includes(playerId)) {
          throw new Error('Player is already enrolled in this tournament.');
        }
        return {
          ...t,
          playerIds: [...t.playerIds, playerId]
        };
      })
    );
    showToast('Player enrolled into tournament.', 'success');
  },

  removePlayer(tournamentId, playerId) {
    tournaments.update(list =>
      list.map(t => {
        if (t.id !== tournamentId) return t;
        if (t.status !== 'draft') {
          throw new Error('Cannot modify players in a tournament that has already started.');
        }
        return {
          ...t,
          playerIds: t.playerIds.filter(pid => pid !== playerId)
        };
      })
    );
    showToast('Player removed from tournament.', 'info');
  },

  startTournament(tournamentId) {
    let targetTourney;
    tournaments.subscribe(all => {
      targetTourney = all.find(t => t.id === tournamentId);
    })();

    if (!targetTourney) throw new Error('Tournament not found.');
    if (targetTourney.playerIds.length < 2) {
      throw new Error('A tournament requires at least 2 players to start.');
    }

    const newMatches = createPairings(targetTourney.playerIds, tournamentId);

    matches.update(list => [
      ...list.filter(m => m.tournamentId !== tournamentId),
      ...newMatches
    ]);

    tournaments.update(list =>
      list.map(t => (t.id === tournamentId ? { ...t, status: 'in_progress' } : t))
    );

    showToast('Tournament started! Random pairings generated.', 'success');
  },

  resetTournament(tournamentId) {
    matches.update(list => list.filter(m => m.tournamentId !== tournamentId));
    tournaments.update(list =>
      list.map(t => (t.id === tournamentId ? { ...t, status: 'draft' } : t))
    );
    showToast('Tournament reset to Draft.', 'info');
  },

  simulateMatch(matchId) {
    matches.update(list =>
      list.map(m => (m.id === matchId ? simulateMatchOutcome(m) : m))
    );
    this.checkCompletion();
    showToast('Match outcome simulated!', 'success');
  },

  async simulateAllMatches(tournamentId) {
    isSimulating.set(true);

    // Brief realistic visual simulation transition (650ms)
    await new Promise(resolve => setTimeout(resolve, 650));

    matches.update(list =>
      list.map(m => {
        if (m.tournamentId === tournamentId && !m.isCompleted) {
          return simulateMatchOutcome(m);
        }
        return m;
      })
    );

    isSimulating.set(false);
    this.checkCompletion();
    showToast('Simulation complete! All match winners recorded.', 'success');
  },

  checkCompletion() {
    let activeId;
    activeTournamentId.subscribe(id => (activeId = id))();
    if (!activeId) return;

    let tourneyMatches;
    matches.subscribe(all => {
      tourneyMatches = all.filter(m => m.tournamentId === activeId);
    })();

    if (tourneyMatches.length > 0 && tourneyMatches.every(m => m.isCompleted)) {
      tournaments.update(list =>
        list.map(t => (t.id === activeId ? { ...t, status: 'completed' } : t))
      );
    }
  }
};

// Seeder: Populate sample grandmasters & sample tournament
export function seedSampleData() {
  const samplePlayers = getSamplePlayers();
  players.set(samplePlayers);

  const sampleTournament = {
    id: 'tourney_sample_candidates',
    title: 'FIDE Candidates 2026',
    status: 'draft',
    playerIds: samplePlayers.slice(0, 4).map(p => p.id),
    createdAt: Date.now()
  };

  tournaments.set([sampleTournament]);
  matches.set([]);
  activeTournamentId.set(sampleTournament.id);
  currentTab.set('dashboard');
  showToast('Grandmaster dataset & sample tournament loaded!', 'success');
}

// Clear all local records
export function resetSystemData() {
  Storage.clearAll();
  players.set([]);
  tournaments.set([]);
  matches.set([]);
  activeTournamentId.set(null);
  currentTab.set('dashboard');
  showToast('All local tournament records cleared.', 'info');
}
