import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTour } from '../contexts/TourContext';

export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  const { tourActive } = useTour();

  useEffect(() => {
    if (tourActive) return; // Let the tour control scrolling during an active tour
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, tourActive]);

  return null;
};