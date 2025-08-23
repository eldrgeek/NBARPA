import React, { createContext, useContext, ReactNode } from 'react';
import { usePillarProgress, PillarProgress } from '../hooks/usePillarProgress';

interface PillarProgressContextType {
  progress: PillarProgress;
  markPillarVisited: (pillarId: keyof PillarProgress) => void;
  resetProgress: () => void;
  getVisitedCount: () => number;
  getCompletionPercentage: () => number;
  syncToDatabase: (userId: string) => Promise<void>;
  loadFromDatabase: (userId: string) => Promise<void>;
}

const PillarProgressContext = createContext<PillarProgressContextType | undefined>(undefined);

interface PillarProgressProviderProps {
  children: ReactNode;
}

export const PillarProgressProvider: React.FC<PillarProgressProviderProps> = ({ children }) => {
  const pillarProgress = usePillarProgress();

  return (
    <PillarProgressContext.Provider value={pillarProgress}>
      {children}
    </PillarProgressContext.Provider>
  );
};

export const usePillarProgressContext = () => {
  const context = useContext(PillarProgressContext);
  if (context === undefined) {
    throw new Error('usePillarProgressContext must be used within a PillarProgressProvider');
  }
  return context;
};