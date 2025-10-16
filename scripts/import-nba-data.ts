import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Dynamic import for Firebase (ESM compatibility)
const importFirebase = async () => {
  const { importPlayers } = await import('../src/lib/firebase.js');
  return { importPlayers };
};

interface PlayerCSV {
  player_id: string;
  full_name: string;
  nicknames: string;
  position: string;
  birth_date: string;
}

async function importNBAData() {
  try {
    console.log('🏀 Starting NBA player data import...\n');
    
    // Get the directory of this script
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    
    // Read the CSV file
    const csvPath = resolve(__dirname, '../../NBA Database/nba_data/players.csv');
    console.log(`📂 Reading players from: ${csvPath}`);
    
    const fileContent = readFileSync(csvPath, 'utf-8');
    
    // Parse CSV
    const records: PlayerCSV[] = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    console.log(`✅ Parsed ${records.length} players from CSV\n`);
    
    // Transform data for Firestore
    const players = records.map(record => ({
      full_name: record.full_name,
      nicknames: record.nicknames || '',
      position: record.position || '',
      birth_date: record.birth_date || ''
    }));
    
    console.log('📤 Uploading players to Firestore...');
    console.log('⏳ This may take a few minutes for ~4,700+ players...\n');
    
    // Import Firebase functions
    const { importPlayers: importPlayersFunc } = await importFirebase();
    
    // Import in batches
    const batchSize = 500;
    let totalImported = 0;
    
    for (let i = 0; i < players.length; i += batchSize) {
      const batch = players.slice(i, i + batchSize);
      await importPlayersFunc(batch);
      totalImported += batch.length;
      
      const percentage = Math.round((totalImported / players.length) * 100);
      console.log(`✅ Imported ${totalImported}/${players.length} players (${percentage}%)`);
    }
    
    console.log('\n🎉 Import complete!');
    console.log(`📊 Total players imported: ${totalImported}`);
    
  } catch (error) {
    console.error('❌ Error importing data:', error);
    console.error('Stack:', error);
    process.exit(1);
  }
}

// Run the import
importNBAData();

