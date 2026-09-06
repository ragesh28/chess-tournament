// tournamentEngine.js - Pure business logic & algorithms

export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * Fisher-Yates (Knuth) Shuffle Algorithm
 * Ensures mathematically unbiased, O(N) uniform random permutations.
 */
export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Creates head-to-head pairings for a tournament.
 * If there is an odd number of players, the remaining player is assigned a "Bye"
 * (automatic win and 1 point).
 */
export function createPairings(enrolledPlayerIds, tournamentId) {
  if (!enrolledPlayerIds || enrolledPlayerIds.length < 2) {
    throw new Error('A tournament requires at least 2 players to generate pairings.');
  }

  // Unbiased shuffle of players
  const pool = shuffle(enrolledPlayerIds);
  const matches = [];
  let matchIndex = 1;

  while (pool.length >= 2) {
    const whitePlayerId = pool.shift();
    const blackPlayerId = pool.shift();

    matches.push({
      id: generateId('match'),
      tournamentId,
      matchNumber: matchIndex++,
      round: 1,
      whitePlayerId,
      blackPlayerId,
      winnerPlayerId: null,
      isCompleted: false,
      isBye: false
    });
  }

  // Handle odd-player Bye
  if (pool.length === 1) {
    const byePlayerId = pool.shift();
    matches.push({
      id: generateId('match'),
      tournamentId,
      matchNumber: matchIndex++,
      round: 1,
      whitePlayerId: byePlayerId,
      blackPlayerId: null, // Indicates Bye
      winnerPlayerId: byePlayerId, // Automatic win
      isCompleted: true,
      isBye: true
    });
  }

  return matches;
}

/**
 * Simulates a single match outcome with a 50/50 randomized winner.
 */
export function simulateMatchOutcome(match) {
  if (match.isCompleted) return match;

  if (match.isBye || !match.blackPlayerId) {
    return {
      ...match,
      winnerPlayerId: match.whitePlayerId,
      isCompleted: true
    };
  }

  const isWhiteWinner = Math.random() < 0.5;
  const winnerPlayerId = isWhiteWinner ? match.whitePlayerId : match.blackPlayerId;

  return {
    ...match,
    winnerPlayerId,
    isCompleted: true
  };
}

/**
 * Computes tournament standings and rankings based on completed match records.
 * Sorting priority:
 * 1. Points (Win = 1 pt, Loss = 0 pt)
 * 2. Total Wins
 * 3. Alphabetical by player name
 */
export function calculateRankings(enrolledPlayerIds, tournamentMatches, playersList) {
  const playerMap = new Map(playersList.map(p => [p.id, p]));
  const scoreMap = new Map();

  // Initialize entry for each enrolled player
  enrolledPlayerIds.forEach(pid => {
    const player = playerMap.get(pid);
    scoreMap.set(pid, {
      playerId: pid,
      playerName: player ? player.name : 'Unknown Player',
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      points: 0,
      byes: 0,
      rank: 0
    });
  });

  // Tally completed matches
  tournamentMatches.forEach(match => {
    if (!match.isCompleted) return;

    // White player record
    if (scoreMap.has(match.whitePlayerId)) {
      const whiteStats = scoreMap.get(match.whitePlayerId);
      whiteStats.matchesPlayed += 1;
      if (match.isBye) {
        whiteStats.byes += 1;
        whiteStats.wins += 1;
        whiteStats.points += 1;
      } else if (match.winnerPlayerId === match.whitePlayerId) {
        whiteStats.wins += 1;
        whiteStats.points += 1;
      } else {
        whiteStats.losses += 1;
      }
    }

    // Black player record (if not a Bye)
    if (match.blackPlayerId && scoreMap.has(match.blackPlayerId)) {
      const blackStats = scoreMap.get(match.blackPlayerId);
      blackStats.matchesPlayed += 1;
      if (match.winnerPlayerId === match.blackPlayerId) {
        blackStats.wins += 1;
        blackStats.points += 1;
      } else {
        blackStats.losses += 1;
      }
    }
  });

  // Sort standings with multi-criteria comparator
  const standings = Array.from(scoreMap.values()).sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points; // Primary: Points
    }
    if (b.wins !== a.wins) {
      return b.wins - a.wins; // Secondary: Wins
    }
    return a.playerName.localeCompare(b.playerName); // Tertiary: Alphabetical
  });

  // Assign 1-indexed ranks
  standings.forEach((entry, idx) => {
    entry.rank = idx + 1;
  });

  return standings;
}

/**
 * Sample Grandmaster players for quick testing & evaluation.
 */
export function getSamplePlayers() {
  const names = [
    'Magnus Carlsen',
    'Hikaru Nakamura',
    'Ding Liren',
    'Gukesh D',
    'Alireza Firouzja',
    'Fabiano Caruana'
  ];
  return names.map((name, index) => ({
    id: `player_sample_${index + 1}`,
    name,
    createdAt: Date.now() - (names.length - index) * 60000
  }));
}
