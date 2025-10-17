# NBA Database Import Scripts

This directory contains scripts for importing NBA data from the NBA Database project into Firebase/Firestore.

## 📋 Prerequisites

1. Firebase credentials configured in `.env.local`
2. NBA Database project at `../NBA Database/`
3. CSV files in `../NBA Database/nba_data/`:
   - `teams.csv` (35 teams)
   - `seasons.csv` (79 seasons)  
   - `unmatched_pts.csv` (26,342 player-team-season records)

## 🚀 Quick Start

### Import Everything (Recommended)
```bash
npm run firebase:import-all
```

This runs all imports in the correct order:
1. Teams (35 records)
2. Seasons (79 records)
3. Player-Team-Seasons (~26,000 records with data cleaning)

### Individual Imports

```bash
# Import teams only
npm run firebase:import-teams

# Import seasons only
npm run firebase:import-seasons

# Import player-team-seasons only (requires teams & seasons to exist)
npm run firebase:import-pts
```

## 📁 File Structure

```
scripts/
├── README.md (this file)
├── firebase-import-teams.ts           # Import teams collection
├── firebase-import-seasons.ts         # Import seasons collection
├── firebase-import-player-team-seasons.ts  # Transform & import PTS
├── firebase-import-all.ts             # Master script - runs all imports
└── utils/
    ├── team-mapper.ts                 # Maps Basketball Reference → abbreviations
    ├── player-matcher.ts              # Fuzzy player name matching
    └── firebase-batch.ts              # Batch import utilities
```

## 🔧 What Each Script Does

### 1. `firebase-import-teams.ts`
- Reads `teams.csv`
- Imports 35 NBA teams (current + historical)
- Uses team_id as document ID

**Output:**
```
Firestore > teams collection
├── 1: {team_id: 1, team_name: "Atlanta Hawks", abbreviation: "ATL", ...}
├── 2: {team_id: 2, team_name: "Boston Celtics", abbreviation: "BOS", ...}
└── ...
```

### 2. `firebase-import-seasons.ts`
- Reads `seasons.csv`
- Imports 79 NBA seasons (1946-47 through 2024-25)
- Uses season_id as document ID

**Output:**
```
Firestore > seasons collection
├── 1: {season_id: 1, season_label: "1946-47", start_year: 1946, end_year: 1947}
├── 2: {season_id: 2, season_label: "1947-48", start_year: 1947, end_year: 1948}
└── ...
```

### 3. `firebase-import-player-team-seasons.ts`
- Reads `unmatched_pts.csv`
- Loads players, teams, and seasons from Firestore
- **Transforms team names:** `"Team.BOSTON_CELTICS"` → `"BOS"`
- **Matches player names** using fuzzy matching (Levenshtein distance)
- **Denormalizes data** for faster queries
- Imports matched records to Firestore
- Reports unmatched records

**Output:**
```
Firestore > player_team_seasons collection
├── auto-id-1: {
│   player_id: "abc123",
│   team_id: 2,
│   season_id: 77,
│   games_played: 74,
│   player_name: "Jayson Tatum",  // Denormalized
│   team_abbr: "BOS",              // Denormalized
│   team_name: "Boston Celtics",   // Denormalized
│   season_label: "2023-24"        // Denormalized
│ }
└── ...
```

### 4. `firebase-import-all.ts`
- Orchestrates all three imports
- Runs in correct order (teams → seasons → player-team-seasons)
- Shows progress and summary
- Reports total time and success rate

## 🔍 Data Transformation Details

### Team Name Mapping
The Basketball Reference API returns team names in this format:
```
Team.BOSTON_CELTICS
Team.LOS_ANGELES_LAKERS
Team.GOLDEN_STATE_WARRIORS
```

We map them to standard abbreviations:
```
BOS
LAL
GSW
```

See `utils/team-mapper.ts` for complete mapping.

### Player Name Matching
Player names in `unmatched_pts.csv` might not exactly match names in the `players` collection due to:
- Different spellings
- Accents/special characters
- Nicknames vs. full names

We use **fuzzy matching** with Levenshtein distance (threshold: 0.85) to find the best match.

See `utils/player-matcher.ts` for implementation.

### Denormalization Strategy
Since Firestore doesn't support SQL JOINs, we denormalize frequently-accessed data:

**Without denormalization:**
```typescript
// Need 3 separate queries to display player career
const pts = await getPlayerCareer(playerId);
for (const record of pts) {
  const team = await getTeamById(record.team_id);      // Additional query
  const season = await getSeasonById(record.season_id); // Additional query
  console.log(`${team.team_name} - ${season.season_label}`);
}
```

**With denormalization:**
```typescript
// Single query gets everything
const pts = await getPlayerCareer(playerId);
for (const record of pts) {
  console.log(`${record.team_name} - ${record.season_label}`); // No additional queries!
}
```

## 📊 Expected Results

After successful import:

```
Firestore Collections:
├── players: 4,775 documents (already imported)
├── teams: 35 documents ✨ NEW
├── seasons: 79 documents ✨ NEW
└── player_team_seasons: ~26,000 documents ✨ NEW
```

## 🎯 Firestore Indexes Required

After import, create these composite indexes in Firebase Console:

```
Collection: player_team_seasons

Indexes:
1. player_id (ASC) + season_id (ASC)
2. team_id (ASC) + season_id (ASC)
3. team_abbr (ASC)
```

Or deploy from `firestore.indexes.json`:
```bash
npm run firebase:deploy
```

## 🧪 Verification

After import, verify in Firebase Console:

1. Check document counts:
   - teams: 35
   - seasons: 79
   - player_team_seasons: ~26,000

2. Sample queries:
```typescript
// Get LeBron's career
const career = await getPlayerCareer('lebron-id');
console.log(career); // Should show CLE, MIA, CLE, LAL

// Get 2009-10 Lakers roster
const roster = await getTeamRoster(14, 64);
console.log(roster); // Should include Kobe, Pau, Derek Fisher, etc.
```

## ⚠️ Troubleshooting

### Error: "Firebase not initialized"
Make sure `.env.local` has all Firebase credentials:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
...
```

### Error: "File not found: teams.csv"
Make sure NBA Database project is at `../NBA Database/` relative to this project.

### Low match rate on player-team-seasons
- Check if `players` collection is populated (4,775 docs)
- Check if `teams` collection is populated (35 docs)
- Review unmatched records in console output
- Adjust fuzzy matching threshold in `player-matcher.ts` if needed

### Import is slow
- Normal! ~26,000 records take 3-5 minutes
- Firestore has rate limits (500 writes per batch)
- Script shows progress during import

## 📚 Query Functions Available

After import, use these functions from `src/lib/firebase.ts`:

```typescript
// Teams
getAllTeams()
getTeamById(teamId)
getTeamByAbbreviation(abbr)

// Seasons
getAllSeasons()
getSeasonById(seasonId)

// Player-Team-Seasons
getPlayerCareer(playerId)           // Player's complete career
getTeamRoster(teamId, seasonId)     // Team roster for a season
getPlayersByTeam(teamAbbr)          // All players who played for team
getSeasonStats(seasonId)            // Season overview stats
```

## 🎉 Success!

If all imports complete successfully, you now have a complete NBA database with:
- Player information (4,775 players)
- Team information (35 teams)
- Season information (79 seasons)
- Player career histories (~26,000 records)

You can now build features like:
- Player career pages
- Team roster history
- Season statistics
- Player search by team
- And much more!

---

**Need help?** Check the main documentation in `docs/FIREBASE_IMPORT_PLAN.md`

