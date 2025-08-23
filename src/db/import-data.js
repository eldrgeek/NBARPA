import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import dotenv from 'dotenv';

dotenv.config();

// Get database URL from environment variable
const DATABASE_URL = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL or NEON_DATABASE_URL environment variable is required');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

// Path to NBA Database project
const NBA_DB_PATH = '../NBA Database/nba_data';

async function importData() {
  try {
    console.log('Starting data import...');

    // Import seasons
    console.log('Importing seasons...');
    const seasonsData = fs.readFileSync(path.join(NBA_DB_PATH, 'seasons.csv'), 'utf-8');
    const seasons = parse(seasonsData, { columns: true, skip_empty_lines: true });
    
    for (const season of seasons) {
      await sql`
        INSERT INTO seasons (season_id, season_label, start_year, end_year)
        VALUES (${season.season_id}, ${season.season_label}, ${season.start_year}, ${season.end_year})
        ON CONFLICT (season_id) DO NOTHING
      `;
    }
    console.log(`Imported ${seasons.length} seasons`);

    // Import teams
    console.log('Importing teams...');
    const teamsData = fs.readFileSync(path.join(NBA_DB_PATH, 'teams.csv'), 'utf-8');
    const teams = parse(teamsData, { columns: true, skip_empty_lines: true });
    
    for (const team of teams) {
      await sql`
        INSERT INTO teams (team_id, team_name, abbreviation, location)
        VALUES (${team.team_id}, ${team.team_name}, ${team.abbreviation}, ${team.location})
        ON CONFLICT (team_id) DO NOTHING
      `;
    }
    console.log(`Imported ${teams.length} teams`);

    // Import players
    console.log('Importing players...');
    const playersData = fs.readFileSync(path.join(NBA_DB_PATH, 'players.csv'), 'utf-8');
    const players = parse(playersData, { columns: true, skip_empty_lines: true });
    
    // Clean position data (remove 'Position.' prefix)
    const cleanedPlayers = players.map(player => ({
      ...player,
      position: player.position ? player.position.replace('Position.', '') : null,
      birth_date: player.birth_date || null
    }));

    // Import in batches to avoid timeout
    const BATCH_SIZE = 100;
    for (let i = 0; i < cleanedPlayers.length; i += BATCH_SIZE) {
      const batch = cleanedPlayers.slice(i, i + BATCH_SIZE);
      
      for (const player of batch) {
        await sql`
          INSERT INTO players (player_id, full_name, nicknames, position, birth_date)
          VALUES (
            ${player.player_id}, 
            ${player.full_name}, 
            ${player.nicknames || null}, 
            ${player.position}, 
            ${player.birth_date}
          )
          ON CONFLICT (player_id) DO NOTHING
        `;
      }
      
      console.log(`Imported ${Math.min(i + BATCH_SIZE, cleanedPlayers.length)} of ${cleanedPlayers.length} players`);
    }

    // Import player_team_seasons if file exists and has data
    const ptsPath = path.join(NBA_DB_PATH, 'player_team_seasons.csv');
    if (fs.existsSync(ptsPath)) {
      const ptsData = fs.readFileSync(ptsPath, 'utf-8');
      if (ptsData.trim().length > 1) { // Check if file has more than just headers
        console.log('Importing player team seasons...');
        const playerTeamSeasons = parse(ptsData, { columns: true, skip_empty_lines: true });
        
        for (const pts of playerTeamSeasons) {
          await sql`
            INSERT INTO player_team_seasons (player_id, team_id, season_id, games_played)
            VALUES (${pts.player_id}, ${pts.team_id}, ${pts.season_id}, ${pts.games_played || null})
            ON CONFLICT (player_id, team_id, season_id) DO NOTHING
          `;
        }
        console.log(`Imported ${playerTeamSeasons.length} player-team-season records`);
      } else {
        console.log('player_team_seasons.csv is empty, skipping...');
      }
    }

    // Verify import
    const playerCount = await sql`SELECT COUNT(*) as count FROM players`;
    const teamCount = await sql`SELECT COUNT(*) as count FROM teams`;
    const seasonCount = await sql`SELECT COUNT(*) as count FROM seasons`;
    
    console.log('\nImport complete!');
    console.log(`Total players: ${playerCount[0].count}`);
    console.log(`Total teams: ${teamCount[0].count}`);
    console.log(`Total seasons: ${seasonCount[0].count}`);

    // Add some sample RPA profiles for demonstration
    console.log('\nAdding sample RPA profiles...');
    
    // Get a few player IDs to create sample profiles
    const samplePlayers = await sql`
      SELECT player_id, full_name 
      FROM players 
      WHERE full_name IN ('LeBron James', 'Stephen Curry', 'Kevin Durant', 'Giannis Antetokounmpo')
    `;

    for (const player of samplePlayers) {
      await sql`
        INSERT INTO rpa_profiles (player_id, email, bio, is_active)
        VALUES (
          ${player.player_id},
          ${player.full_name.toLowerCase().replace(' ', '.') + '@example.com'},
          ${'Former NBA player actively engaged with the RPA community.'},
          true
        )
        ON CONFLICT (player_id) DO NOTHING
      `;
    }
    
    console.log('Sample RPA profiles created');

  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
}

// Run import
importData();