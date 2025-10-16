import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  writeBatch,
  serverTimestamp,
  increment,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';

// Get environment variables (works in both browser and Node.js)
const getEnv = (key: string) => {
  // Try import.meta.env first (Vite/browser)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key];
  }
  // Fallback to process.env (Node.js)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  return undefined;
};

// Firebase configuration
const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID'),
  measurementId: getEnv('VITE_FIREBASE_MEASUREMENT_ID')
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Collection references
export const collections = {
  players: 'players',
  assessments: 'assessments',
  analytics: 'analytics',
  adminLogs: 'admin_logs'
};

// Types
export interface Player {
  player_id: string;
  full_name: string;
  nicknames?: string;
  position?: string;
  birth_date?: string;
}

export interface Assessment {
  id?: string;
  player_id?: string;
  player_name: string;
  timestamp: any;
  assessment_data: {
    name: string;
    date: string;
    emotionalState: string[];
    fulfillment: string;
    activities: string[];
    accomplishments: string;
    interests: string[];
    purpose: string;
    support: string[];
    clarity: number;
    supportNeeds: string;
  };
  status: 'completed' | 'in-progress';
}

export interface Analytics {
  total_players_connected: number;
  total_assessments_taken: number;
  last_updated: any;
}

export interface AdminLog {
  id?: string;
  action_type: string;
  timestamp: any;
  user: string;
  details?: any;
}

// Player functions
export async function searchPlayers(searchTerm: string): Promise<Player[]> {
  try {
    const playersRef = collection(db, collections.players);
    const q = query(
      playersRef,
      where('full_name', '>=', searchTerm),
      where('full_name', '<=', searchTerm + '\uf8ff'),
      limit(20)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      player_id: doc.id,
      ...doc.data()
    } as Player));
  } catch (error) {
    console.error('Error searching players:', error);
    return [];
  }
}

export async function getPlayerById(playerId: string): Promise<Player | null> {
  try {
    const playerDoc = await getDoc(doc(db, collections.players, playerId));
    if (playerDoc.exists()) {
      return {
        player_id: playerDoc.id,
        ...playerDoc.data()
      } as Player;
    }
    return null;
  } catch (error) {
    console.error('Error getting player:', error);
    return null;
  }
}

export async function getAllPlayers(): Promise<Player[]> {
  try {
    const playersRef = collection(db, collections.players);
    const snapshot = await getDocs(playersRef);
    return snapshot.docs.map(doc => ({
      player_id: doc.id,
      ...doc.data()
    } as Player));
  } catch (error) {
    console.error('Error getting all players:', error);
    return [];
  }
}

// Assessment functions
export async function saveAssessment(assessment: Assessment): Promise<string | null> {
  try {
    // Remove any undefined values - Firestore doesn't accept them
    const cleanAssessment = Object.fromEntries(
      Object.entries(assessment).filter(([_, value]) => value !== undefined)
    );
    
    const assessmentData = {
      ...cleanAssessment,
      timestamp: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, collections.assessments), assessmentData);
    
    // Update analytics
    await updateAnalytics('assessment_completed');
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving assessment:', error);
    return null;
  }
}

export async function getAssessments(limitCount: number = 50): Promise<Assessment[]> {
  try {
    const assessmentsRef = collection(db, collections.assessments);
    const q = query(
      assessmentsRef,
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Assessment));
  } catch (error) {
    console.error('Error getting assessments:', error);
    return [];
  }
}

export async function getAssessmentsByPlayer(playerId: string): Promise<Assessment[]> {
  try {
    const assessmentsRef = collection(db, collections.assessments);
    const q = query(
      assessmentsRef,
      where('player_id', '==', playerId),
      orderBy('timestamp', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Assessment));
  } catch (error) {
    console.error('Error getting player assessments:', error);
    return [];
  }
}

// Analytics functions
export async function getAnalytics(): Promise<Analytics | null> {
  try {
    const analyticsDoc = await getDoc(doc(db, collections.analytics, 'global'));
    if (analyticsDoc.exists()) {
      return analyticsDoc.data() as Analytics;
    } else {
      // Initialize analytics if not exists
      const initialAnalytics: Analytics = {
        total_players_connected: 0,
        total_assessments_taken: 0,
        last_updated: serverTimestamp()
      };
      await setDoc(doc(db, collections.analytics, 'global'), initialAnalytics);
      return initialAnalytics;
    }
  } catch (error) {
    console.error('Error getting analytics:', error);
    return null;
  }
}

export async function updateAnalytics(action: 'player_connected' | 'assessment_completed'): Promise<void> {
  try {
    const analyticsRef = doc(db, collections.analytics, 'global');
    
    const updateData: any = {
      last_updated: serverTimestamp()
    };
    
    if (action === 'player_connected') {
      updateData.total_players_connected = increment(1);
    } else if (action === 'assessment_completed') {
      updateData.total_assessments_taken = increment(1);
    }
    
    await setDoc(analyticsRef, updateData, { merge: true });
  } catch (error) {
    console.error('Error updating analytics:', error);
  }
}

// Admin functions
export async function logAdminAction(action: string, user: string = 'admin', details?: any): Promise<void> {
  try {
    const logData: AdminLog = {
      action_type: action,
      timestamp: serverTimestamp(),
      user,
      details
    };
    
    await addDoc(collection(db, collections.adminLogs), logData);
  } catch (error) {
    console.error('Error logging admin action:', error);
  }
}

export async function clearCollection(collectionName: string): Promise<number> {
  try {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    
    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    
    await logAdminAction(`clear_${collectionName}`, 'admin', { count: snapshot.size });
    
    return snapshot.size;
  } catch (error) {
    console.error(`Error clearing ${collectionName}:`, error);
    return 0;
  }
}

export async function clearAllData(): Promise<void> {
  try {
    await Promise.all([
      clearCollection(collections.assessments),
      clearCollection(collections.players),
    ]);
    
    // Reset analytics
    await setDoc(doc(db, collections.analytics, 'global'), {
      total_players_connected: 0,
      total_assessments_taken: 0,
      last_updated: serverTimestamp()
    });
    
    await logAdminAction('clear_all_data', 'admin');
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
}

export async function getAdminLogs(limitCount: number = 50): Promise<AdminLog[]> {
  try {
    const logsRef = collection(db, collections.adminLogs);
    const q = query(
      logsRef,
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AdminLog));
  } catch (error) {
    console.error('Error getting admin logs:', error);
    return [];
  }
}

// Batch import players
export async function importPlayers(players: Omit<Player, 'player_id'>[]): Promise<number> {
  try {
    const batches: any[] = [];
    let currentBatch = writeBatch(db);
    let operationCount = 0;
    let batchCount = 0;
    
    for (const player of players) {
      const playerRef = doc(collection(db, collections.players));
      currentBatch.set(playerRef, player);
      operationCount++;
      
      // Firestore has a limit of 500 operations per batch
      if (operationCount === 500) {
        batches.push(currentBatch);
        currentBatch = writeBatch(db);
        operationCount = 0;
        batchCount++;
      }
    }
    
    // Add the last batch if it has operations
    if (operationCount > 0) {
      batches.push(currentBatch);
    }
    
    // Commit all batches
    await Promise.all(batches.map(batch => batch.commit()));
    
    await logAdminAction('import_players', 'admin', { count: players.length });
    
    return players.length;
  } catch (error) {
    console.error('Error importing players:', error);
    throw error;
  }
}

