#!/usr/bin/env ts-node
/**
 * Import NBA Seasons to Firestore
 * Reads seasons from CSV and imports to Firestore
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import { config } from 'dotenv';
import { batchImport, verifyImport } from './utils/firebase-batch.js';

// Load environment variables
config({ path: '.env.local' });

interface SeasonCSV {
  season_id: string;
  season_label: string;
  start_year: string;
  end_year: string;
}

interface Season {
  season_id: number;
  season_label: string;
  start_year: number;
  end_year: number;
}

async function importSeasons() {
  try {
    console.log('📅 NBA Seasons Import');
    console.log('=' .repeat(50));
    
    // Get the directory of this script
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    
    // Read the CSV file
    const csvPath = resolve(__dirname, '../../NBA Database/nba_data/seasons.csv');
    console.log(`\n📂 Reading seasons from: ${csvPath}`);
    
    const fileContent = readFileSync(csvPath, 'utf-8');
    
    // Parse CSV
    const records: SeasonCSV[] = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    console.log(`✅ Parsed ${records.length} seasons from CSV`);
    
    // Transform data for Firestore
    const seasons: Season[] = records.map(record => ({
      season_id: parseInt(record.season_id),
      season_label: record.season_label,
      start_year: parseInt(record.start_year),
      end_year: parseInt(record.end_year)
    }));
    
    // Show sample
    console.log('\n📋 Season range:');
    console.log(`  First: ${seasons[0].season_label} (${seasons[0].start_year}-${seasons[0].end_year})`);
    console.log(`  Last:  ${seasons[seasons.length - 1].season_label} (${seasons[seasons.length - 1].start_year}-${seasons[seasons.length - 1].end_year})`);
    console.log(`  Total: ${seasons.length} NBA seasons`);
    
    // Import to Firestore
    await batchImport(
      'seasons',
      seasons,
      500,
      (season) => season.season_id.toString() // Use season_id as document ID
    );
    
    // Verify import
    await verifyImport('seasons', seasons.length);
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ Seasons import complete!');
    console.log(`📊 Total seasons imported: ${seasons.length}`);
    console.log('   - From 1946-47 through 2024-25');
    console.log('   - Complete NBA history');
    
  } catch (error) {
    console.error('\n❌ Error importing seasons:', error);
    console.error('Stack:', error);
    process.exit(1);
  }
}

// Run the import
importSeasons();

