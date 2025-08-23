import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Briefcase, 
  Users, 
  Heart, 
  ArrowRight,
  Home,
  Check
} from 'lucide-react';
import { usePillarProgressContext } from '../contexts/PillarProgressContext';

interface Pillar {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgGradient: string;
  path: string;
  userSupport: string;
}

const pillars: Pillar[] = [
  {
    id: 'camaraderie',
    title: 'Camaraderie',
    subtitle: 'Celebrate Legacy and Continue to Be a Home',
    description: 'Preserving the bonds formed through basketball, celebrating achievements, and maintaining the brotherhood that extends beyond playing careers.',
    icon: Users,
    color: 'orange',
    bgGradient: 'from-orange-500 to-orange-600',
    path: '/pillars/camaraderie',
    userSupport: 'Alumni networks • Legacy celebrations • Peer mentorship • Brotherhood events'
  },
  {
    id: 'health',
    title: 'Health',
    subtitle: 'Cultivate Lifelong Mental and Physical Wellness',
    description: 'Addressing the physical and mental health needs that continue long after basketball careers end through comprehensive wellness programs.',
    icon: Heart,
    color: 'red',
    bgGradient: 'from-red-500 to-pink-600',
    path: '/pillars/health',
    userSupport: 'Health screenings • Mental health support • Rehabilitation • Healthcare navigation'
  },
  {
    id: 'finance',
    title: 'Finance',
    subtitle: 'Foster Stability and Resilient Futures',
    description: 'Building and maintaining financial stability that extends far beyond playing careers through education, planning, and professional services.',
    icon: DollarSign,
    color: 'green',
    bgGradient: 'from-green-500 to-green-600',
    path: '/pillars/finance',
    userSupport: 'Financial planning • Investment education • Debt management • Emergency assistance'
  },
  {
    id: 'community',
    title: 'Community',
    subtitle: 'Uplift Our Youth and Our Communities',
    description: 'Creating positive change in communities through youth development, mentorship, and sustainable community investment programs.',
    icon: Briefcase,
    color: 'blue',
    bgGradient: 'from-blue-500 to-blue-600',
    path: '/pillars/community',
    userSupport: 'Youth mentorship • Community programs • Basketball programs • Educational support'
  },
  {
    id: 'family',
    title: 'Family',
    subtitle: 'Nurture Families and Generational Journeys',
    description: 'Strengthening family relationships and supporting generational success through counseling, education, and family-centered programs.',
    icon: Heart,
    color: 'purple',
    bgGradient: 'from-purple-500 to-purple-600',
    path: '/pillars/family',
    userSupport: 'Family counseling • Parenting support • Scholarships • Estate planning'
  }
];

export const FivePillarsPage: React.FC = () => {
  const navigate = useNavigate();
  const { progress, getVisitedCount, getCompletionPercentage } = usePillarProgressContext();

  const handlePillarSelect = (pillar: Pillar) => {
    navigate(pillar.path);
  };

  const visitedCount = getVisitedCount();
  const completionPercentage = getCompletionPercentage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-orange-600">
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            {/* Navigation */}
            <div className="flex items-center justify-between mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Back to Home</span>
              </motion.button>
            </div>

            <div className="flex items-center justify-center gap-3 mb-6">
              <Users className="w-10 h-10 text-orange-400" />
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                The RPA's Five Pillars
              </h1>
            </div>
            <p className="text-white/90 text-xl md:text-2xl max-w-4xl mx-auto mb-4">
              A comprehensive framework for supporting NBA players through every stage of their transition
            </p>
            <p className="text-white/70 text-lg max-w-3xl mx-auto mb-6">
              Each pillar addresses critical aspects of player transition, working together to create 
              a foundation for lifelong success beyond basketball.
            </p>
            
            {/* Progress Indicator */}
            {visitedCount > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 max-w-md mx-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80 text-sm font-medium">Your Progress</span>
                  <span className="text-white/80 text-sm">{visitedCount} of {pillars.length} explored</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
                  />
                </div>
                <p className="text-white/60 text-xs mt-2 text-center">
                  {completionPercentage === 100 
                    ? "🎉 Congratulations! You've explored all five pillars!" 
                    : `${100 - completionPercentage}% remaining to complete your journey`
                  }
                </p>
              </div>
            )}
          </motion.div>

          {/* Introduction Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-12"
          >
            <h2 className="text-2xl font-semibold text-white mb-4">The Framework</h2>
            <p className="text-white/80 mb-6">
              The RPA's Five Pillars model recognizes that successful transition from professional basketball 
              requires addressing multiple interconnected aspects of a player's life. Each pillar builds upon the others, 
              creating a comprehensive support system that helps players not just survive their transition, but thrive in their next chapter.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="font-semibold text-white mb-2">🏀 For All User Categories</div>
                <div className="text-white/70">Each pillar supports retired players, active players, families, business partners, and fans in different ways.</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="font-semibold text-white mb-2">🔄 Interconnected Support</div>
                <div className="text-white/70">The pillars work together - mental health supports career development, community builds purpose, and so on.</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="font-semibold text-white mb-2">📈 Evidence-Based</div>
                <div className="text-white/70">Built on research about player transition challenges and successful support strategies.</div>
              </div>
            </div>
          </motion.div>

          {/* Pillars Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                Explore Each Pillar
              </h2>
              <p className="text-white/70">
                Click on any pillar to learn more about how it supports player transitions
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {pillars.map((pillar, index) => {
                const PillarIcon = pillar.icon;
                const isVisited = progress[pillar.id];
                return (
                  <motion.div
                    key={pillar.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.5,
                      delay: 0.1 * index,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ scale: 1.02 }}
                    className="h-full"
                  >
                    <div
                      onClick={() => handlePillarSelect(pillar)}
                      className="relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 h-full flex flex-col bg-white/15 border-white/30 hover:bg-white/20 hover:border-white/40 cursor-pointer"
                    >
                      {/* Visited Indicator */}
                      {isVisited && (
                        <div className="absolute top-4 right-4">
                          <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                      {/* Icon */}
                      <div className="flex justify-center mb-4">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-r ${pillar.bgGradient}`}>
                          <PillarIcon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="text-center flex-1 flex flex-col">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {pillar.title}
                        </h3>
                        <p className="text-white/80 text-sm mb-3 font-medium">{pillar.subtitle}</p>
                        <p className="text-white/60 text-sm flex-1 mb-4">{pillar.description}</p>
                        
                        {/* Support Types */}
                        <div className="bg-white/10 rounded-lg p-3 mb-4">
                          <div className="text-white/70 text-xs font-medium mb-1">Key Support Areas:</div>
                          <div className="text-white/60 text-xs">{pillar.userSupport}</div>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-white font-medium">
                          <span>{isVisited ? 'Revisit' : 'Learn More'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* How Pillars Support User Categories */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16"
          >
            <h3 className="text-2xl font-semibold text-white mb-8 text-center">
              Supporting Every Member of the RPA Connect Community
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-orange-400" />
                </div>
                <h4 className="text-white font-semibold mb-2 text-center">Retired Players</h4>
                <p className="text-white/70 text-sm text-center">Comprehensive transition support across all five pillars</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="text-white font-semibold mb-2 text-center">Active Players</h4>
                <p className="text-white/70 text-sm text-center">Proactive preparation and early planning resources</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-pink-400" />
                </div>
                <h4 className="text-white font-semibold mb-2 text-center">Families</h4>
                <p className="text-white/70 text-sm text-center">Family support and education for understanding transitions</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="text-white font-semibold mb-2 text-center">Business Partners</h4>
                <p className="text-white/70 text-sm text-center">Partnership opportunities and workforce development</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-yellow-400" />
                </div>
                <h4 className="text-white font-semibold mb-2 text-center">Fans & Supporters</h4>
                <p className="text-white/70 text-sm text-center">Education and advocacy opportunities for player welfare</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};