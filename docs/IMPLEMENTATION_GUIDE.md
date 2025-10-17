# Firebase Import - Implementation Guide

## ✅ Implementation Complete!

All import scripts and utilities have been created. You're ready to import the NBA database!

---

## 📦 What Was Created

### Import Scripts
- ✅ `scripts/firebase-import-teams.ts` - Import 35 teams
- ✅ `scripts/firebase-import-seasons.ts` - Import 79 seasons
- ✅ `scripts/firebase-import-player-team-seasons.ts` - Import & transform ~26,000 records
- ✅ `scripts/firebase-import-all.ts` - Master orchestrator

### Utility Functions
- ✅ `scripts/utils/team-mapper.ts` - Basketball Reference → abbreviation mapping
- ✅ `scripts/utils/player-matcher.ts` - Fuzzy name matching (Levenshtein distance)
- ✅ `scripts/utils/firebase-batch.ts` - Batch import helpers

### Firebase Library Updates
- ✅ Added `Team`, `Season`, `PlayerTeamSeason` types
- ✅ Added collection references
- ✅ Added query functions:
  - `getAllTeams()`, `getTeamById()`, `getTeamByAbbreviation()`
  - `getAllSeasons()`, `getSeasonById()`
  - `getPlayerCareer()`, `getTeamRoster()`, `getPlayersByTeam()`, `getSeasonStats()`

### Configuration
- ✅ Updated `package.json` with new npm scripts
- ✅ Updated `firestore.indexes.json` with required composite indexes
- ✅ Created comprehensive documentation

---

## 🚀 How to Run the Import

### Option 1: Import Everything (Recommended)

```bash
npm run firebase:import-all
```

This runs all three imports in order:
1. Teams (35 records) → ~10 seconds
2. Seasons (79 records) → ~15 seconds
3. Player-Team-Seasons (~26,000 records) → ~3-5 minutes

**Total time: 4-6 minutes**

### Option 2: Import Individually

```bash
# Step 1: Import teams
npm run firebase:import-teams

# Step 2: Import seasons
npm run firebase:import-seasons

# Step 3: Import player-team-seasons (requires steps 1 & 2 complete)
npm run firebase:import-pts
```

---

## 📋 Prerequisites Checklist

Before running the import:

- ✅ Firebase credentials in `.env.local`:
  ```
  VITE_FIREBASE_API_KEY=...
  VITE_FIREBASE_AUTH_DOMAIN=...
  VITE_FIREBASE_PROJECT_ID=...
  VITE_FIREBASE_STORAGE_BUCKET=...
  VITE_FIREBASE_MESSAGING_SENDER_ID=...
  VITE_FIREBASE_APP_ID=...
  VITE_FIREBASE_MEASUREMENT_ID=...
  ```

- ✅ NBA Database project at `../NBA Database/`

- ✅ CSV files exist:
  - `../NBA Database/nba_data/teams.csv`
  - `../NBA Database/nba_data/seasons.csv`
  - `../NBA Database/nba_data/unmatched_pts.csv`

- ✅ Players already imported to Firestore (4,775 docs in `players` collection)

---

## 📊 Expected Results

### Console Output

```
🏀 NBA DATABASE - COMPLETE IMPORT
============================================================
This will import:
  1. Teams (35 teams)
  2. Seasons (79 seasons)
  3. Player-Team-Seasons (~26,000 records)
============================================================

📦 PHASE 1: Core Collections
============================================================
▶️  Importing Teams
============================================================
🏀 NBA Teams Import
==================================================

📂 Reading teams from: /path/to/NBA Database/nba_data/teams.csv
✅ Parsed 35 teams from CSV

📋 Sample teams:
  1. Atlanta Hawks (ATL)
  2. Boston Celtics (BOS)
  3. Los Angeles Lakers (LAL)

📤 Importing 35 documents to 'teams'...
✅ Committed batch 1/1

🎉 Successfully imported 35 documents to 'teams'!

🔍 Verifying 'teams' collection...
✅ Verification passed: 35 documents

==================================================
✅ Teams import complete!
📊 Total teams imported: 35
   - 30 current teams
   - 5 historical teams

[Similar output for seasons...]

📦 PHASE 2: Player-Team-Seasons
[Transformation and matching output...]

============================================================
📊 IMPORT SUMMARY
============================================================

✅ Completed Imports:
   ✅ Teams
   ✅ Seasons
   ✅ Player Team Seasons

📈 Success Rate: 3/3
⏱️  Total Time: 5.2 minutes

🎉 ALL IMPORTS SUCCESSFUL!

🚀 Your Firestore database now contains:
   • 4,775 players (already imported)
   • 35 teams
   • 79 seasons
   • ~26,000 player-team-season records

💡 You can now query player careers, team rosters, and more!

============================================================
```

### Firestore Collections

```
Firebase Project
└── Firestore Database
    ├── players (4,775 documents) ✅ Already exists
    ├── teams (35 documents) ✨ NEW
    ├── seasons (79 documents) ✨ NEW
    └── player_team_seasons (~26,000 documents) ✨ NEW
```

---

## 🔍 Verification

### Check in Firebase Console

1. Go to Firebase Console → Firestore Database
2. Check collection counts:
   - `teams`: 35 documents
   - `seasons`: 79 documents
   - `player_team_seasons`: ~26,000 documents

### Test Queries in Code

```typescript
import { 
  getAllTeams, 
  getAllSeasons, 
  getPlayerCareer,
  getTeamRoster
} from './src/lib/firebase';

// Get all teams
const teams = await getAllTeams();
console.log(`Teams: ${teams.length}`); // Should be 35

// Get all seasons
const seasons = await getAllSeasons();
console.log(`Seasons: ${seasons.length}`); // Should be 79

// Get LeBron's career (replace with actual player ID)
const career = await getPlayerCareer('lebron-player-id');
console.log(career); // Should show CLE, MIA, CLE, LAL progression

// Get 2009-10 Lakers roster
const roster = await getTeamRoster(14, 64);
console.log(roster); // Should include Kobe, Pau Gasol, Derek Fisher, etc.
```

---

## 🎯 Deploy Firestore Indexes

After import, deploy the composite indexes:

```bash
npm run firebase:deploy
```

This deploys the indexes defined in `firestore.indexes.json`.

**Note**: Index creation can take a few minutes. Check progress in Firebase Console → Firestore → Indexes.

---

## 🧪 Example Queries

### Get Player's Complete Career

```typescript
import { getPlayerCareer } from './src/lib/firebase';

const career = await getPlayerCareer('player-id-here');

// Returns:
[
  {
    player_name: "LeBron James",
    team_abbr: "CLE",
    team_name: "Cleveland Cavaliers",
    season_label: "2003-04",
    games_played: 79
  },
  {
    player_name: "LeBron James",
    team_abbr: "MIA",
    team_name: "Miami Heat",
    season_label: "2010-11",
    games_played: 79
  },
  // ... rest of career
]
```

### Get Team Roster for a Season

```typescript
import { getTeamRoster } from './src/lib/firebase';

const roster = await getTeamRoster(14, 64); // Lakers, 2009-10 season

// Returns all players who played for Lakers in 2009-10
```

### Get All Players Who Played for a Team

```typescript
import { getPlayersByTeam } from './src/lib/firebase';

const lakersPlayers = await getPlayersByTeam('LAL');

// Returns array of unique player names who ever played for Lakers
```

### Get Season Statistics

```typescript
import { getSeasonStats } from './src/lib/firebase';

const stats = await getSeasonStats(64); // 2009-10 season

// Returns:
{
  totalPlayers: 450,   // Total players in league
  totalGames: 13140,   // Total games played
  teams: 30            // Number of teams
}
```

---

## ⚠️ Troubleshooting

### Import fails with "Firebase not initialized"
**Solution**: Check that `.env.local` exists and has all Firebase credentials

### Import fails with "File not found"
**Solution**: Verify NBA Database project is at `../NBA Database/` relative to this project

### Low match rate on player-team-seasons
**Possible causes**:
- Players collection not populated
- Teams collection not populated
- Data quality issues in source CSV

**Solution**: Check console output for specific unmatched records

### Import is very slow
**This is normal!** ~26,000 records take 3-5 minutes due to:
- Firestore write rate limits
- Data transformation and matching
- Batch commits (500 writes per batch)

---

## 📚 Documentation

- **[FIREBASE_IMPORT_PLAN.md](./FIREBASE_IMPORT_PLAN.md)** - Complete Firebase implementation plan
- **[scripts/README.md](../scripts/README.md)** - Detailed script documentation
- **[DATABASE_TABLES_OVERVIEW.md](./DATABASE_TABLES_OVERVIEW.md)** - Collection structures
- **[DATABASE_IMPORT_SUMMARY.md](./DATABASE_IMPORT_SUMMARY.md)** - Quick reference

---

## 🎉 Next Steps

After successful import:

1. **Test the queries** - Try the example queries above
2. **Build features** - Use the new data in your application
3. **Explore the data** - Browse collections in Firebase Console

### Feature Ideas

Now that you have complete NBA data, you can build:

- 📊 Player career timeline visualization
- 🏆 Team roster history by season
- 🔍 Advanced player search (by team, position, season)
- 📈 Statistical comparisons
- 🗺️ Player journey maps (teams played for)
- 📅 "On this day" in NBA history
- And much more!

---

## 🚀 Ready to Import?

Run this command to start:

```bash
npm run firebase:import-all
```

Sit back and watch the magic happen! ✨

---

**Questions?** Check the documentation or review the script comments for details.

**Good luck!** 🏀

