#!/usr/bin/env ts-node
/**
 * Import NBA Teams to Firestore
 * Reads teams from CSV and imports to Firestore
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import { config } from 'dotenv';
import { batchImport, verifyImport } from './utils/firebase-batch.js';

// Load environment variables
config({ path: '.env.local' });

interface TeamCSV {
  team_id: string;
  team_name: string;
  abbreviation: string;
  location: string;
}

interface Team {
  team_id: number;
  team_name: string;
  abbreviation: string;
  location: string;
}

async function importTeams() {
  try {
    console.log('🏀 NBA Teams Import');
    console.log('=' .repeat(50));
    
    // Get the directory of this script
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    
    // Read the CSV file
    const csvPath = resolve(__dirname, '../../NBA Database/nba_data/teams.csv');
    console.log(`\n📂 Reading teams from: ${csvPath}`);
    
    const fileContent = readFileSync(csvPath, 'utf-8');
    
    // Parse CSV
    const records: TeamCSV[] = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    console.log(`✅ Parsed ${records.length} teams from CSV`);
    
    // Transform data for Firestore
    const teams: Team[] = records.map(record => ({
      team_id: parseInt(record.team_id),
      team_name: record.team_name,
      abbreviation: record.abbreviation,
      location: record.location
    }));
    
    // Show sample
    console.log('\n📋 Sample teams:');
    console.log(`  1. ${teams[0].team_name} (${teams[0].abbreviation})`);
    console.log(`  2. ${teams[1].team_name} (${teams[1].abbreviation})`);
    console.log(`  3. ${teams[13].team_name} (${teams[13].abbreviation})`); // Lakers
    
    // Import to Firestore
    await batchImport(
      'teams',
      teams,
      500,
      (team) => team.team_id.toString() // Use team_id as document ID
    );
    
    // Verify import
    await verifyImport('teams', teams.length);
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ Teams import complete!');
    console.log(`📊 Total teams imported: ${teams.length}`);
    console.log('   - 30 current teams');
    console.log('   - 5 historical teams');
    
  } catch (error) {
    console.error('\n❌ Error importing teams:', error);
    console.error('Stack:', error);
    process.exit(1);
  }
}

// Run the import
importTeams();

