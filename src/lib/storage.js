// storage.js - Safe localStorage wrapper with JSON serialization

const STORAGE_KEYS = {
  PLAYERS: 'chess_tournament_players',
  TOURNAMENTS: 'chess_tournament_tournaments',
  MATCHES: 'chess_tournament_matches',
  ACTIVE_TOURNAMENT: 'chess_tournament_active_id'
};

export const Storage = {
  get(key, fallback = []) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (err) {
      console.error(`Error reading ${key} from localStorage:`, err);
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`Error saving ${key} to localStorage:`, err);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error(`Error removing ${key} from localStorage:`, err);
    }
  },

  clearAll() {
    Object.values(STORAGE_KEYS).forEach(k => {
      try {
        localStorage.removeItem(k);
      } catch (e) {
        // ignore
      }
    });
  },

  KEYS: STORAGE_KEYS
};
