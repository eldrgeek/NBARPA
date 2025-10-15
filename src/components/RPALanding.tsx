import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  Heart, 
  Briefcase, 
  UserCheck, 
  Star,
  ArrowRight,
  ExternalLink,
  Play,
  CheckCircle,
  TrendingUp,
  Shield,
  Award
} from 'lucide-react';
import { useTour } from '../contexts/TourContext';
import { QuickQuiz } from './QuickQuiz';

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
  priority?: number;
  category?: string;
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
    available: true,
    priority: 1,
    category: 'player'
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
    available: true,
    priority: 2,
    category: 'player'
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
    available: true,
    priority: 3,
    category: 'supporter'
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
    available: true,
    priority: 4,
    category: 'partner'
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
    available: true,
    priority: 5,
    category: 'supporter'
  }
];

export const RPALanding: React.FC = () => {
  const navigate = useNavigate();
  const { startTour, pageVisible, tourActive, visibleCards } = useTour();
  const [activePlayers, setActivePlayers] = useState(523);
  const [mentorshipHours, setMentorshipHours] = useState(1247);
  const [successStories, setSuccessStories] = useState(89);
  const [showQuickQuiz, setShowQuickQuiz] = useState(false);

  // Animate counters on mount
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePlayers(prev => prev < 530 ? prev + 1 : prev);
      setMentorshipHours(prev => prev < 1250 ? prev + 1 : prev);
      setSuccessStories(prev => prev < 92 ? prev + 1 : prev);
    }, 50);
    
    return () => clearInterval(timer);
  }, []);

  const handleJourneySelect = (journey: JourneyOption) => {
    if (journey.available) {
      navigate(journey.path);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-orange-600">
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: pageVisible ? 1 : 0, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-orange-400" />
              <span className="text-white/80 text-sm font-medium">Official NBRPA Platform</span>
            </div>
            
            <div className="flex items-center justify-center gap-3 mb-6">
              <Users className="w-10 h-10 text-orange-400" />
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                RPA Connect
              </h1>
            </div>
            
            {/* Improved Value Proposition */}
            <h2 className="text-white text-2xl md:text-3xl font-bold max-w-4xl mx-auto mb-4">
              Your Bridge from Basketball to Business & Beyond
            </h2>
            <p className="text-white/90 text-xl max-w-3xl mx-auto mb-8">
              Join 500+ NBA players building successful second careers through personalized transition planning, 
              direct access to our alumni network, and the proven Five Pillars framework.
            </p>
            
            {/* Success Metrics */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20"
              >
                <div className="text-3xl font-bold text-orange-400">{activePlayers}+</div>
                <div className="text-white/80 text-sm">Players Connected</div>
              </motion.div>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20"
              >
                <div className="text-3xl font-bold text-orange-400">{mentorshipHours.toLocaleString()}+</div>
                <div className="text-white/80 text-sm">Mentorship Hours</div>
              </motion.div>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20"
              >
                <div className="text-3xl font-bold text-orange-400">{successStories}%</div>
                <div className="text-white/80 text-sm">Success Rate</div>
              </motion.div>
            </div>
            
            {/* Primary CTA and Secondary Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowQuickQuiz(true)}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-orange-500/30 transition-all"
              >
                Find Your Path
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/five-pillars')}
                className="inline-flex items-center gap-2 text-white/90 hover:text-white text-base font-medium transition-colors border border-white/30 hover:border-white/50 rounded-lg px-6 py-3"
              >
                <span>Learn About Five Pillars</span>
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

          {/* Tour Button - More Subtle Placement */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <p className="text-white/70 text-sm mb-3">New to RPA Connect?</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startTour}
              disabled={tourActive}
              className={`
                inline-flex items-center gap-3 px-6 py-3 rounded-xl text-base font-medium transition-all
                ${tourActive 
                  ? 'bg-white/10 text-white/50 cursor-not-allowed' 
                  : 'bg-white/20 hover:bg-white/25 text-white border border-white/30'
                }
              `}
            >
              <Play className="w-4 h-4" />
              {tourActive ? 'Tour in Progress...' : 'Take a Quick Tour'}
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
                <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
                  Who Are You?
                </h2>
                <p className="text-white/70">Select your role to get personalized resources and support</p>
              </div>
            )}
            
            {/* Journey Cards - Organized by Category */}
            <div className="space-y-8">
              {/* Players Section */}
              <div>
                <h3 className="text-lg font-medium text-white/80 mb-4">For Players</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {journeyOptions
                    .filter(journey => journey.category === 'player' && (!tourActive || visibleCards.includes(journey.id)))
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
                            ${journey.id === 'retired' 
                              ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-400/40 hover:border-orange-400/60'
                              : 'bg-white/15 border-white/30 hover:bg-white/20 hover:border-white/40'
                            } cursor-pointer
                          `}
                        >
                          {journey.id === 'retired' && (
                            <div className="absolute top-3 right-3">
                              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                Most Popular
                              </span>
                            </div>
                          )}
                          
                          {/* Icon */}
                          <div className="flex justify-center mb-4">
                            <div className={`
                              w-16 h-16 rounded-xl flex items-center justify-center
                              bg-gradient-to-r ${journey.bgGradient}
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
                            
                            <div className="flex items-center justify-center gap-2 text-white font-medium">
                              <span>Get Started</span>
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Support Network Section */}
              <div>
                <h3 className="text-lg font-medium text-white/80 mb-4">For Support Network & Partners</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {journeyOptions
                    .filter(journey => journey.category !== 'player' && (!tourActive || visibleCards.includes(journey.id)))
                    .map((journey, index) => {
                    const JourneyIcon = journey.icon;
                    return (
                      <motion.div
                        key={journey.id}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ 
                          duration: 0.5,
                          delay: tourActive ? 0.3 : 0.1 * (index + 2),
                          type: "spring",
                          stiffness: 100
                        }}
                        whileHover={{ scale: 1.02 }}
                        className="h-full"
                      >
                        <div
                          onClick={() => handleJourneySelect(journey)}
                          className="relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 h-full flex flex-col bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30 cursor-pointer"
                        >
                          {/* Icon */}
                          <div className="flex justify-center mb-4">
                            <div className={`
                              w-14 h-14 rounded-xl flex items-center justify-center
                              bg-gradient-to-r ${journey.bgGradient}
                            `}>
                              <JourneyIcon className="w-7 h-7 text-white" />
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="text-center flex-1 flex flex-col">
                            <h3 className="text-lg font-semibold text-white mb-2">
                              {journey.title}
                            </h3>
                            <p className="text-white/70 text-sm mb-3">{journey.subtitle}</p>
                            <p className="text-white/50 text-xs flex-1 mb-4">{journey.description}</p>
                            
                            <div className="flex items-center justify-center gap-2 text-white/90 text-sm font-medium">
                              <span>Learn More</span>
                              <ArrowRight className="w-3 h-3" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trust Signals and Partnership Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 mb-12"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-6 text-center">
                Trusted by NBA Players & Organizations
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
                <div className="flex flex-col items-center">
                  <Award className="w-8 h-8 text-orange-400 mb-2" />
                  <span className="text-white/70 text-sm text-center">NBA Official Partner</span>
                </div>
                <div className="flex flex-col items-center">
                  <Shield className="w-8 h-8 text-orange-400 mb-2" />
                  <span className="text-white/70 text-sm text-center">Secure & Confidential</span>
                </div>
                <div className="flex flex-col items-center">
                  <CheckCircle className="w-8 h-8 text-orange-400 mb-2" />
                  <span className="text-white/70 text-sm text-center">Verified Alumni Network</span>
                </div>
                <div className="flex flex-col items-center">
                  <TrendingUp className="w-8 h-8 text-orange-400 mb-2" />
                  <span className="text-white/70 text-sm text-center">Proven Success Rate</span>
                </div>
              </div>
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
            <h3 className="text-2xl font-semibold text-white mb-3">
              Why RPA Connect?
            </h3>
            <p className="text-white/80 max-w-3xl mx-auto mb-8">
              We understand the unique challenges of transitioning from professional basketball. 
              Our platform combines personalized support, peer mentorship, and proven strategies 
              to help you build a fulfilling life beyond the court.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all cursor-pointer"
                onClick={() => navigate('/five-pillars')}
              >
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-orange-400" />
                </div>
                <h4 className="text-white font-semibold mb-2">Personalized Assessment</h4>
                <p className="text-white/70 text-sm mb-3">AI-powered coaching tailored to your background and goals</p>
                <div className="text-orange-400 text-sm font-medium">Start Assessment →</div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all cursor-pointer"
                onClick={() => navigate('/five-pillars')}
              >
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="text-white font-semibold mb-2">Alumni Mentorship</h4>
                <p className="text-white/70 text-sm mb-3">Connect with successful former players in your areas of interest</p>
                <div className="text-purple-400 text-sm font-medium">View Mentors →</div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all cursor-pointer"
                onClick={() => navigate('/five-pillars')}
              >
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="text-white font-semibold mb-2">Five Pillars Framework</h4>
                <p className="text-white/70 text-sm mb-3">Holistic approach covering all aspects of successful transition</p>
                <div className="text-blue-400 text-sm font-medium">Explore Framework →</div>
              </motion.div>
            </div>
          </motion.div>
          )}
        </div>
      </div>

      {/* Quick Quiz Modal */}
      <AnimatePresence>
        {showQuickQuiz && (
          <QuickQuiz />
        )}
      </AnimatePresence>
    </div>
  );
};