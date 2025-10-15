import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import tourConfig from '../config/tourConfig.json';

interface ScrollAction {
  delay: number;
  scrollTo: number;
  smooth: boolean;
}

interface TourStep {
  id: string;
  title: string;
  path: string;
  duration: number;
  showCard?: string;
  scrollActions: ScrollAction[];
}

const tourSteps: TourStep[] = tourConfig.tourSteps;

interface TourContextType {
  tourActive: boolean;
  tourPaused: boolean;
  tourCompleted: boolean;
  currentTourStep: number;
  pageVisible: boolean;
  visibleCards: string[];
  showTour: boolean;
  navigationActive: boolean;
  startTour: () => void;
  stopTour: () => void;
  pauseTour: () => void;
  resumeTour: () => void;
  closeTour: () => void;
  startNavigation: () => void;
  nextStep: () => void;
  prevStep: () => void;
  tourSteps: TourStep[];
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};

interface TourProviderProps {
  children: ReactNode;
}

export const TourProvider: React.FC<TourProviderProps> = ({ children }) => {
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const [tourActive, setTourActive] = useState(false);
  const [tourPaused, setTourPaused] = useState(false);
  const [tourCompleted, setTourCompleted] = useState(false);
  const [pageVisible, setPageVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState<string[]>([]);
  const [showTour, setShowTour] = useState(false);
  const [navigationActive, setNavigationActive] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const tourActiveRef = useRef(false);
  const navigationActiveRef = useRef(false);

  // Show content by default on non-home pages
  React.useEffect(() => {
    if (location.pathname !== '/') {
      setPageVisible(true);
      setVisibleCards(['retired', 'family', 'fan', 'business', 'active']); // Show all cards on other pages
    } else {
      setPageVisible(true); // Always show hero section on home
      if (!tourActive) {
        setVisibleCards([]); // Hide cards when not touring on home page
      }
    }
  }, [location.pathname, tourActive]);

  const clearScheduled = () => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
  };

  const scheduleTourFrom = (startIndex: number) => {
    clearScheduled();
    console.log(`Scheduling tour from step ${startIndex}, total steps: ${tourSteps.length}`);

    for (let i = 0; i < tourSteps.length - startIndex; i++) {
      const index = startIndex + i;
      const step = tourSteps[index];
      
      // Calculate cumulative delay: first step in sequence executes immediately (delay 0)
      // subsequent steps execute after their predecessors' durations
      let stepDelay = 0;
      for (let j = 0; j < i; j++) {
        stepDelay += tourSteps[startIndex + j].duration;
      }
      
      console.log(`Scheduling step ${index} (${step.title}) with delay ${stepDelay}ms`);
      
      const timeout = setTimeout(() => {
        console.log(`Timeout fired for step ${index}, checking state: tourActive=${tourActive}, tourPaused=${tourPaused}, navigationActive=${navigationActive}`);
        
        if (!tourActiveRef.current || tourPaused || !navigationActiveRef.current) {
          console.log(`Skipping step ${index} - tour inactive (ref=${tourActiveRef.current}, state=${tourActive}) or paused (${tourPaused}) or navigation not active (ref=${navigationActiveRef.current}, state=${navigationActive})`);
          return;
        }

        console.log(`Executing step ${index}: ${step.title} -> ${step.path}`);
        setCurrentTourStep(index);

        if (step.showCard && step.path === '/') {
          console.log(`Showing card: ${step.showCard}`);
          setVisibleCards(prev => prev.includes(step.showCard!) ? prev : [...prev, step.showCard!]);
        }

        navigate(step.path);
        setTimeout(() => executeScrollActions(step), 100);

        if (index === tourSteps.length - 1) {
          const completeTimeout = setTimeout(() => {
            if (!tourActive) return;
            console.log('Tour completed - setting tourActive to false');
            console.trace('Tour completion call stack');
            tourActiveRef.current = false;
            setTourActive(false);
            setTourPaused(false);
            setTourCompleted(true);
            setCurrentTourStep(0);
            setVisibleCards([]);
            navigate('/');
          }, step.duration);
          timeoutsRef.current.push(completeTimeout);
        }
      }, stepDelay);

      timeoutsRef.current.push(timeout);
    }
    
    console.log(`Scheduled ${tourSteps.length - startIndex} steps, total timeouts: ${timeoutsRef.current.length}`);
  };

  const startTour = () => {
    console.log('Starting tour');
    clearScheduled();
    setCurrentTourStep(0);
    setTourCompleted(false);
    setTourPaused(false);
    setNavigationActive(false); // Navigation will start when video minimizes
    navigationActiveRef.current = false;
    console.log('Setting tourActive to true...');
    tourActiveRef.current = true;
    setTourActive(true);
    setShowTour(true);
    setPageVisible(true);
    
    // Schedule the tour steps, but they won't execute until navigationActive is true
    console.log('Scheduling tour steps (will wait for navigation to be activated)...');
    setTimeout(() => {
      scheduleTourFrom(0);
      console.log('Tour scheduling completed');
    }, 0);
  };

  const startNavigation = () => {
    console.log('Starting tour navigation');
    setNavigationActive(true);
    navigationActiveRef.current = true;
  };

  const stopTour = () => {
    console.log('stopTour called - setting tourActive to false');
    console.trace('stopTour call stack');
    clearScheduled();
    tourActiveRef.current = false;
    setTourActive(false);
    setTourPaused(false);
    setNavigationActive(false);
    navigationActiveRef.current = false;
    setCurrentTourStep(0);
    setPageVisible(true);
    setVisibleCards([]);
    setShowTour(false);
    setTourCompleted(false);
    navigate('/');
  };

  const pauseTour = () => {
    if (!tourActive || tourPaused) return;
    console.log('Pausing tour, clearing scheduled timeouts');
    setTourPaused(true);
    clearScheduled();
  };

  const resumeTour = () => {
    if (!tourActive || !tourPaused) return;
    console.log(`Resuming tour from step ${currentTourStep}`);
    setTourPaused(false);
    
    // Resume from current step if still valid
    if (currentTourStep < tourSteps.length) {
      const remainingSteps = tourSteps.length - currentTourStep;
      console.log(`Resuming with ${remainingSteps} steps remaining`);
      scheduleTourFrom(currentTourStep);
    } else {
      // Already at the end, just complete
      console.log('Tour was already complete, finishing - setting tourActive to false');
      console.trace('Resume completion call stack');
      tourActiveRef.current = false;
      setTourActive(false);
      setTourCompleted(true);
      setCurrentTourStep(0);
      setVisibleCards([]);
      navigate('/');
    }
  };

  const closeTour = () => {
    stopTour();
  };

  const executeStep = (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= tourSteps.length) return;
    
    const step = tourSteps[stepIndex];
    console.log(`Manually executing step ${stepIndex}: ${step.title} -> ${step.path}`);
    
    setCurrentTourStep(stepIndex);
    
    if (step.showCard && step.path === '/') {
      console.log(`Showing card: ${step.showCard}`);
      setVisibleCards(prev => prev.includes(step.showCard!) ? prev : [...prev, step.showCard!]);
    }
    
    navigate(step.path);
    setTimeout(() => executeScrollActions(step), 100);
  };

  const nextStep = () => {
    if (!tourActive) return;
    clearScheduled(); // Stop automatic progression
    const nextIndex = currentTourStep + 1;
    if (nextIndex < tourSteps.length) {
      executeStep(nextIndex);
    } else {
      // Reached the end, complete the tour
      console.log('Manual navigation completed tour - setting tourActive to false');
      console.trace('Manual navigation completion call stack');
      tourActiveRef.current = false;
      setTourActive(false);
      setTourPaused(false);
      setTourCompleted(true);
      setCurrentTourStep(0);
      setVisibleCards([]);
      navigate('/');
    }
  };

  const prevStep = () => {
    if (!tourActive) return;
    clearScheduled(); // Stop automatic progression
    const prevIndex = currentTourStep - 1;
    if (prevIndex >= 0) {
      executeStep(prevIndex);
    }
  };

  // Handle scroll actions for current step
  const executeScrollActions = (step: TourStep) => {
    step.scrollActions.forEach((action) => {
      setTimeout(() => {
        window.scrollTo({
          top: action.scrollTo,
          behavior: action.smooth ? 'smooth' : 'auto'
        });
      }, action.delay);
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearScheduled();
    };
  }, []);

  const value = {
    currentTourStep,
    tourActive,
    tourPaused,
    tourCompleted,
    pageVisible,
    visibleCards,
    showTour,
    navigationActive,
    startTour,
    stopTour,
    pauseTour,
    resumeTour,
    closeTour,
    startNavigation,
    nextStep,
    prevStep,
    tourSteps
  };

  return (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  );
};