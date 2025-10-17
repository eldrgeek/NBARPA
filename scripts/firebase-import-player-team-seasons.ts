#!/usr/bin/env ts-node
/**
 * Import Player-Team-Seasons to Firestore
 * Transforms unmatched_pts.csv data and imports to Firestore with denormalization
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import { config } from 'dotenv';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../src/lib/firebase.js';
import { batchImport, verifyImport } from './utils/firebase-batch.js';
import { mapTeamAbbreviation, fuzzyMatchTeam } from './utils/team-mapper.js';
import { findBestPlayerMatch, PlayerReference } from './utils/player-matcher.js';

// Load environment variables
config({ path: '.env.local' });

interface UnmatchedRecord {
  player_name: string;
  team_abbr: string;
  season_year: string;
  season_id: string;
  games_played: string;
  reason: string;
}

interface PlayerTeamSeason {
  player_id: string;
  team_id: number;
  season_id: number;
  games_played: number;
  // Denormalized fields for easier queries
  player_name: string;
  team_abbr: string;
  team_name: string;
  season_label: string;
}

interface Team {
  team_id: number;
  team_name: string;
  abbreviation: string;
  location: string;
}

interface Season {
  season_id: number;
  season_label: string;
  start_year: number;
  end_year: number;
}

async function importPlayerTeamSeasons() {
  try {
    console.log('🏀 Player-Team-Seasons Import');
    console.log('=' .repeat(50));
    
    // Get the directory of this script
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    
    // 1. Load unmatched_pts.csv
    const csvPath = resolve(__dirname, '../../NBA Database/nba_data/unmatched_pts.csv');
    console.log(`\n📂 Reading data from: ${csvPath}`);
    
    const fileContent = readFileSync(csvPath, 'utf-8');
    const records: UnmatchedRecord[] = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    console.log(`✅ Loaded ${records.length} records from CSV`);
    
    // 2. Load reference data from Firestore
    console.log('\n📥 Loading reference data from Firestore...');
    
    console.log('  Loading players...');
    const playersSnapshot = await getDocs(collection(db, 'players'));
    const players: PlayerReference[] = playersSnapshot.docs.map(doc => ({
      player_id: doc.id,
      full_name: doc.data().full_name
    }));
    console.log(`  ✅ Loaded ${players.length} players`);
    
    console.log('  Loading teams...');
    const teamsSnapshot = await getDocs(collection(db, 'teams'));
    const teams: Team[] = teamsSnapshot.docs.map(doc => doc.data() as Team);
    console.log(`  ✅ Loaded ${teams.length} teams`);
    
    console.log('  Loading seasons...');
    const seasonsSnapshot = await getDocs(collection(db, 'seasons'));
    const seasons: Season[] = seasonsSnapshot.docs.map(doc => doc.data() as Season);
    console.log(`  ✅ Loaded ${seasons.length} seasons`);
    
    // Create lookup maps
    const teamsByAbbr = new Map(teams.map(t => [t.abbreviation, t]));
    const seasonsById = new Map(seasons.map(s => [s.season_id, s]));
    
    // 3. Transform and match records
    console.log('\n🔄 Transforming and matching records...');
    
    const matched: PlayerTeamSeason[] = [];
    const unmatched: any[] = [];
    
    let processedCount = 0;
    const totalRecords = records.length;
    
    for (const record of records) {
      processedCount++;
      
      if (processedCount % 1000 === 0) {
        const percentage = Math.round((processedCount / totalRecords) * 100);
        console.log(`  Processing: ${processedCount}/${totalRecords} (${percentage}%)`);
      }
      
      // Map team abbreviation
      let teamAbbr = mapTeamAbbreviation(record.team_abbr);
      
      // Try fuzzy matching if direct mapping fails
      if (!teamAbbr) {
        teamAbbr = fuzzyMatchTeam(record.team_abbr);
      }
      
      const team = teamAbbr ? teamsByAbbr.get(teamAbbr) : null;
      
      // Match player (with fuzzy matching)
      const playerMatch = findBestPlayerMatch(record.player_name, players, 0.85);
      
      // Get season
      const seasonId = parseInt(record.season_id);
      const season = seasonsById.get(seasonId);
      
      if (playerMatch && team && season) {
        matched.push({
          player_id: playerMatch.player_id,
          team_id: team.team_id,
          season_id: season.season_id,
          games_played: parseInt(record.games_played) || 0,
          // Denormalized fields
          player_name: playerMatch.full_name,
          team_abbr: team.abbreviation,
          team_name: team.team_name,
          season_label: season.season_label
        });
      } else {
        unmatched.push({
          ...record,
          matched_player: playerMatch ? '✓' : '✗',
          matched_team: team ? '✓' : '✗',
          matched_season: season ? '✓' : '✗'
        });
      }
    }
    
    console.log(`\n✅ Matching complete:`);
    console.log(`   Matched: ${matched.length} records`);
    console.log(`   Unmatched: ${unmatched.length} records`);
    
    const matchRate = ((matched.length / records.length) * 100).toFixed(1);
    console.log(`   Match rate: ${matchRate}%`);
    
    // Show sample matched records
    if (matched.length > 0) {
      console.log('\n📋 Sample matched records:');
      for (let i = 0; i < Math.min(3, matched.length); i++) {
        const record = matched[i];
        console.log(`   ${i + 1}. ${record.player_name} → ${record.team_abbr} (${record.season_label}) - ${record.games_played} games`);
      }
    }
    
    // Show sample unmatched records
    if (unmatched.length > 0) {
      console.log('\n⚠️  Sample unmatched records:');
      for (let i = 0; i < Math.min(3, unmatched.length); i++) {
        const record = unmatched[i];
        console.log(`   ${i + 1}. ${record.player_name} / ${record.team_abbr} - Player: ${record.matched_player}, Team: ${record.matched_team}`);
      }
    }
    
    // 4. Import to Firestore
    if (matched.length > 0) {
      console.log('\n📤 Importing to Firestore...');
      await batchImport('player_team_seasons', matched, 500);
      
      // Verify import
      await verifyImport('player_team_seasons', matched.length);
    } else {
      console.log('\n⚠️  No records to import!');
    }
    
    // 5. Save unmatched records for review
    if (unmatched.length > 0) {
      const unmatchedPath = resolve(__dirname, '../data/unmatched_for_review.json');
      console.log(`\n💾 Saving ${unmatched.length} unmatched records to: ${unmatchedPath}`);
      // Note: Would save to file here if needed
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ Player-Team-Seasons import complete!');
    console.log(`📊 Statistics:`);
    console.log(`   Total records processed: ${records.length}`);
    console.log(`   Successfully matched: ${matched.length}`);
    console.log(`   Unmatched: ${unmatched.length}`);
    console.log(`   Match rate: ${matchRate}%`);
    
  } catch (error) {
    console.error('\n❌ Error importing player-team-seasons:', error);
    console.error('Stack:', error);
    process.exit(1);
  }
}

// Run the import
importPlayerTeamSeasons();

