import { useState, useEffect } from 'react';

export interface PillarProgress {
  camaraderie: boolean;
  health: boolean;
  finance: boolean;
  community: boolean;
  family: boolean;
}

const STORAGE_KEY = 'rpa_pillar_progress';

const defaultProgress: PillarProgress = {
  camaraderie: false,
  health: false,
  finance: false,
  community: false,
  family: false
};

export const usePillarProgress = () => {
  const [progress, setProgress] = useState<PillarProgress>(defaultProgress);

  // Load progress from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedProgress = JSON.parse(stored);
        setProgress({ ...defaultProgress, ...parsedProgress });
      }
    } catch (error) {
      console.warn('Failed to load pillar progress from session storage:', error);
    }
  }, []);

  // Save progress to sessionStorage whenever it changes
  const updateProgress = (pillarId: keyof PillarProgress, visited: boolean = true) => {
    const newProgress = { ...progress, [pillarId]: visited };
    setProgress(newProgress);
    
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    } catch (error) {
      console.warn('Failed to save pillar progress to session storage:', error);
    }
  };

  // Mark a pillar as visited
  const markPillarVisited = (pillarId: keyof PillarProgress) => {
    updateProgress(pillarId, true);
  };

  // Reset all progress (useful for testing or new sessions)
  const resetProgress = () => {
    setProgress(defaultProgress);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear pillar progress from session storage:', error);
    }
  };

  // Get total visited count
  const getVisitedCount = () => {
    return Object.values(progress).filter(Boolean).length;
  };

  // Get completion percentage
  const getCompletionPercentage = () => {
    const visited = getVisitedCount();
    const total = Object.keys(progress).length;
    return Math.round((visited / total) * 100);
  };

  // Function to sync to database when user logs in
  const syncToDatabase = async (userId: string) => {
    try {
      // This would be implemented when database integration is ready
      console.log('Would sync pillar progress to database for user:', userId, progress);
      // await api.syncPillarProgress(userId, progress);
    } catch (error) {
      console.error('Failed to sync pillar progress to database:', error);
    }
  };

  // Function to load from database when user logs in
  const loadFromDatabase = async (userId: string) => {
    try {
      // This would be implemented when database integration is ready
      console.log('Would load pillar progress from database for user:', userId);
      // const dbProgress = await api.getPillarProgress(userId);
      // if (dbProgress) {
      //   setProgress(dbProgress);
      //   sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dbProgress));
      // }
    } catch (error) {
      console.error('Failed to load pillar progress from database:', error);
    }
  };

  return {
    progress,
    markPillarVisited,
    resetProgress,
    getVisitedCount,
    getCompletionPercentage,
    syncToDatabase,
    loadFromDatabase
  };
};