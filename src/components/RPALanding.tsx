import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  Heart, 
  Briefcase, 
  UserCheck, 
  Star,
  ArrowRight,
  ExternalLink,
  Play
} from 'lucide-react';
import { useTour } from '../contexts/TourContext';

interface JourneyOption {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgGradient: string;
  path: string;
  available: boolean;
}

const journeyOptions: JourneyOption[] = [
  {
    id: 'retired',
    title: 'Retired Player',
    subtitle: 'Transition to your next chapter',
    description: 'Access personalized assessment tools, connect with mentors, and explore post-basketball opportunities designed specifically for retired NBA players.',
    icon: Trophy,
    color: 'orange',
    bgGradient: 'from-orange-500 to-orange-600',
    path: '/welcome',
    available: true
  },
  {
    id: 'family',
    title: 'Family Member',
    subtitle: "Support your player's journey",
    description: 'Learn how to support your loved one through their transition. Access resources for families and connect with other NBA families.',
    icon: Heart,
    color: 'pink',
    bgGradient: 'from-pink-500 to-pink-600',
    path: '/family',
    available: true
  },
  {
    id: 'fan',
    title: 'Fan & Supporter',
    subtitle: 'Support player transitions',
    description: "Learn about player transitions, support our mission, and discover how you can make a difference in players' post-basketball lives.",
    icon: Star,
    color: 'yellow',
    bgGradient: 'from-yellow-500 to-yellow-600',
    path: '/fan',
    available: true
  },
  {
    id: 'business',
    title: 'Business Partner',
    subtitle: 'Connect with NBA talent',
    description: 'Explore partnership opportunities, mentorship programs, and business ventures with current and former NBA players.',
    icon: Briefcase,
    color: 'purple',
    bgGradient: 'from-purple-500 to-purple-600',
    path: '/business',
    available: true
  },
  {
    id: 'active',
    title: 'Active Player',
    subtitle: 'Prepare for life after basketball',
    description: 'Start planning your transition while still playing. Access resources, financial planning tools, and career exploration opportunities.',
    icon: UserCheck,
    color: 'blue',
    bgGradient: 'from-blue-500 to-blue-600',
    path: '/active-player',
    available: true
  }
];

export const RPALanding: React.FC = () => {
  const navigate = useNavigate();
  const { startTour, pageVisible, tourActive, visibleCards } = useTour();

  const handleJourneySelect = (journey: JourneyOption) => {
    if (journey.available) {
      navigate(journey.path);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-orange-600">
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: pageVisible ? 1 : 0, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Users className="w-10 h-10 text-orange-400" />
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                RPA Connect
              </h1>
            </div>
            <p className="text-white/90 text-xl md:text-2xl max-w-4xl mx-auto mb-4">
              Helping NBA players connect with resources and opportunities through every stage of their journey
            </p>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              RPA Connect is the hub for connecting retired players, families, fans and
              business partners and active players with one another.
            </p>
            <p className="text-white/70 text-lg max-w-3xl mx-auto mb-4">
              It's based on The RPA's Five Pillars Model: Camaraderie, Health, Finance, Community, and Family.
            </p>
            
            {/* Five Pillars Link */}
            <div className="flex items-center justify-center mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/five-pillars')}
                className="inline-flex items-center gap-2 text-white/80 hover:text-white text-base font-medium transition-colors border border-white/30 hover:border-white/50 rounded-lg px-4 py-2"
              >
                <span>Learn About the Five Pillars</span>
                <ExternalLink className="w-4 h-4" />
              </motion.button>
            </div>
            
            {/* Association Link */}
            <div className="flex items-center justify-center mt-6">
              <a
                href="https://legendsofbasketball.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white/80 text-sm transition-colors"
              >
                <span>A program of Legends of Basketball</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Large Tour Button - Always Visible */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startTour}
              disabled={tourActive}
              className={`
                inline-flex items-center gap-4 px-12 py-6 rounded-2xl text-xl font-semibold transition-all
                ${tourActive 
                  ? 'bg-white/20 text-white/60 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-2xl hover:shadow-orange-500/30'
                }
              `}
            >
              <Play className="w-6 h-6" />
              {tourActive ? 'Tour in Progress...' : 'Get a Tour of RPA Connect'}
            </motion.button>
          </motion.div>

          {/* Journey Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: pageVisible ? 1 : 0, y: 0 }}
            transition={{ duration: 0.6, delay: pageVisible ? 0.2 : 0 }}
            className="mb-8"
          >
            {(visibleCards.length > 0 || !tourActive) && (
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                  Select Your Journey
                </h2>
              </div>
            )}
            
            {/* Journey Cards - Show based on visibleCards or show all if not touring */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {journeyOptions
                .filter(journey => !tourActive || visibleCards.includes(journey.id))
                .map((journey, index) => {
                const JourneyIcon = journey.icon;
                return (
                  <motion.div
                    key={journey.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.5,
                      delay: tourActive ? 0.3 : 0.1 * index,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={journey.available ? { scale: 1.02 } : {}}
                    className="h-full"
                  >
                    <div
                      onClick={() => handleJourneySelect(journey)}
                      className={`
                        relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 h-full flex flex-col
                        ${journey.available 
                          ? `bg-white/15 border-white/30 hover:bg-white/20 hover:border-white/40 cursor-pointer` 
                          : 'bg-white/5 border-white/10 opacity-60 cursor-not-allowed'
                        }
                      `}
                    >
                      {/* Icon */}
                      <div className="flex justify-center mb-4">
                        <div className={`
                          w-16 h-16 rounded-xl flex items-center justify-center
                          ${journey.available 
                            ? `bg-gradient-to-r ${journey.bgGradient}` 
                            : 'bg-white/10'
                          }
                        `}>
                          <JourneyIcon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="text-center flex-1 flex flex-col">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {journey.title}
                        </h3>
                        <p className="text-white/80 text-sm mb-3">{journey.subtitle}</p>
                        <p className="text-white/60 text-sm flex-1 mb-4">{journey.description}</p>
                        
                        {journey.available && (
                          <div className="flex items-center justify-center gap-2 text-white font-medium">
                            <span>Get Started</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Features Section - Show when not touring or when cards are visible */}
          {(!tourActive || visibleCards.length > 0) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: pageVisible ? 1 : 0 }}
              transition={{ duration: 0.6, delay: pageVisible ? 0.6 : 0 }}
              className="mt-16 text-center"
            >
            <h3 className="text-xl font-semibold text-white mb-6">
              Our Mission
            </h3>
            <p className="text-white/80 max-w-3xl mx-auto mb-8">
              The RPA Connect platform is dedicated to ensuring every NBA player has the resources, 
              support, and opportunities they need to thrive beyond basketball. We believe in the 
              power of community, mentorship, and purpose-driven transitions.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-orange-400" />
                </div>
                <h4 className="text-white font-semibold mb-2">Community</h4>
                <p className="text-white/70 text-sm">Connect with fellow players and build lasting relationships</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="text-white font-semibold mb-2">Purpose</h4>
                <p className="text-white/70 text-sm">Discover new passions and define your next chapter</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="text-white font-semibold mb-2">Support</h4>
                <p className="text-white/70 text-sm">Access resources tailored to your unique journey</p>
              </div>
            </div>
          </motion.div>
          )}
        </div>
      </div>

    </div>
  );
};