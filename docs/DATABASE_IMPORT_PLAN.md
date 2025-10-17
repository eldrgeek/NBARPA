# NBA Database Import Plan

## Current Status Analysis

### What's Already Imported
- ✅ **Players**: ~4,775 players imported to Firestore (from `players.csv`)
  - Full name, nicknames, position, birth_date
  - Currently in Firestore collection

### What's Available in NBA Database Project

Located at: `/Users/MikeWolf/Projects/NBA Database/nba_data/`

1. **teams.csv** (35 teams)
   - Columns: `team_id`, `team_name`, `abbreviation`, `location`
   - Example: Atlanta Hawks, ATL, "Atlanta, Georgia"
   - Status: ✅ Ready to import

2. **seasons.csv** (79 seasons) 
   - Columns: `season_id`, `season_label`, `start_year`, `end_year`
   - Example: 1946-47, 1946, 1947
   - Status: ✅ Ready to import

3. **player_team_seasons.csv** (EMPTY)
   - Status: ❌ File is empty (only header row)
   - This is the critical junction table linking players → teams → seasons

4. **unmatched_pts.csv** (26,342 records)
   - Contains player-team-season data that couldn't be matched
   - Columns: `player_name`, `team_abbr`, `season_year`, `season_id`, `games_played`, `reason`
   - Issue: Team abbreviations are in wrong format (e.g., "Team.BOSTON_CELTICS" instead of "BOS")
   - Status: ⚠️ Needs data cleaning/transformation

## Database Schema (Already Defined)

The schema in `src/db/schema.sql` already defines all necessary tables:

```sql
- seasons (season_id, season_label, start_year, end_year)
- teams (team_id, team_name, abbreviation, location)
- players (player_id, full_name, nicknames, position, birth_date)
- player_team_seasons (id, player_id, team_id, season_id, games_played)
```

**Note**: Players are currently in Firestore, not in the SQL database defined by schema.sql

## Issues Identified

### 1. Database Platform Confusion
- **Current**: Players imported to Firebase/Firestore
- **Schema**: SQL schema (PostgreSQL) defined for Netlify DB/Neon
- **Decision needed**: Which database platform to use?

### 2. Player-Team-Season Data Problems
- The main junction table data is in `unmatched_pts.csv`
- Team names don't match the abbreviations in `teams.csv`
- Player names might not exactly match names in `players.csv`
- Needs data cleaning and matching logic

### 3. Incomplete Data Collection
- `progress.json` shows collection stopped at 1947
- Most NBA history is missing (1947-2024)

## Recommended Plan

### Phase 1: Clarify Database Strategy (DECISION REQUIRED)

**Option A: Stay with Firebase/Firestore**
- Pro: Players already imported
- Pro: Serverless, no database server needed
- Con: Not ideal for relational data with joins
- Con: Current schema.sql won't be used

**Option B: Move to Netlify DB (Neon PostgreSQL)**
- Pro: Better for relational data (teams, seasons, joins)
- Pro: Schema already defined and comprehensive
- Pro: SQL queries easier for career stats, team rosters, etc.
- Con: Need to re-import players from Firestore or directly from CSV
- Con: Requires Netlify DB setup

**Recommendation**: **Option B** - Use Netlify DB for better relational queries

### Phase 2: Import Core Tables (Simple)

Create an enhanced import script that imports in order:

1. **Import Seasons** (79 records)
   - Simple CSV import
   - No dependencies

2. **Import Teams** (35 records)
   - Simple CSV import
   - No dependencies

3. **Import Players** (4,775 records)
   - Re-import from CSV to SQL database
   - OR migrate from Firestore if staying with Firebase

### Phase 3: Clean and Import Player-Team-Seasons (Complex)

This is the challenging part. The data needs transformation:

**Approach A: Fix unmatched_pts.csv**
1. Parse team_abbr field to extract actual abbreviation
   - "Team.BOSTON_CELTICS" → "BOS"
   - "Team.DALLAS_MAVERICKS" → "DAL"
2. Match player_name to player_id from players table
3. Match team abbreviation to team_id from teams table
4. Use season_id from CSV
5. Import to player_team_seasons table

**Approach B: Re-scrape the data**
1. Fix the data collection script in NBA Database project
2. Re-run to get properly formatted player_team_seasons.csv
3. Import clean data

**Recommendation**: **Approach A** - Transform existing data

### Phase 4: Complete Data Collection (Optional)

- Fix NBA Database project's GetFullData.py
- Resume from 1948 and collect through current season (2023-24)
- This would give complete historical data

## Implementation Steps

### Step 1: Create Import Script Structure

```typescript
// scripts/import-all-nba-data.ts

async function importAllData() {
  // 1. Import seasons
  await importSeasons();
  
  // 2. Import teams  
  await importTeams();
  
  // 3. Import players
  await importPlayers();
  
  // 4. Clean and import player-team-seasons
  await importPlayerTeamSeasons();
}
```

### Step 2: Team Abbreviation Mapping

Create a mapping function to convert:
```
Team.BOSTON_CELTICS → BOS
Team.LOS_ANGELES_LAKERS → LAL
Team.GOLDEN_STATE_WARRIORS → GSW
etc.
```

### Step 3: Player Name Matching

Implement fuzzy matching for player names:
- Direct match first
- Normalize: trim, lowercase, remove accents
- Handle nicknames
- Use Levenshtein distance for close matches

### Step 4: Database Functions

Update `src/lib/database.ts` to include:
```typescript
- getPlayerCareerHistory(playerId) → all teams/seasons
- getTeamRoster(teamId, seasonId) → all players
- getSeasonStats(seasonId) → overview
- searchPlayersByTeam(teamName) → all players who played there
```

## Files to Create/Modify

### New Files
1. `scripts/import-all-nba-data.ts` - Master import script
2. `scripts/utils/team-mapper.ts` - Team abbreviation converter
3. `scripts/utils/player-matcher.ts` - Fuzzy player name matching
4. `scripts/clean-unmatched-data.ts` - Transform unmatched_pts.csv
5. `docs/DATABASE_IMPORT_PLAN.md` - This file

### Modified Files
1. `src/lib/database.ts` - Add new query functions
2. `package.json` - Add new npm scripts
3. `DATABASE_SETUP.md` - Update with new import process

## Estimated Complexity

- **Simple imports** (seasons, teams): 1-2 hours
- **Player import**: 1 hour (already done for Firestore, need SQL version)
- **Data cleaning and matching**: 4-6 hours
- **Testing and verification**: 2-3 hours
- **Documentation**: 1 hour

**Total**: 9-13 hours of development

## Next Steps

1. **Decide on database platform** (Firebase vs Netlify DB)
2. **Review and approve this plan**
3. **Start with Phase 2** (simple table imports)
4. **Build data cleaning utilities** for Phase 3
5. **Test with sample data** before full import
6. **Consider** whether to fix NBA Database project to collect remaining years

## Questions to Answer

1. Which database platform do you want to use?
2. Do you need the player-team-season data immediately, or can it wait?
3. Should we fix the NBA Database collection to get complete data (1948-2024)?
4. Are there other tables in the NBA Database project we should investigate?

## Additional Considerations

### Data Quality
- Need to verify team ID consistency
- Check for duplicate players
- Validate season ranges
- Handle team relocations/name changes

### Performance  
- Batch imports for large datasets
- Use database transactions
- Add appropriate indexes (already defined in schema)
- Consider pagination for queries

### Future Enhancements
- Real-time data updates
- Current season tracking
- Player stats (points, rebounds, etc.)
- Advanced analytics tables

