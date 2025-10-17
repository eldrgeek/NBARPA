# NBA Database Import - Firebase Implementation Plan

## ✅ Decision Made: Use Firebase/Firestore

**Rationale**: Existing Firebase integration already in place, players already imported.

---

## 🗄️ Firestore Collections Structure

### Collection: `players` (✅ Already Exists)
```typescript
{
  id: string,                    // Auto-generated or player_id
  full_name: string,
  nicknames: string,
  position: string,
  birth_date: string | null
}
```
**Status**: ✅ 4,775 players already imported

### Collection: `teams` (🆕 To Create)
```typescript
{
  team_id: number,               // Use CSV team_id as document ID
  team_name: string,
  abbreviation: string,
  location: string
}
```
**Records**: 35 teams

### Collection: `seasons` (🆕 To Create)
```typescript
{
  season_id: number,             // Use CSV season_id as document ID
  season_label: string,          // "2023-24"
  start_year: number,            // 2023
  end_year: number               // 2024
}
```
**Records**: 79 seasons

### Collection: `player_team_seasons` (🆕 To Create)
```typescript
{
  id: string,                    // Auto-generated
  player_id: string,             // Reference to players collection
  team_id: number,               // Reference to teams collection
  season_id: number,             // Reference to seasons collection
  games_played: number,
  player_name: string,           // Denormalized for easier queries
  team_abbr: string,             // Denormalized for easier queries
  season_label: string           // Denormalized for easier queries
}
```
**Records**: ~26,000 after cleaning

---

## 🎯 Firebase-Specific Advantages

1. ✅ **Players already imported** - No migration needed!
2. ✅ **Serverless** - No database server to manage
3. ✅ **Real-time** - Can add live updates if needed
4. ✅ **Existing integration** - Authentication, imports already working

### Firebase Considerations

**Pros:**
- No additional setup needed
- Players already there
- Existing import script can be reused/modified
- Good for document-based queries

**Cons:**
- No native JOIN operations (need denormalization or multiple queries)
- Queries require proper indexing
- Cost scales with reads/writes

**Solution**: Use **denormalization** - store frequently accessed data redundantly

---

## 📋 Implementation Plan

### Phase 1: Import Core Collections (2 hours)

Simple imports using existing Firebase integration:

#### 1.1 Import Teams Collection
```typescript
// scripts/firebase-import-teams.ts
import { importTeams } from '../src/lib/firebase';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

const csvPath = '../NBA Database/nba_data/teams.csv';
const fileContent = readFileSync(csvPath, 'utf-8');
const teams = parse(fileContent, {
  columns: true,
  skip_empty_lines: true,
  trim: true
});

await importTeams(teams); // Batch import
```

#### 1.2 Import Seasons Collection
```typescript
// scripts/firebase-import-seasons.ts
import { importSeasons } from '../src/lib/firebase';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

const csvPath = '../NBA Database/nba_data/seasons.csv';
const fileContent = readFileSync(csvPath, 'utf-8');
const seasons = parse(fileContent, {
  columns: true,
  skip_empty_lines: true,
  trim: true
});

await importSeasons(seasons); // Batch import
```

### Phase 2: Clean & Import Player-Team-Seasons (4-6 hours)

Transform and import with denormalization:

```typescript
// scripts/firebase-import-player-team-seasons.ts

interface PlayerTeamSeason {
  player_id: string;
  team_id: number;
  season_id: number;
  games_played: number;
  // Denormalized fields for easier queries
  player_name: string;
  team_abbr: string;
  season_label: string;
}

async function importPlayerTeamSeasons() {
  // 1. Load unmatched_pts.csv
  const records = loadUnmatchedData();
  
  // 2. Load reference data from Firestore
  const players = await fetchAllPlayersFromFirestore();
  const teams = await fetchAllTeamsFromFirestore();
  const seasons = await fetchAllSeasonsFromFirestore();
  
  // 3. Transform and match
  const matched: PlayerTeamSeason[] = [];
  
  for (const record of records) {
    const teamAbbr = mapTeamName(record.team_abbr); // "Team.BOSTON_CELTICS" → "BOS"
    const team = teams.find(t => t.abbreviation === teamAbbr);
    const player = findBestPlayerMatch(record.player_name, players);
    const season = seasons.find(s => s.season_id === record.season_id);
    
    if (player && team && season) {
      matched.push({
        player_id: player.id,
        team_id: team.team_id,
        season_id: season.season_id,
        games_played: parseInt(record.games_played),
        // Denormalized fields
        player_name: player.full_name,
        team_abbr: team.abbreviation,
        season_label: season.season_label
      });
    }
  }
  
  // 4. Import in batches to Firestore
  await importPlayerTeamSeasonsToFirestore(matched);
}
```

---

## 🔧 Firebase Functions to Add

Update `src/lib/firebase.ts` with:

```typescript
// Team operations
export async function importTeams(teams: Team[]): Promise<void>;
export async function getTeamById(teamId: number): Promise<Team | null>;
export async function getTeamByAbbreviation(abbr: string): Promise<Team | null>;
export async function getAllTeams(): Promise<Team[]>;

// Season operations
export async function importSeasons(seasons: Season[]): Promise<void>;
export async function getSeasonById(seasonId: number): Promise<Season | null>;
export async function getAllSeasons(): Promise<Season[]>;

// Player-Team-Season operations
export async function importPlayerTeamSeasons(pts: PlayerTeamSeason[]): Promise<void>;
export async function getPlayerCareer(playerId: string): Promise<PlayerTeamSeason[]>;
export async function getTeamRoster(teamId: number, seasonId: number): Promise<PlayerTeamSeason[]>;
export async function searchPlayersByTeam(teamAbbr: string): Promise<string[]>;
```

---

## 📝 Firestore Query Examples

### Get Player's Career
```typescript
const career = await getDocs(
  query(
    collection(db, 'player_team_seasons'),
    where('player_id', '==', playerId),
    orderBy('season_id', 'asc')
  )
);

// Returns: [{team_abbr: "CLE", season_label: "2003-04", games_played: 79}, ...]
```

### Get Team Roster for Season
```typescript
const roster = await getDocs(
  query(
    collection(db, 'player_team_seasons'),
    where('team_id', '==', 14), // Lakers
    where('season_id', '==', 64) // 2009-10
  )
);

// Returns: [{player_name: "Kobe Bryant", games_played: 73}, ...]
```

### Get All Players Who Played for Team
```typescript
const allPlayers = await getDocs(
  query(
    collection(db, 'player_team_seasons'),
    where('team_abbr', '==', 'LAL')
  )
);

// Extract unique player names
const uniquePlayers = [...new Set(allPlayers.docs.map(d => d.data().player_name))];
```

### Complex Query: Player's Teams History
```typescript
async function getPlayerTeamsHistory(playerId: string) {
  const career = await getDocs(
    query(
      collection(db, 'player_team_seasons'),
      where('player_id', '==', playerId),
      orderBy('season_id', 'asc')
    )
  );
  
  return career.docs.map(doc => ({
    team: doc.data().team_abbr,
    season: doc.data().season_label,
    games: doc.data().games_played
  }));
}
```

---

## 🗂️ Firestore Indexes Required

Create these composite indexes in Firebase Console:

```
Collection: player_team_seasons
Indexes:
1. player_id (ASC) + season_id (ASC)
2. team_id (ASC) + season_id (ASC)
3. team_abbr (ASC) + season_id (ASC)
4. player_name (ASC) + season_id (ASC)
```

Or use `firebase.indexes.json`:
```json
{
  "indexes": [
    {
      "collectionGroup": "player_team_seasons",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "player_id", "order": "ASCENDING"},
        {"fieldPath": "season_id", "order": "ASCENDING"}
      ]
    },
    {
      "collectionGroup": "player_team_seasons",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "team_id", "order": "ASCENDING"},
        {"fieldPath": "season_id", "order": "ASCENDING"}
      ]
    }
  ]
}
```

---

## 📦 Import Scripts Structure

```
scripts/
├── firebase-import-teams.ts              # Import teams collection
├── firebase-import-seasons.ts            # Import seasons collection
├── firebase-import-player-team-seasons.ts # Transform & import PTS
├── firebase-import-all.ts                # Master orchestrator
└── utils/
    ├── team-mapper.ts                    # Team name transformation
    ├── player-matcher.ts                 # Fuzzy player matching
    └── firebase-batch.ts                 # Batch import utilities
```

---

## 🔄 Firestore Batch Import Pattern

```typescript
// utils/firebase-batch.ts

import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '../src/lib/firebase';

export async function batchImport(
  collectionName: string,
  data: any[],
  batchSize: number = 500
) {
  console.log(`📤 Importing ${data.length} documents to ${collectionName}...`);
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = writeBatch(db);
    const chunk = data.slice(i, i + batchSize);
    
    for (const item of chunk) {
      const docId = item.id || item.team_id || item.season_id;
      const docRef = doc(collection(db, collectionName), docId.toString());
      batch.set(docRef, item);
    }
    
    await batch.commit();
    console.log(`✅ Imported ${Math.min(i + batchSize, data.length)}/${data.length}`);
  }
  
  console.log(`🎉 Completed import of ${data.length} documents!`);
}
```

---

## 🧪 Testing Strategy

### 1. Verify Imports
```typescript
// After each import
const teamsCount = await getCountFromServer(collection(db, 'teams'));
console.log(`Teams: ${teamsCount.data().count}`); // Should be 35

const seasonsCount = await getCountFromServer(collection(db, 'seasons'));
console.log(`Seasons: ${seasonsCount.data().count}`); // Should be 79
```

### 2. Test Queries
```typescript
// Test player career query
const lebronCareer = await getPlayerCareer('lebron-james-id');
console.log(lebronCareer); // Should show CLE, MIA, CLE, LAL progression

// Test team roster
const lakersRoster = await getTeamRoster(14, 64); // 2009-10 Lakers
console.log(lakersRoster); // Should include Kobe, Pau, etc.
```

### 3. Validate Data Quality
```typescript
// Check for orphaned records
const pts = await getDocs(collection(db, 'player_team_seasons'));
const orphans = pts.docs.filter(async doc => {
  const player = await getDoc(doc(db, 'players', doc.data().player_id));
  return !player.exists();
});
console.log(`Orphaned records: ${orphans.length}`); // Should be 0
```

---

## ⏱️ Updated Timeline

### Phase 1: Core Collections (2 hours)
- ✅ Teams collection import (30 min)
- ✅ Seasons collection import (30 min)
- ✅ Verify and test (1 hour)

### Phase 2: Player-Team-Seasons (4-6 hours)
- ⚠️ Build team mapper (1 hour)
- ⚠️ Build player matcher (1 hour)
- ⚠️ Transform data (1 hour)
- ⚠️ Import with denormalization (1-2 hours)
- ⚠️ Create Firestore indexes (30 min)
- ⚠️ Testing and verification (1 hour)

**Total: 6-8 hours**

---

## 🚀 Quick Start Commands

```bash
# Install dependencies (if needed)
npm install firebase-admin

# Import teams
npm run firebase:import-teams

# Import seasons
npm run firebase:import-seasons

# Import player-team-seasons (with transformation)
npm run firebase:import-pts

# Or all at once
npm run firebase:import-all
```

Add to `package.json`:
```json
{
  "scripts": {
    "firebase:import-teams": "tsx scripts/firebase-import-teams.ts",
    "firebase:import-seasons": "tsx scripts/firebase-import-seasons.ts",
    "firebase:import-pts": "tsx scripts/firebase-import-player-team-seasons.ts",
    "firebase:import-all": "tsx scripts/firebase-import-all.ts"
  }
}
```

---

## 💡 Denormalization Strategy

Since Firestore doesn't support JOINs, we denormalize frequently-accessed data:

### player_team_seasons document:
```typescript
{
  // Foreign keys
  player_id: "abc123",
  team_id: 14,
  season_id: 64,
  
  // Denormalized data (for query results without additional lookups)
  player_name: "Kobe Bryant",
  team_abbr: "LAL",
  team_name: "Los Angeles Lakers",
  season_label: "2009-10",
  
  // Stats
  games_played: 73
}
```

**Benefits:**
- ✅ Single query gets all needed info
- ✅ No need for multiple lookups
- ✅ Faster query performance

**Trade-offs:**
- ⚠️ More storage space
- ⚠️ Need to update multiple places if team name changes (rare)

---

## 📊 Expected Firestore Structure After Import

```
Firestore Database
├── players (4,775 documents) ✅ Already exists
│   ├── player_1
│   ├── player_2
│   └── ...
│
├── teams (35 documents) 🆕
│   ├── 1 (Atlanta Hawks)
│   ├── 2 (Boston Celtics)
│   └── ...
│
├── seasons (79 documents) 🆕
│   ├── 1 (1946-47)
│   ├── 2 (1947-48)
│   └── ...
│
└── player_team_seasons (~26,000 documents) 🆕
    ├── auto-id-1 {player_id: "abc", team_id: 14, season_id: 64, ...}
    ├── auto-id-2 {player_id: "def", team_id: 2, season_id: 77, ...}
    └── ...
```

---

## ✅ Next Steps

1. **Review this Firebase-specific plan**
2. **Confirm approach** (denormalization strategy OK?)
3. **Start with Phase 1** (teams + seasons import)
4. **Build transformation utilities** for Phase 2
5. **Create Firestore indexes** before importing PTS

---

## 🎯 Ready to Implement?

Since Firebase is confirmed, I can now:
1. ✅ Create the Firebase import scripts
2. ✅ Build the team mapper utility
3. ✅ Build the player matcher utility
4. ✅ Update `src/lib/firebase.ts` with new functions
5. ✅ Add npm scripts for easy execution

**Say the word and I'll start building!** 🚀

