# NBA Database Import Analysis & Plan

## Executive Summary

The **NBA Database** project contains 4 CSV files with NBA data. You've already imported the players data (4,775 players) to Firestore. The remaining data that needs importing:

1. ✅ **teams.csv** - 35 teams (current + historical) - Ready to import
2. ✅ **seasons.csv** - 79 seasons (1946-47 to 2024-25) - Ready to import  
3. ⚠️ **player_team_seasons.csv** - EMPTY (only header)
4. ⚠️ **unmatched_pts.csv** - 26,342 player-team-season records that need cleaning

---

## Detailed Analysis

### Available Data Files

Located at: `/Users/MikeWolf/Projects/NBA Database/nba_data/`

#### 1. teams.csv (35 teams, Ready ✅)
```csv
team_id,team_name,abbreviation,location
1,Atlanta Hawks,ATL,"Atlanta, Georgia"
2,Boston Celtics,BOS,"Boston, Massachusetts"
3,Brooklyn Nets,BKN,"Brooklyn, New York"
...
```

**Status**: Clean and ready for import  
**Records**: 35 teams (30 current + 5 historical)

#### 2. seasons.csv (79 seasons, Ready ✅)
```csv
season_id,season_label,start_year,end_year
1,1946-47,1946,1947
2,1947-48,1947,1948
...
```

**Status**: Clean and ready for import  
**Records**: 79 complete NBA seasons

#### 3. players.csv (4,775 players, Already Imported ✅)
```csv
player_id,full_name,nicknames,position,birth_date
```

**Status**: Already imported to Firestore  
**Records**: 4,775 NBA players (all-time)

#### 4. player_team_seasons.csv (EMPTY ❌)
**Status**: File exists but only contains header row  
**Problem**: Data collection failed/incomplete

#### 5. unmatched_pts.csv (26,342 records, Needs Cleaning ⚠️)
```csv
player_name,team_abbr,season_year,season_id,games_played,reason
Jayson Tatum,Team.BOSTON_CELTICS,2023,77,74,"Player: ✓, Team: ✗"
Joel Embiid,Team.PHILADELPHIA_76ERS,2023,77,66,"Player: ✓, Team: ✗"
```

**Status**: Contains data but needs transformation  
**Problems**:
- Team abbreviations in wrong format: "Team.BOSTON_CELTICS" instead of "BOS"
- Player names may not exactly match `players.csv`
- Marked as "unmatched" during data collection

---

## Database Architecture Decision

### Current Situation
- **Players**: Currently in Firebase/Firestore
- **Schema**: PostgreSQL schema defined in `src/db/schema.sql`
- **Need**: Relational queries for teams, seasons, player careers

### Recommendation: Migrate to PostgreSQL (Netlify DB/Neon)

**Why PostgreSQL?**
1. ✅ Relational data with foreign keys (players → teams → seasons)
2. ✅ Complex queries (team rosters, player careers, season stats)
3. ✅ Schema already fully defined and optimized
4. ✅ Better for joins and aggregations
5. ✅ Standard SQL makes queries easier

**Migration Path:**
- Import all data to PostgreSQL database
- Keep Firebase for authentication/user management
- Use PostgreSQL for NBA data queries

---

## Data Collection Issue Analysis

### Why is player_team_seasons.csv empty?

Looking at `progress.json`:
```json
{"last_completed_year": 1947}
```

The data collection script (`GetFullData.py`) only completed 1 year (1947) before stopping. This happened because:

1. **Rate Limiting**: Basketball Reference API has strict rate limits (429 errors)
2. **Incomplete Run**: Script needs to run for 30-60 minutes to collect all 79 seasons
3. **Team Matching Issues**: Teams couldn't be matched properly (hence "unmatched_pts.csv")

### What's in unmatched_pts.csv?

The file contains player-team-season records where the team format doesn't match:
- **Script received**: `"Team.BOSTON_CELTICS"` (from Basketball Reference API)
- **Expected format**: `"BOS"` (abbreviation from teams.csv)

The `GetFullData.py` script HAS fuzzy matching logic (line 186-195) but it's not matching these properly.

---

## Recommended Implementation Plan

### Phase 1: Import Clean Tables (1-2 hours)

**Simple, straightforward imports:**

1. **Import seasons.csv** → `seasons` table (79 records)
2. **Import teams.csv** → `teams` table (35 records)
3. **Re-import players.csv** → `players` table (4,775 records)

**Script to create**: `scripts/import-core-tables.ts`

```typescript
// Import order (respects foreign keys):
// 1. seasons (no dependencies)
// 2. teams (no dependencies)  
// 3. players (no dependencies)
// 4. player_team_seasons (depends on all above)
```

### Phase 2: Clean & Import Player-Team-Seasons (4-6 hours)

**Two Options:**

#### Option A: Transform unmatched_pts.csv (Recommended)
**Pros**: Use existing data (26,342 records)  
**Cons**: Need to build transformation logic

**Steps:**
1. Create team abbreviation mapper
2. Implement fuzzy player name matching
3. Transform and import data

#### Option B: Re-run Data Collection
**Pros**: Get fresh, complete data  
**Cons**: Takes 30-60 minutes, may hit rate limits

**Steps:**
1. Fix the data collection script
2. Resume from year 1948
3. Run to completion (all 79 seasons)

### Phase 3: Database Setup & Testing (2-3 hours)

1. Set up Netlify DB / Neon PostgreSQL
2. Run schema.sql to create tables
3. Import all data
4. Test queries and relationships
5. Update application code

---

## Detailed Implementation: Option A (Transform Existing Data)

### Step 1: Create Team Name Mapper

```typescript
// scripts/utils/team-mapper.ts

const TEAM_MAPPINGS = {
  'Team.ATLANTA_HAWKS': 'ATL',
  'Team.BOSTON_CELTICS': 'BOS',
  'Team.BROOKLYN_NETS': 'BKN',
  'Team.CHARLOTTE_HORNETS': 'CHA',
  'Team.CHICAGO_BULLS': 'CHI',
  'Team.CLEVELAND_CAVALIERS': 'CLE',
  'Team.DALLAS_MAVERICKS': 'DAL',
  'Team.DENVER_NUGGETS': 'DEN',
  'Team.DETROIT_PISTONS': 'DET',
  'Team.GOLDEN_STATE_WARRIORS': 'GSW',
  'Team.HOUSTON_ROCKETS': 'HOU',
  'Team.INDIANA_PACERS': 'IND',
  'Team.LOS_ANGELES_CLIPPERS': 'LAC',
  'Team.LOS_ANGELES_LAKERS': 'LAL',
  'Team.MEMPHIS_GRIZZLIES': 'MEM',
  'Team.MIAMI_HEAT': 'MIA',
  'Team.MILWAUKEE_BUCKS': 'MIL',
  'Team.MINNESOTA_TIMBERWOLVES': 'MIN',
  'Team.NEW_ORLEANS_PELICANS': 'NOP',
  'Team.NEW_YORK_KNICKS': 'NYK',
  'Team.OKLAHOMA_CITY_THUNDER': 'OKC',
  'Team.ORLANDO_MAGIC': 'ORL',
  'Team.PHILADELPHIA_76ERS': 'PHI',
  'Team.PHILADELPHIA_SEVENTY_SIXERS': 'PHI', // Special case
  'Team.PHOENIX_SUNS': 'PHX',
  'Team.PORTLAND_TRAIL_BLAZERS': 'POR',
  'Team.SACRAMENTO_KINGS': 'SAC',
  'Team.SAN_ANTONIO_SPURS': 'SAS',
  'Team.TORONTO_RAPTORS': 'TOR',
  'Team.UTAH_JAZZ': 'UTA',
  'Team.WASHINGTON_WIZARDS': 'WAS',
  // Historical teams
  'Team.SEATTLE_SUPERSONICS': 'SEA',
  'Team.NEW_JERSEY_NETS': 'NJN',
  'Team.VANCOUVER_GRIZZLIES': 'VAN',
  'Team.CHARLOTTE_BOBCATS': 'CHB',
  'Team.MINNEAPOLIS_LAKERS': 'MNL',
};

export function mapTeamAbbreviation(brFormat: string): string | null {
  return TEAM_MAPPINGS[brFormat] || null;
}
```

### Step 2: Create Player Name Matcher

```typescript
// scripts/utils/player-matcher.ts

import { distance } from 'fastest-levenshtein';

export function findBestPlayerMatch(
  targetName: string,
  playerList: Array<{ player_id: number; full_name: string }>,
  threshold: number = 0.9
): number | null {
  
  let bestMatch = null;
  let bestScore = 0;
  
  const normalizedTarget = normalizeName(targetName);
  
  for (const player of playerList) {
    const normalizedPlayer = normalizeName(player.full_name);
    
    // Exact match
    if (normalizedTarget === normalizedPlayer) {
      return player.player_id;
    }
    
    // Fuzzy match using Levenshtein distance
    const similarity = calculateSimilarity(normalizedTarget, normalizedPlayer);
    
    if (similarity > bestScore && similarity >= threshold) {
      bestScore = similarity;
      bestMatch = player.player_id;
    }
  }
  
  return bestMatch;
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z\s]/g, ''); // Remove non-letters
}

function calculateSimilarity(str1: string, str2: string): number {
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 1.0;
  const dist = distance(str1, str2);
  return 1 - (dist / maxLength);
}
```

### Step 3: Create Import Script

```typescript
// scripts/import-player-team-seasons.ts

import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { mapTeamAbbreviation } from './utils/team-mapper';
import { findBestPlayerMatch } from './utils/player-matcher';

interface UnmatchedRecord {
  player_name: string;
  team_abbr: string;
  season_year: string;
  season_id: string;
  games_played: string;
  reason: string;
}

async function importPlayerTeamSeasons() {
  // 1. Load unmatched_pts.csv
  const csvPath = '../NBA Database/nba_data/unmatched_pts.csv';
  const fileContent = readFileSync(csvPath, 'utf-8');
  const records: UnmatchedRecord[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });
  
  console.log(`📂 Loaded ${records.length} unmatched records`);
  
  // 2. Load players, teams, seasons from database
  const players = await fetchAllPlayers();
  const teams = await fetchAllTeams();
  const seasons = await fetchAllSeasons();
  
  // Create lookup maps
  const teamsByAbbr = new Map(teams.map(t => [t.abbreviation, t.team_id]));
  
  // 3. Process and match records
  const matched = [];
  const stillUnmatched = [];
  
  for (const record of records) {
    // Map team abbreviation
    const teamAbbr = mapTeamAbbreviation(record.team_abbr);
    const teamId = teamAbbr ? teamsByAbbr.get(teamAbbr) : null;
    
    // Match player
    const playerId = findBestPlayerMatch(record.player_name, players);
    
    if (playerId && teamId) {
      matched.push({
        player_id: playerId,
        team_id: teamId,
        season_id: parseInt(record.season_id),
        games_played: parseInt(record.games_played)
      });
    } else {
      stillUnmatched.push(record);
    }
  }
  
  console.log(`✅ Matched: ${matched.length} records`);
  console.log(`❌ Still unmatched: ${stillUnmatched.length} records`);
  
  // 4. Import to database in batches
  await importInBatches(matched, 500);
  
  // 5. Save still-unmatched for review
  if (stillUnmatched.length > 0) {
    console.log(`⚠️ Saving ${stillUnmatched.length} unmatched records for manual review`);
    // Save to file for investigation
  }
}
```

---

## File Structure for Import Scripts

```
scripts/
├── import-core-tables.ts          # Import seasons, teams, players
├── import-player-team-seasons.ts  # Transform & import PTS data
├── import-all-nba-data.ts         # Master orchestrator
└── utils/
    ├── team-mapper.ts              # Team abbreviation conversion
    ├── player-matcher.ts           # Fuzzy player name matching
    ├── db-helpers.ts               # Database connection utilities
    └── csv-loader.ts               # CSV parsing utilities
```

---

## Database Functions to Add

Update `src/lib/database.ts` with:

```typescript
// Team queries
export async function getTeamById(teamId: number): Promise<Team>;
export async function getTeamByAbbreviation(abbr: string): Promise<Team>;
export async function getAllTeams(): Promise<Team[]>;

// Season queries
export async function getSeasonById(seasonId: number): Promise<Season>;
export async function getAllSeasons(): Promise<Season[]>;

// Player career queries
export async function getPlayerCareer(playerId: number): Promise<CareerSummary>;
export async function getPlayerSeasons(playerId: number): Promise<PlayerSeason[]>;

// Team roster queries
export async function getTeamRoster(teamId: number, seasonId: number): Promise<Player[]>;
export async function getTeamSeasons(teamId: number): Promise<TeamSeason[]>;

// Search queries
export async function searchPlayersByTeam(teamName: string): Promise<Player[]>;
export async function searchPlayersByPosition(position: string): Promise<Player[]>;
```

---

## Timeline & Effort Estimate

### Immediate Tasks (Can start now)
- ✅ **Phase 1**: Import core tables (seasons, teams, players) - **2 hours**
  - Write import scripts
  - Set up database connection
  - Run imports and verify

### Medium-term Tasks (Requires data cleaning)
- ⚠️ **Phase 2**: Clean and import player-team-seasons - **4-6 hours**
  - Build team mapper
  - Build player matcher
  - Test with sample data
  - Full import and verification

### Optional Tasks (Data completion)
- 🔄 **Re-run data collection** - **30-60 minutes runtime + monitoring**
  - Fix GetFullData.py script
  - Resume from 1948
  - Complete all 79 seasons

**Total Estimated Time**: 6-8 hours development + testing

---

## Testing Strategy

### 1. Incremental Testing
- Import seasons first, verify count (79)
- Import teams, verify count (35)
- Import players, verify count (4,775)
- Sample test player-team-seasons before full import

### 2. Data Quality Checks
```sql
-- Verify counts
SELECT 'seasons' as table, COUNT(*) FROM seasons
UNION ALL SELECT 'teams', COUNT(*) FROM teams
UNION ALL SELECT 'players', COUNT(*) FROM players
UNION ALL SELECT 'player_team_seasons', COUNT(*) FROM player_team_seasons;

-- Check relationships
SELECT COUNT(*) as orphaned_pts 
FROM player_team_seasons pts
LEFT JOIN players p ON pts.player_id = p.player_id
WHERE p.player_id IS NULL;

-- Sample queries
SELECT p.full_name, t.team_name, s.season_label, pts.games_played
FROM player_team_seasons pts
JOIN players p ON pts.player_id = p.player_id
JOIN teams t ON pts.team_id = t.team_id
JOIN seasons s ON pts.season_id = s.season_id
WHERE p.full_name LIKE '%LeBron%'
ORDER BY s.season_id;
```

---

## Next Steps

### To proceed, you need to decide:

1. **Database Platform**: Confirm PostgreSQL (Netlify DB/Neon)?
2. **Import Approach**: 
   - Option A: Transform existing unmatched_pts.csv
   - Option B: Re-run data collection
3. **Priority**: Import all tables now, or start with core tables only?

### Recommended Immediate Actions:

1. ✅ Set up Netlify DB / Neon PostgreSQL database
2. ✅ Run `schema.sql` to create tables
3. ✅ Start with Phase 1 (core tables import)
4. ⏸️ Evaluate player-team-seasons data quality
5. ⏸️ Decide on Option A vs B for Phase 2

---

## Additional Resources

### Files in NBA Database Project
- `GetFullData.py` - Main data collection script (with resume capability)
- `GetData.py` - Alternative using NBA official API
- `nba_data/` - Output directory with CSV files
- `progress.json` - Tracks collection progress

### Documentation
- See `DATABASE_SETUP.md` for database setup guide
- See `src/db/schema.sql` for complete schema definition

### Questions?
Let me know if you want me to start implementing any phase!

