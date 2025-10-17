#!/usr/bin/env ts-node
/**
 * Master Import Script
 * Imports all NBA data (teams, seasons, player-team-seasons) to Firestore
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runScript(scriptPath: string, description: string): Promise<boolean> {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`▶️  ${description}`);
  console.log('='.repeat(60));
  
  try {
    const { stdout, stderr } = await execAsync(`tsx ${scriptPath}`);
    
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    
    console.log(`✅ ${description} - COMPLETE`);
    return true;
  } catch (error: any) {
    console.error(`❌ ${description} - FAILED`);
    console.error(error.message);
    return false;
  }
}

async function importAllData() {
  console.log('\n');
  console.log('🏀 NBA DATABASE - COMPLETE IMPORT');
  console.log('='.repeat(60));
  console.log('This will import:');
  console.log('  1. Teams (35 teams)');
  console.log('  2. Seasons (79 seasons)');
  console.log('  3. Player-Team-Seasons (~26,000 records)');
  console.log('='.repeat(60));
  
  const startTime = Date.now();
  const results: { [key: string]: boolean } = {};
  
  // Phase 1: Import core data
  console.log('\n📦 PHASE 1: Core Collections');
  results.teams = await runScript(
    'scripts/firebase-import-teams.ts',
    'Importing Teams'
  );
  
  results.seasons = await runScript(
    'scripts/firebase-import-seasons.ts',
    'Importing Seasons'
  );
  
  // Phase 2: Import player-team-seasons (requires teams and seasons to exist)
  if (results.teams && results.seasons) {
    console.log('\n📦 PHASE 2: Player-Team-Seasons');
    results.playerTeamSeasons = await runScript(
      'scripts/firebase-import-player-team-seasons.ts',
      'Importing Player-Team-Seasons'
    );
  } else {
    console.log('\n⚠️  PHASE 2 SKIPPED: Teams or Seasons import failed');
    results.playerTeamSeasons = false;
  }
  
  // Summary
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000 / 60).toFixed(1);
  
  console.log('\n');
  console.log('='.repeat(60));
  console.log('📊 IMPORT SUMMARY');
  console.log('='.repeat(60));
  console.log(`\n✅ Completed Imports:`);
  
  Object.entries(results).forEach(([name, success]) => {
    const status = success ? '✅' : '❌';
    const label = name.replace(/([A-Z])/g, ' $1').trim();
    console.log(`   ${status} ${label.charAt(0).toUpperCase() + label.slice(1)}`);
  });
  
  const successCount = Object.values(results).filter(Boolean).length;
  const totalCount = Object.keys(results).length;
  
  console.log(`\n📈 Success Rate: ${successCount}/${totalCount}`);
  console.log(`⏱️  Total Time: ${duration} minutes`);
  
  if (successCount === totalCount) {
    console.log('\n🎉 ALL IMPORTS SUCCESSFUL!');
    console.log('\n🚀 Your Firestore database now contains:');
    console.log('   • 4,775 players (already imported)');
    console.log('   • 35 teams');
    console.log('   • 79 seasons');
    console.log('   • ~26,000 player-team-season records');
    console.log('\n💡 You can now query player careers, team rosters, and more!');
  } else {
    console.log('\n⚠️  SOME IMPORTS FAILED');
    console.log('Check the logs above for details.');
    process.exit(1);
  }
  
  console.log('\n' + '='.repeat(60));
}

// Run the import
importAllData().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});

