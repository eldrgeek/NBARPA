import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, ChevronLeft, ChevronRight, Minimize2, Maximize2 } from 'lucide-react';
import { useTour } from '../contexts/TourContext';

export const TourModal: React.FC = () => {
  const { 
    showTour, 
    currentTourStep, 
    tourActive, 
    tourPaused,
    tourCompleted,
    navigationActive,
    pauseTour,
    resumeTour,
    stopTour,
    closeTour,
    startNavigation,
    nextStep,
    prevStep,
    tourSteps
  } = useTour();

  const [isFullScreen, setIsFullScreen] = useState(true);
  const [canMinimize, setCanMinimize] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);

  // Auto-minimize after 8 seconds when tour starts - this triggers tour navigation
  useEffect(() => {
    if (showTour && isFullScreen && !canMinimize) {
      const timer = setTimeout(() => {
        console.log('Auto-minimizing video and starting tour navigation');
        setIsFullScreen(false);
        setCanMinimize(true);
        // Small delay to ensure video minimization completes before starting navigation
        setTimeout(() => {
          startNavigation();
        }, 1500); // Wait for animation to complete
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [showTour, isFullScreen, canMinimize, startNavigation]);

  // Reset to full-screen when tour starts
  useEffect(() => {
    if (showTour) {
      setIsFullScreen(true);
      setCanMinimize(false);
      setVideoPaused(false);
    }
  }, [showTour]);

  // Handle tour pause/resume to control video
  useEffect(() => {
    if (tourActive) {
      if (tourPaused && !videoPaused) {
        // Pause video when tour is paused
        console.log('Pausing video due to tour pause');
        controlVideo('pause');
        setVideoPaused(true);
      } else if (!tourPaused && videoPaused) {
        // Resume video when tour is resumed
        console.log('Resuming video due to tour resume');
        controlVideo('play');
        setVideoPaused(false);
      }
    }
  }, [tourActive, tourPaused, videoPaused]);

  // Video control function
  const controlVideo = (action: 'play' | 'pause') => {
    const videoFrame = videoRef.current;
    if (videoFrame && videoFrame.contentWindow) {
      try {
        // Send message to YouTube iframe to control playback
        const message = action === 'play' ? '{"event":"command","func":"playVideo","args":""}' : '{"event":"command","func":"pauseVideo","args":""}';
        videoFrame.contentWindow.postMessage(message, '*');
      } catch (error) {
        console.log('Could not control video:', error);
      }
    }
  };

  // Handle manual minimize with navigation start
  const handleMinimize = () => {
    setIsFullScreen(false);
    setCanMinimize(true);
    if (!navigationActive) {
      console.log('Manually minimizing video and starting tour navigation');
      setTimeout(() => {
        startNavigation();
      }, 1500); // Wait for animation to complete
    }
  };

  // Handle maximize
  const handleMaximize = () => {
    setIsFullScreen(true);
  };

  if (!showTour) return null;

  return (
    <AnimatePresence>
      <motion.div
        layout
        initial={false}
        animate={{
          // Position and size based on full-screen state
          position: 'fixed',
          top: isFullScreen ? 0 : 16,
          right: isFullScreen ? 0 : 16,
          bottom: isFullScreen ? 0 : 'auto',
          left: isFullScreen ? 0 : 'auto',
          width: isFullScreen ? '100vw' : 380,
          height: isFullScreen ? '100vh' : 'auto',
          zIndex: 50
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 30,
          duration: 1
        }}
        className={isFullScreen ? '' : ''}
      >
        <motion.div
          layout
          animate={{
            backgroundColor: isFullScreen ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
            padding: isFullScreen ? '16px' : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 30,
            duration: 1
          }}
          className={`h-full w-full ${isFullScreen ? 'flex items-center justify-center' : ''}`}
        >
          <motion.div
            layout
            className={`
              ${isFullScreen 
                ? 'bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 w-full max-w-6xl max-h-[90vh] overflow-hidden' 
                : 'bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-4 shadow-xl w-full'
              }
            `}
          >
            {/* Header - always visible but styled differently */}
            <motion.div 
              layout
              className={`flex items-center justify-between ${isFullScreen ? 'mb-4' : 'mb-3'}`}
            >
              <motion.div 
                layout
                className="flex items-center gap-2"
                animate={{
                  opacity: isFullScreen ? 1 : 1,
                }}
              >
                <Play className={`${isFullScreen ? 'w-6 h-6' : 'w-5 h-5'} text-orange-400`} />
                <motion.h3 
                  layout
                  className={`${isFullScreen ? 'text-xl' : 'text-base'} font-semibold text-white`}
                >
                  {isFullScreen ? 'Welcome to RPA Connect Tour' : 'RPA Connect Tour'}
                </motion.h3>
              </motion.div>
              
              <motion.div 
                layout
                className="flex items-center gap-2"
              >
                {/* Toggle between minimize/maximize */}
                <motion.button
                  layout
                  onClick={isFullScreen ? handleMinimize : handleMaximize}
                  className={`
                    ${isFullScreen ? 'w-8 h-8' : 'w-6 h-6'} 
                    rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors
                  `}
                  animate={{
                    opacity: canMinimize || !isFullScreen ? 1 : 0,
                    pointerEvents: canMinimize || !isFullScreen ? 'auto' : 'none'
                  }}
                  transition={{ duration: 0.3 }}
                  aria-label={isFullScreen ? "Minimize" : "Maximize"}
                >
                  {isFullScreen ? (
                    <Minimize2 className="w-4 h-4 text-white" />
                  ) : (
                    <Maximize2 className="w-3 h-3 text-white" />
                  )}
                </motion.button>
                
                <motion.button
                  layout
                  onClick={closeTour}
                  className={`
                    ${isFullScreen ? 'w-8 h-8' : 'w-6 h-6'} 
                    rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors
                  `}
                  aria-label="Close tour"
                >
                  <X className={`${isFullScreen ? 'w-4 h-4' : 'w-3 h-3'} text-white`} />
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Video and content container */}
            <motion.div 
              layout
              className={isFullScreen ? '' : 'flex items-start gap-3'}
            >
              {/* Video */}
              <motion.div
                layout
                className={`
                  ${isFullScreen 
                    ? 'relative bg-black/20 rounded-xl overflow-hidden aspect-video mb-4' 
                    : 'w-24 h-16 bg-black/20 rounded overflow-hidden flex-shrink-0'
                  }
                `}
              >
                <iframe
                  ref={videoRef}
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/cEO0S_QNp3U?autoplay=1&rel=0&modestbranding=1&enablejsapi=1&origin=https://rpaconnect.netlify.app"
                  title="RPA Connect Tour"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </motion.div>

              {/* Compact mode content - fades in when minimized */}
              {!isFullScreen && (
                <motion.div 
                  className="flex-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <div className="text-white/70 text-sm mb-3">
                    <span className="text-white/90">{tourSteps[currentTourStep]?.title || 'Home'}</span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-white/80 text-xs">
                      <span>Step</span>
                      <span className="text-orange-400 font-medium">
                        {Math.min(currentTourStep + 1, tourSteps.length)} / {tourSteps.length}
                      </span>
                    </div>
                    <div className="text-white/70 text-xs">
                      {tourCompleted ? (
                        <span>Completed</span>
                      ) : tourActive && tourPaused ? (
                        <span>Paused</span>
                      ) : tourActive && navigationActive ? (
                        <span>Navigating…</span>
                      ) : tourActive ? (
                        <span>Waiting…</span>
                      ) : (
                        <span>Ready</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Full-screen bottom info - fades out when minimized */}
            {isFullScreen && (
              <motion.div 
                className="text-center text-white/80"
                animate={{
                  opacity: isFullScreen ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-lg mb-2">Get ready to explore the RPA Connect platform</p>
                <p className="text-sm text-white/60">
                  This tour will automatically minimize in {!canMinimize ? '8' : '0'} seconds and guide you through each journey type
                </p>
              </motion.div>
            )}

            {/* Compact mode controls - fade in when minimized */}
            {!isFullScreen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                {/* Manual Navigation */}
                {tourActive && (
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={prevStep}
                      disabled={currentTourStep <= 0}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                        currentTourStep <= 0 
                          ? 'bg-white/5 text-white/30 cursor-not-allowed' 
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      <ChevronLeft className="w-3 h-3" />
                      Previous
                    </button>
                    <span className="text-white/60 text-xs">Manual Navigation</span>
                    <button
                      onClick={nextStep}
                      disabled={currentTourStep >= tourSteps.length - 1}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                        currentTourStep >= tourSteps.length - 1
                          ? 'bg-white/5 text-white/30 cursor-not-allowed' 
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      Next
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {tourActive && !tourPaused && (
                    <button
                      onClick={pauseTour}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      Pause
                    </button>
                  )}
                  {tourActive && tourPaused && (
                    <button
                      onClick={resumeTour}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      Resume
                    </button>
                  )}
                  {tourActive && (
                    <button
                      onClick={stopTour}
                      className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      End
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};