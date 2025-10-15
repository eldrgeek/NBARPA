import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Users, 
  Heart, 
  DollarSign,
  Check,
  ArrowRight
} from 'lucide-react';
import { PillarProgress } from '../hooks/usePillarProgress';

interface Pillar {
  id: keyof PillarProgress;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  bgGradient: string;
  path: string;
}

interface PillarExplorationModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: PillarProgress;
  currentPillar?: keyof PillarProgress;
}

const pillars: Pillar[] = [
  {
    id: 'camaraderie',
    title: 'Camaraderie',
    subtitle: 'Celebrate Legacy and Continue to Be a Home',
    icon: Heart,
    color: 'orange',
    bgGradient: 'from-orange-500 to-orange-600',
    path: '/pillars/camaraderie'
  },
  {
    id: 'health',
    title: 'Health',
    subtitle: 'Cultivate Lifelong Mental and Physical Wellness',
    icon: Heart,
    color: 'red',
    bgGradient: 'from-red-500 to-pink-600',
    path: '/pillars/health'
  },
  {
    id: 'finance',
    title: 'Finance',
    subtitle: 'Foster Stability and Resilient Futures',
    icon: DollarSign,
    color: 'green',
    bgGradient: 'from-green-500 to-green-600',
    path: '/pillars/finance'
  },
  {
    id: 'community',
    title: 'Community',
    subtitle: 'Uplift Our Youth and Our Communities',
    icon: Users,
    color: 'blue',
    bgGradient: 'from-blue-500 to-blue-600',
    path: '/pillars/community'
  },
  {
    id: 'family',
    title: 'Family',
    subtitle: 'Nurture Families and Generational Journeys',
    icon: Heart,
    color: 'purple',
    bgGradient: 'from-purple-500 to-purple-600',
    path: '/pillars/family'
  }
];

export const PillarExplorationModal: React.FC<PillarExplorationModalProps> = ({
  isOpen,
  onClose,
  progress,
  currentPillar
}) => {
  const navigate = useNavigate();

  const handlePillarClick = (pillar: Pillar) => {
    onClose();
    navigate(pillar.path);
  };

  const visitedCount = Object.values(progress).filter(Boolean).length;
  const completionPercentage = Math.round((visitedCount / pillars.length) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-gradient-to-br from-purple-900/95 via-purple-800/95 to-orange-600/95 backdrop-blur-lg rounded-2xl border border-white/20 z-50 overflow-hidden"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/20">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Explore the Five Pillars
                  </h2>
                  <p className="text-white/70 mt-1">
                    {visitedCount} of {pillars.length} pillars explored ({completionPercentage}% complete)
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Progress Bar */}
              <div className="px-6 py-4 border-b border-white/20">
                <div className="w-full bg-white/10 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
                  />
                </div>
              </div>

              {/* Pillars Grid */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                  {pillars.map((pillar, index) => {
                    const PillarIcon = pillar.icon;
                    const isVisited = progress[pillar.id];
                    const isCurrent = currentPillar === pillar.id;
                    
                    return (
                      <motion.div
                        key={pillar.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => !isCurrent && handlePillarClick(pillar)}
                        className={`
                          relative rounded-xl p-6 border transition-all duration-300 cursor-pointer
                          ${isCurrent 
                            ? 'bg-white/20 border-white/40 ring-2 ring-white/50 cursor-default' 
                            : 'bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30'
                          }
                        `}
                      >
                        {/* Current Pillar Badge */}
                        {isCurrent && (
                          <div className="absolute -top-2 -right-2 bg-white text-purple-900 text-xs font-bold px-2 py-1 rounded-full">
                            Current
                          </div>
                        )}

                        {/* Visited Checkbox */}
                        <div className="absolute top-4 right-4">
                          <div className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                            ${isVisited 
                              ? 'bg-green-500 border-green-500' 
                              : 'border-white/40'
                            }
                          `}>
                            {isVisited && <Check className="w-4 h-4 text-white" />}
                          </div>
                        </div>

                        {/* Pillar Icon */}
                        <div className="flex justify-center mb-4">
                          <div className={`
                            w-14 h-14 rounded-xl flex items-center justify-center
                            bg-gradient-to-r ${pillar.bgGradient}
                          `}>
                            <PillarIcon className="w-7 h-7 text-white" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="text-center">
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {pillar.title}
                          </h3>
                          <p className="text-white/70 text-sm mb-4 leading-relaxed">
                            {pillar.subtitle}
                          </p>
                          
                          {!isCurrent && (
                            <div className="flex items-center justify-center gap-2 text-white/80 font-medium">
                              <span className="text-sm">
                                {isVisited ? 'Revisit' : 'Explore'}
                              </span>
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          )}
                          
                          {isCurrent && (
                            <div className="text-white/60 text-sm font-medium">
                              Currently viewing
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/20 bg-white/5">
                <div className="text-center">
                  <p className="text-white/70 text-sm mb-4">
                    Complete your journey through all five pillars to unlock the full RPA Connect experience
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onClose();
                      navigate('/five-pillars');
                    }}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
                  >
                    View Five Pillars Overview
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};