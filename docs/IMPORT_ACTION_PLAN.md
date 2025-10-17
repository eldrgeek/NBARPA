# NBA Database Import - Action Plan

## Quick Summary

**Goal**: Import teams, seasons, and player-team-seasons data from NBA Database project

**Status**: 
- ✅ Players already imported (4,775 records in Firestore)
- ✅ Teams CSV ready (35 teams)
- ✅ Seasons CSV ready (79 seasons)
- ⚠️ Player-team-seasons needs data cleaning (26,342 records)

---

## Three-Phase Implementation

### Phase 1: Core Tables (EASY - 2 hours)
**Import clean data that's ready to go**

Files to import:
- `seasons.csv` → 79 seasons (1946-47 through 2024-25)
- `teams.csv` → 35 teams (30 current + 5 historical)
- `players.csv` → 4,775 players (re-import to SQL from Firestore)

### Phase 2: Player-Team-Seasons (MEDIUM - 4-6 hours)
**Clean and transform the unmatched data**

Problem: Team names in wrong format
- Current: `"Team.BOSTON_CELTICS"`
- Need: `"BOS"`

Solution: Build transformation scripts
1. Team name mapper (Basketball Reference → abbreviation)
2. Fuzzy player name matcher (handle slight differences)
3. Import cleaned data

### Phase 3: Complete Data Collection (OPTIONAL - 30-60 min)
**Get remaining historical data**

Current: Only 1947 season collected (stopped due to rate limits)
Option: Re-run data collection for 1948-2024 (78 more seasons)

---

## Decision Points

### 1. Database Platform
**Recommendation**: PostgreSQL (Netlify DB/Neon)

Why?
- Better for relational data (players → teams → seasons)
- Schema already defined (`src/db/schema.sql`)
- Easier complex queries and joins
- Keep Firebase for auth, use PostgreSQL for NBA data

### 2. Player-Team-Seasons Approach

**Option A: Transform unmatched_pts.csv** ⭐ Recommended
- Pros: Use existing data (26,342 records), faster
- Cons: Need to build transformation logic
- Time: 4-6 hours

**Option B: Re-run data collection**
- Pros: Get fresh, complete data
- Cons: Takes 30-60 min, may hit rate limits again
- Time: 30-60 minutes + scripting

---

## Implementation Scripts Needed

```
scripts/
├── import-core-tables.ts          # Phase 1: Import seasons, teams, players
├── import-player-team-seasons.ts  # Phase 2: Transform & import PTS
├── import-all-nba-data.ts         # Master script
└── utils/
    ├── team-mapper.ts              # Map "Team.BOSTON_CELTICS" → "BOS"
    ├── player-matcher.ts           # Fuzzy match player names
    └── db-helpers.ts               # DB connection utilities
```

---

## Quick Start Commands

### Set up database
```bash
# 1. Set up Netlify DB (manual step in dashboard)
# 2. Get DATABASE_URL from Netlify
# 3. Add to .env.local

# 4. Run schema
npm run db:setup
```

### Import data
```bash
# Phase 1: Core tables
npm run import:core

# Phase 2: Player-team-seasons
npm run import:pts

# Or all at once:
npm run import:all
```

---

## Database Schema (Already Defined)

From `src/db/schema.sql`:

```sql
CREATE TABLE seasons (
    season_id SERIAL PRIMARY KEY,
    season_label VARCHAR(20),
    start_year INTEGER,
    end_year INTEGER
);

CREATE TABLE teams (
    team_id SERIAL PRIMARY KEY,
    team_name VARCHAR(100),
    abbreviation VARCHAR(5),
    location VARCHAR(100)
);

CREATE TABLE players (
    player_id SERIAL PRIMARY KEY,
    full_name VARCHAR(200),
    nicknames TEXT,
    position VARCHAR(50),
    birth_date DATE
);

CREATE TABLE player_team_seasons (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(player_id),
    team_id INTEGER REFERENCES teams(team_id),
    season_id INTEGER REFERENCES seasons(season_id),
    games_played INTEGER,
    UNIQUE(player_id, team_id, season_id)
);
```

---

## Expected Results

After complete import:
- ✅ 79 seasons
- ✅ 35 teams  
- ✅ 4,775 players
- ✅ ~26,000+ player-team-season records

Then you can query:
```typescript
// Get player's career
const career = await getPlayerCareer(playerId);
// Returns: [{team: "Lakers", season: "2003-04", games: 82}, ...]

// Get team roster for a season
const roster = await getTeamRoster(teamId, seasonId);
// Returns: All players on Lakers in 2009-10

// Search players by team
const players = await searchPlayersByTeam("Lakers");
// Returns: All players who ever played for Lakers
```

---

## Verification Queries

After import, run these to verify data quality:

```sql
-- Check counts
SELECT 'seasons' as table, COUNT(*) FROM seasons;    -- Should be 79
SELECT 'teams' as table, COUNT(*) FROM teams;        -- Should be 35
SELECT 'players' as table, COUNT(*) FROM players;    -- Should be 4,775
SELECT 'PTS' as table, COUNT(*) FROM player_team_seasons;  -- Should be ~26,000

-- Check relationships (should have no orphans)
SELECT COUNT(*) FROM player_team_seasons pts
LEFT JOIN players p ON pts.player_id = p.player_id
WHERE p.player_id IS NULL;

-- Sample data: LeBron's career
SELECT p.full_name, t.team_name, s.season_label, pts.games_played
FROM player_team_seasons pts
JOIN players p ON pts.player_id = p.player_id
JOIN teams t ON pts.team_id = t.team_id  
JOIN seasons s ON pts.season_id = s.season_id
WHERE p.full_name LIKE '%LeBron%'
ORDER BY s.season_id;
```

---

## Recommended Next Steps

1. **Review the detailed analysis**: See `DATABASE_IMPORT_ANALYSIS.md` for full details

2. **Make decisions**:
   - Confirm PostgreSQL as database platform
   - Choose Option A (transform) or B (re-scrape) for player-team-seasons

3. **Start Phase 1**:
   - Set up Netlify DB / Neon
   - Create import script for core tables
   - Import seasons, teams, players

4. **Then Phase 2**:
   - Build team mapper utility
   - Build player matcher utility
   - Transform and import player-team-seasons data

5. **Test & Verify**:
   - Run verification queries
   - Test sample queries
   - Update application code to use new database

---

## Questions to Answer

Before starting implementation:

1. ✅ **Database choice**: Use PostgreSQL (Netlify DB/Neon)?
2. ❓ **Player-team-seasons**: Transform existing (Option A) or re-scrape (Option B)?
3. ❓ **Priority**: Import everything now, or just core tables first?
4. ❓ **Data completion**: Do you want all 79 seasons, or is partial data OK?

---

## Ready to Start?

Let me know and I can:
1. Set up the database structure
2. Create the import scripts
3. Build the transformation utilities
4. Run the imports
5. Test and verify the data

Just say the word! 🚀

