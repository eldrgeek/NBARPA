-- NBA RPA Connect Database Schema
-- For use with Netlify DB powered by Neon

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS player_team_seasons CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS seasons CASCADE;

-- Create seasons table
CREATE TABLE seasons (
    season_id SERIAL PRIMARY KEY,
    season_label VARCHAR(20) NOT NULL,
    start_year INTEGER NOT NULL,
    end_year INTEGER NOT NULL
);

-- Create teams table
CREATE TABLE teams (
    team_id SERIAL PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL,
    abbreviation VARCHAR(5) NOT NULL,
    location VARCHAR(100)
);

-- Create players table
CREATE TABLE players (
    player_id SERIAL PRIMARY KEY,
    full_name VARCHAR(200) NOT NULL,
    nicknames TEXT,
    position VARCHAR(50),
    birth_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create player_team_seasons junction table
CREATE TABLE player_team_seasons (
    id SERIAL PRIMARY KEY,
    player_id INTEGER NOT NULL REFERENCES players(player_id) ON DELETE CASCADE,
    team_id INTEGER NOT NULL REFERENCES teams(team_id) ON DELETE CASCADE,
    season_id INTEGER NOT NULL REFERENCES seasons(season_id) ON DELETE CASCADE,
    games_played INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, team_id, season_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_players_name ON players(full_name);
CREATE INDEX idx_players_position ON players(position);
CREATE INDEX idx_teams_name ON teams(team_name);
CREATE INDEX idx_teams_abbreviation ON teams(abbreviation);
CREATE INDEX idx_pts_player ON player_team_seasons(player_id);
CREATE INDEX idx_pts_team ON player_team_seasons(team_id);
CREATE INDEX idx_pts_season ON player_team_seasons(season_id);

-- Add RPA-specific tables for the platform

-- User profiles for retired players
CREATE TABLE rpa_profiles (
    profile_id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(player_id),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    bio TEXT,
    profile_image_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    twitter_handle VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Five Pillars engagement tracking
CREATE TABLE pillar_engagements (
    engagement_id SERIAL PRIMARY KEY,
    profile_id INTEGER REFERENCES rpa_profiles(profile_id) ON DELETE CASCADE,
    pillar_type VARCHAR(50) NOT NULL CHECK (pillar_type IN ('camaraderie', 'health', 'finance', 'community', 'family')),
    engagement_date DATE NOT NULL,
    activity_type VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events and programs
CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_date TIMESTAMP NOT NULL,
    location VARCHAR(200),
    pillar_type VARCHAR(50) CHECK (pillar_type IN ('camaraderie', 'health', 'finance', 'community', 'family')),
    max_attendees INTEGER,
    is_virtual BOOLEAN DEFAULT false,
    registration_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event registrations
CREATE TABLE event_registrations (
    registration_id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(event_id) ON DELETE CASCADE,
    profile_id INTEGER REFERENCES rpa_profiles(profile_id) ON DELETE CASCADE,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attendance_status VARCHAR(50) DEFAULT 'registered',
    UNIQUE(event_id, profile_id)
);

-- Resources library
CREATE TABLE resources (
    resource_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    resource_type VARCHAR(50) NOT NULL,
    pillar_type VARCHAR(50) CHECK (pillar_type IN ('camaraderie', 'health', 'finance', 'community', 'family')),
    url VARCHAR(500),
    file_path VARCHAR(500),
    access_level VARCHAR(50) DEFAULT 'public',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create views for common queries
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