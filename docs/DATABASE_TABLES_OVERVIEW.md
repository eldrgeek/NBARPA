# NBA Database - Tables Overview

## Table Status Summary

| Table | Records | Status | Location | Ready to Import |
|-------|---------|--------|----------|-----------------|
| **players** | 4,775 | ✅ Imported | Firestore | ✅ Re-import to SQL |
| **teams** | 35 | 📁 Available | CSV | ✅ Ready |
| **seasons** | 79 | 📁 Available | CSV | ✅ Ready |
| **player_team_seasons** | ~26,000 | ⚠️ Needs cleaning | CSV (unmatched) | ⚠️ Transform needed |

---

## Table Details

### 1. players
**Status**: ✅ Already Imported (Firestore)  
**Records**: 4,775 NBA players (all-time: 1946-2025)  
**Source**: `../NBA Database/nba_data/players.csv`

```sql
CREATE TABLE players (
    player_id SERIAL PRIMARY KEY,
    full_name VARCHAR(200) NOT NULL,
    nicknames TEXT,
    position VARCHAR(50),
    birth_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Sample Data:**
```csv
player_id,full_name,nicknames,position,birth_date
1,Kareem Abdul-Jabbar,Lew Alcindor,C,1947-04-16
2,Michael Jordan,MJ,SG,1963-02-17
3,LeBron James,King James,SF,1984-12-30
```

**Action Needed**: Re-import to PostgreSQL (currently in Firestore)

---

### 2. teams
**Status**: ✅ Ready to Import  
**Records**: 35 teams (30 current + 5 historical)  
**Source**: `../NBA Database/nba_data/teams.csv`

```sql
CREATE TABLE teams (
    team_id SERIAL PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL,
    abbreviation VARCHAR(5) NOT NULL,
    location VARCHAR(100)
);
```

**Sample Data:**
```csv
team_id,team_name,abbreviation,location
1,Atlanta Hawks,ATL,"Atlanta, Georgia"
2,Boston Celtics,BOS,"Boston, Massachusetts"
14,Los Angeles Lakers,LAL,"Los Angeles, California"
31,Seattle SuperSonics,SEA,"Seattle, Washington"
```

**Current Teams**: 30
- All 30 active NBA franchises

**Historical Teams**: 5
- Seattle SuperSonics (SEA)
- Minneapolis Lakers (MNL)
- New Jersey Nets (NJN)
- Vancouver Grizzlies (VAN)
- Charlotte Bobcats (CHB)

**Action Needed**: Simple CSV import

---

### 3. seasons
**Status**: ✅ Ready to Import  
**Records**: 79 NBA seasons (1946-47 through 2024-25)  
**Source**: `../NBA Database/nba_data/seasons.csv`

```sql
CREATE TABLE seasons (
    season_id SERIAL PRIMARY KEY,
    season_label VARCHAR(20) NOT NULL,
    start_year INTEGER NOT NULL,
    end_year INTEGER NOT NULL
);
```

**Sample Data:**
```csv
season_id,season_label,start_year,end_year
1,1946-47,1946,1947
2,1947-48,1947,1948
77,2022-23,2022,2023
78,2023-24,2023,2024
79,2024-25,2024,2025
```

**Coverage**: Complete NBA history from inception to current season

**Action Needed**: Simple CSV import

---

### 4. player_team_seasons (Junction Table)
**Status**: ⚠️ Needs Data Cleaning  
**Records**: 26,342 records (in unmatched_pts.csv)  
**Source**: `../NBA Database/nba_data/unmatched_pts.csv`

```sql
CREATE TABLE player_team_seasons (
    id SERIAL PRIMARY KEY,
    player_id INTEGER NOT NULL REFERENCES players(player_id) ON DELETE CASCADE,
    team_id INTEGER NOT NULL REFERENCES teams(team_id) ON DELETE CASCADE,
    season_id INTEGER NOT NULL REFERENCES seasons(season_id) ON DELETE CASCADE,
    games_played INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, team_id, season_id)
);
```

**Current Format (Unmatched):**
```csv
player_name,team_abbr,season_year,season_id,games_played,reason
Jayson Tatum,Team.BOSTON_CELTICS,2023,77,74,"Player: ✓, Team: ✗"
Joel Embiid,Team.PHILADELPHIA_76ERS,2023,77,66,"Player: ✓, Team: ✗"
Luka Dončić,Team.DALLAS_MAVERICKS,2023,77,66,"Player: ✓, Team: ✗"
```

**Problem**: Team names don't match
- Current format: `Team.BOSTON_CELTICS`
- Need format: `BOS` (from teams.csv)

**Target Format:**
```csv
player_id,team_id,season_id,games_played
123,2,77,74
456,23,77,66
789,7,77,66
```

**What This Table Represents:**
- Links players to teams for specific seasons
- Shows which players played for which teams in which years
- Includes games played for basic statistics

**Example Queries Enabled:**
```sql
-- Get LeBron's career teams
SELECT t.team_name, s.season_label, pts.games_played
FROM player_team_seasons pts
JOIN players p ON pts.player_id = p.player_id
JOIN teams t ON pts.team_id = t.team_id
JOIN seasons s ON pts.season_id = s.season_id
WHERE p.full_name = 'LeBron James'
ORDER BY s.season_id;

-- Get 2009-10 Lakers roster
SELECT p.full_name, p.position, pts.games_played
FROM player_team_seasons pts
JOIN players p ON pts.player_id = p.player_id
JOIN teams t ON pts.team_id = t.team_id
JOIN seasons s ON pts.season_id = s.season_id
WHERE t.team_name = 'Los Angeles Lakers'
  AND s.season_label = '2009-10';

-- Get all players who played for Lakers (all-time)
SELECT DISTINCT p.full_name
FROM player_team_seasons pts
JOIN players p ON pts.player_id = p.player_id
JOIN teams t ON pts.team_id = t.team_id
WHERE t.team_name = 'Los Angeles Lakers'
ORDER BY p.full_name;
```

**Action Needed**: 
1. Transform team names from Basketball Reference format to abbreviations
2. Match player names to player_id
3. Import cleaned data

---

## Additional RPA Tables (Already in Schema)

These are RPA-specific platform tables (not from NBA Database):

### 5. rpa_profiles
Extended profiles for retired players in the RPA platform

### 6. events
RPA events, programs, and gatherings

### 7. event_registrations  
Tracking who registers/attends events

### 8. pillar_engagements
Five Pillars activity tracking

### 9. resources
Library of resources for members

---

## Database Views (Already Defined)

### active_players_view
```sql
CREATE VIEW active_players_view AS
SELECT 
    p.player_id,
    p.full_name,
    p.position,
    rp.email,
    rp.profile_image_url,
    rp.is_active
FROM players p
LEFT JOIN rpa_profiles rp ON p.player_id = rp.player_id
WHERE rp.is_active = true;
```

### player_career_summary
```sql
CREATE VIEW player_career_summary AS
SELECT 
    p.player_id,
    p.full_name,
    COUNT(DISTINCT pts.team_id) as teams_played_for,
    COUNT(DISTINCT pts.season_id) as seasons_played,
    SUM(pts.games_played) as total_games
FROM players p
LEFT JOIN player_team_seasons pts ON p.player_id = pts.player_id
GROUP BY p.player_id, p.full_name;
```

---

## Import Order (Respecting Foreign Keys)

```
1. seasons     (no dependencies)
2. teams       (no dependencies)
3. players     (no dependencies)
4. player_team_seasons (depends on: players, teams, seasons)
5. rpa_profiles (depends on: players)
6. events      (no dependencies on NBA data)
7. event_registrations (depends on: events, rpa_profiles)
8. pillar_engagements (depends on: rpa_profiles)
9. resources   (no dependencies on NBA data)
```

---

## Indexes (Already Defined)

Performance optimization indexes:

```sql
-- Player indexes
CREATE INDEX idx_players_name ON players(full_name);
CREATE INDEX idx_players_position ON players(position);

-- Team indexes
CREATE INDEX idx_teams_name ON teams(team_name);
CREATE INDEX idx_teams_abbreviation ON teams(abbreviation);

-- Player-Team-Season indexes
CREATE INDEX idx_pts_player ON player_team_seasons(player_id);
CREATE INDEX idx_pts_team ON player_team_seasons(team_id);
CREATE INDEX idx_pts_season ON player_team_seasons(season_id);
```

---

## Data Sources

### NBA Database Project Location
`/Users/MikeWolf/Projects/NBA Database/`

### CSV Files
```
nba_data/
├── players.csv              ✅ 4,775 records (ready)
├── teams.csv                ✅ 35 records (ready)
├── seasons.csv              ✅ 79 records (ready)
├── player_team_seasons.csv  ❌ Empty (only header)
├── unmatched_pts.csv        ⚠️ 26,342 records (needs cleaning)
└── import_to_database.sql   📄 SQL import template
```

### Python Scripts (for data collection)
```
GetFullData.py    - Main scraper (Basketball Reference API)
GetData.py        - Alternative scraper (NBA official API)
progress.json     - Tracks collection progress
```

---

## Next Steps

See these documents for implementation:
- **`DATABASE_IMPORT_ANALYSIS.md`** - Detailed technical analysis
- **`IMPORT_ACTION_PLAN.md`** - Quick action plan

**Immediate Actions:**
1. ✅ Review this table overview
2. ⚠️ Decide on database platform (PostgreSQL recommended)
3. ⚠️ Choose data cleaning approach (transform vs. re-scrape)
4. ⚠️ Set up database and begin Phase 1 imports

---

## Questions?

- Want to see sample queries?
- Need help with any specific table?
- Ready to start implementation?

Let me know! 🚀

