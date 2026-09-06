# ♟ Chess Tournament Management System

> **Bytelogik Software Developer Assignment – Chess Tournament Management System**  
> **Developer**: Ragesh L  
> **Education**: B.Tech AI & Data Science | 2022–2026  
> **Live Demo**: [https://ragesh28.github.io/chess-tournament/](https://ragesh28.github.io/chess-tournament/)  
> **Portfolio**: [https://ragesh-ai-portfolio.netlify.app/](https://ragesh-ai-portfolio.netlify.app/)

---

## 🌟 Features Implemented

### 1. Player Management (CRUD)
- **Create**: Register new chess participants with non-empty validation.
- **Read/List**: View master roster with registration timestamps and participant counts.
- **Update**: Edit player names inline with immediate state updates.
- **Delete**: Remove players from roster with defensive cascade protection (cannot delete players who are actively competing).
- **Persistence**: All player records automatically sync to browser `localStorage`.

### 2. Tournament Management (CRUD)
- **Create**: Add new tournaments with unique titles, initialized in `Draft` mode.
- **Read/List**: View all tournaments with real-time status badges (`Draft`, `In Progress`, `Completed`).
- **Update**: Rename tournaments directly from the dashboard.
- **Delete**: Remove tournaments and cascade-clean all associated match records.
- **Player Enrollment**: Register/un-enroll players into tournaments with duplicate prevention and live participant counter.

### 3. Match Simulation System
- **Randomized Pairing**: Implements the **Fisher-Yates (Knuth) Shuffle Algorithm** to produce unbiased, uniform $O(N)$ random pairings.
- **Odd Player Count ("Bye" Handling)**: When an odd number of players compete, the leftover player is granted a "Bye" (automatic victory, 1 point awarded).
- **Random Winner Selection**: 50/50 randomized match outcome engine simulates White vs. Black wins without requiring real chess gameplay.
- **Controls**: Simulate individual games or click "Simulate All Matches" to resolve the entire round concurrently.

### 4. Ranking & Top 3 Podium
- **Score Calculation**: Automatically tallies matches played, wins, losses, and total points (1 point per win, 0 per loss).
- **Tie-Breaking Multi-Tier Sorting**: Sorts standings primarily by **Points $\to$ Total Wins $\to$ Alphabetical Name**.
- **Top 3 Podium**: Prominently highlights **1st Place (🥇 Gold Champion)**, **2nd Place (🥈 Silver Runner-Up)**, and **3rd Place (🥉 Bronze)**.
- **Leaderboard Table**: Complete, detailed standings for all participants.

### 5. Developer & Reviewer Utilities
- **⚡ Demo Data Seeder**: One-click button in the navigation header to load 6 Grandmasters (Magnus Carlsen, Hikaru Nakamura, Ding Liren, Gukesh D, Alireza Firouzja, Fabiano Caruana) and a sample tournament for instant reviewer evaluation.
- **Reset System**: Safely clears all local records back to a blank slate.

---

## 🛠️ Technology Stack
- **Framework**: [Svelte 4](https://svelte.dev/)
- **Build Tool**: [Vite 5](https://vitejs.dev/)
- **Language**: Vanilla JavaScript (ES Modules)
- **Styling**: Vanilla CSS with custom properties & responsive grid layout
- **Storage**: Browser `localStorage` with error handling & JSON serialization

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- `npm`

### Installation & Local Run
```bash
# 1. Clone the repository
git clone <repo-url>
cd chess-tournament-submissions

# 2. Install dependencies
npm install

# 3. Launch local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build
```bash
npm run build
```
Generates production-ready static assets in the `/dist` directory.

---

## 📂 Project Architecture

```
src/
├── lib/
│   ├── storage.js          # Safe localStorage serialization wrapper
│   ├── stores.js           # Central Svelte writable stores & action dispatchers
│   └── tournamentEngine.js # Pure algorithmic logic (Fisher-Yates, pairings, scoring)
├── components/
│   ├── Navigation.svelte   # Header navigation, tab switcher, demo seeder
│   ├── PlayerManager.svelte# Player CRUD interface & validation
│   ├── TournamentList.svelte # Tournament creation, listing & status overview
│   ├── TournamentHub.svelte # Active tournament dashboard, enrollment & controls
│   ├── MatchCard.svelte    # Individual game card & simulation trigger
│   └── Podium.svelte       # Top 3 Podium showcase & complete standings table
├── App.svelte              # Root coordinator component
├── app.css                 # Global design system & theme variables
└── main.js                 # App entry point
```

---

## 🛡️ Edge Cases Handled

1. **Zero Players / Single Player**: "Start Tournament" button is disabled; displays clear alert requiring $\ge 2$ players.
2. **Odd Number of Players**: Odd player receives an automated "Bye" match with an automatic win and 1 tournament point.
3. **Duplicate Player Enrollment**: Dropdown excludes already enrolled participants; store prevents duplicate IDs.
4. **Deleting Active Players**: Referential integrity check prevents deleting any player actively competing in an `in_progress` tournament.
5. **Page Refresh**: Store subscriptions sync state directly to `localStorage`, preserving in-progress tournaments and match results.
