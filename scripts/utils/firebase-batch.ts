/**
 * Firebase Batch Import Utilities
 * Helper functions for batch importing data to Firestore
 */

import { collection, writeBatch, doc, getCountFromServer } from 'firebase/firestore';
import { db } from '../../src/lib/firebase';

/**
 * Import documents to a Firestore collection in batches
 * @param collectionName - Name of the collection
 * @param data - Array of documents to import
 * @param batchSize - Number of documents per batch (max 500 for Firestore)
 * @param useCustomId - Function to generate custom document ID (optional)
 * @returns Number of documents imported
 */
export async function batchImport(
  collectionName: string,
  data: any[],
  batchSize: number = 500,
  useCustomId?: (item: any) => string
): Promise<number> {
  
  if (data.length === 0) {
    console.log(`⚠️  No data to import to ${collectionName}`);
    return 0;
  }
  
  console.log(`\n📤 Importing ${data.length} documents to '${collectionName}'...`);
  
  const batches: any[] = [];
  let currentBatch = writeBatch(db);
  let operationCount = 0;
  let totalImported = 0;
  
  for (const item of data) {
    // Generate document ID
    const docId = useCustomId ? useCustomId(item) : undefined;
    const docRef = docId 
      ? doc(collection(db, collectionName), docId)
      : doc(collection(db, collectionName));
    
    currentBatch.set(docRef, item);
    operationCount++;
    totalImported++;
    
    // Firestore has a limit of 500 operations per batch
    if (operationCount === batchSize) {
      batches.push(currentBatch);
      currentBatch = writeBatch(db);
      operationCount = 0;
      
      console.log(`  ⏳ Prepared batch ${batches.length} (${totalImported}/${data.length} documents)`);
    }
  }
  
  // Add the last batch if it has operations
  if (operationCount > 0) {
    batches.push(currentBatch);
  }
  
  // Commit all batches sequentially
  console.log(`\n  💾 Committing ${batches.length} batch(es)...`);
  for (let i = 0; i < batches.length; i++) {
    await batches[i].commit();
    console.log(`  ✅ Committed batch ${i + 1}/${batches.length}`);
  }
  
  console.log(`\n🎉 Successfully imported ${totalImported} documents to '${collectionName}'!`);
  
  return totalImported;
}

/**
 * Get the count of documents in a collection
 * @param collectionName - Name of the collection
 * @returns Number of documents
 */
export async function getCollectionCount(collectionName: string): Promise<number> {
  try {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getCountFromServer(collectionRef);
    return snapshot.data().count;
  } catch (error) {
    console.error(`Error getting count for ${collectionName}:`, error);
    return 0;
  }
}

/**
 * Verify import by checking collection count
 * @param collectionName - Name of the collection
 * @param expectedCount - Expected number of documents
 * @returns True if count matches, false otherwise
 */
export async function verifyImport(
  collectionName: string,
  expectedCount: number
): Promise<boolean> {
  console.log(`\n🔍 Verifying '${collectionName}' collection...`);
  
  const actualCount = await getCollectionCount(collectionName);
  
  if (actualCount === expectedCount) {
    console.log(`✅ Verification passed: ${actualCount} documents`);
    return true;
  } else {
    console.log(`❌ Verification failed: Expected ${expectedCount}, found ${actualCount}`);
    return false;
  }
}

/**
 * Show progress during import
 * @param current - Current count
 * @param total - Total count
 * @param label - Progress label
 */
export function showProgress(current: number, total: number, label: string = 'Progress'): void {
  const percentage = Math.round((current / total) * 100);
  const bar = '█'.repeat(Math.floor(percentage / 2)) + '░'.repeat(50 - Math.floor(percentage / 2));
  process.stdout.write(`\r  ${label}: [${bar}] ${percentage}% (${current}/${total})`);
  
  if (current === total) {
    process.stdout.write('\n');
  }
}

