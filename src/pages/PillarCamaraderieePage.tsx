import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Home, ArrowLeft, Trophy, Heart, Calendar, MessageCircle } from 'lucide-react';
import { PillarImageCard } from '../components/PillarImageCard';
import { PillarExplorationModal } from '../components/PillarExplorationModal';
import { usePillarProgressContext } from '../contexts/PillarProgressContext';

export const PillarCamaraderieePage: React.FC = () => {
  const navigate = useNavigate();
  const { progress, markPillarVisited } = usePillarProgressContext();
  const [showExplorationModal, setShowExplorationModal] = useState(false);

  // Mark this pillar as visited when the component mounts
  useEffect(() => {
    markPillarVisited('camaraderie');
  }, [markPillarVisited]);

  const supportAreas = [
    {
      title: "Legacy Celebration & Recognition",
      description: "Digital and physical spaces honoring all NBA alumni, annual recognition events, and achievement documentation ensuring legacies are remembered.",
      icon: Trophy,
      color: "gold",
      bgGradient: "from-yellow-500 to-orange-600"
    },
    {
      title: "Alumni Connection Networks", 
      description: "Regional alumni chapters, team-based reunion programs, and cross-generational mentorship linking veterans with recent retirees.",
      icon: Users,
      color: "blue",
      bgGradient: "from-blue-500 to-indigo-600"
    },
    {
      title: "Brotherhood Preservation Programs",
      description: "Mentorship matching, peer support circles, and brotherhood events recreating the team environment for ongoing connection.",
      icon: Heart,
      color: "red",
      bgGradient: "from-red-500 to-pink-600"
    },
    {
      title: "Home Building Initiatives",
      description: "Community spaces for gathering, welcome programs for newly retired players, and tradition building creating lasting belonging.",
      icon: MessageCircle,
      color: "green",
      bgGradient: "from-green-500 to-emerald-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-orange-600">
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/five-pillars')}
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Five Pillars</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </motion.button>
            </div>

            {/* Hero Section */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white text-left">
                    Camaraderie
                  </h1>
                  <p className="text-orange-300 text-lg font-medium text-left">The First Pillar</p>
                </div>
              </div>
              
              <p className="text-white/90 text-xl md:text-2xl max-w-4xl mx-auto mb-6">
                Celebrate Legacy and Continue to Be a Home
              </p>
              <p className="text-white/70 text-lg max-w-3xl mx-auto">
                Camaraderie forms the foundation of The RPA's Five Pillars model because it recognizes that 
                the bonds formed through basketball are too valuable to lose when careers end.
              </p>
            </div>
          </motion.div>

          {/* Statistics Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-12"
          >
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">The Power of Brotherhood</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-300 mb-2">67%</div>
                <div className="text-white/70 text-sm">feel isolated after retirement</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-300 mb-2">15+</div>
                <div className="text-white/70 text-sm">years average playing relationships</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-300 mb-2">500+</div>
                <div className="text-white/70 text-sm">alumni in RPA network</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-300 mb-2">10</div>
                <div className="text-white/70 text-sm">cities with active chapters</div>
              </div>
            </div>
          </motion.div>

          {/* Support Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-semibold text-white mb-8 text-center">
              Core Components
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {supportAreas.map((area, index) => (
                <PillarImageCard
                  key={index}
                  title={area.title}
                  description={area.description}
                  icon={area.icon}
                  color={area.color}
                  bgGradient={area.bgGradient}
                />
              ))}
            </div>
          </motion.div>

          {/* 2025+ Execution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-12"
          >
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              2025+ Game-Winning Execution
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">🎉 Signature In-Person Events</h3>
                <ul className="text-white/70 text-sm space-y-2">
                  <li>• Annual RPA Legacy Celebration</li>
                  <li>• Regional Brotherhood Gatherings</li>
                  <li>• Team Reunion Championships</li>
                  <li>• Cross-Era Mentorship Summits</li>
                  <li>• Family Legacy Weekends</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">📱 Digital Engagement Platforms</h3>
                <ul className="text-white/70 text-sm space-y-2">
                  <li>• RPA Alumni App</li>
                  <li>• Legacy Storytelling Platform</li>
                  <li>• Mentorship Matching System</li>
                  <li>• Event Coordination Hub</li>
                  <li>• Community Forums</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* User Categories Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-12"
          >
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              Supporting Every Member of RPA Connect
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-3">🏀 Retired Players</h3>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• Alumni networks and peer connections</li>
                  <li>• Legacy celebration events</li>
                  <li>• Peer mentorship programs</li>
                  <li>• Regular reunions and gatherings</li>
                </ul>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-3">⭐ Active Players</h3>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• Transition mentorship from alumni</li>
                  <li>• Legacy planning and perspective</li>
                  <li>• Network building for future support</li>
                  <li>• Brotherhood extension beyond teammates</li>
                </ul>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-3">👨‍👩‍👧‍👦 Families</h3>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• Family legacy programs</li>
                  <li>• Spouse and children networks</li>
                  <li>• Community events for families</li>
                  <li>• Tradition preservation</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">
                Your Basketball Career Connected You to a Brotherhood
              </h2>
              <p className="text-orange-100 mb-6">
                The Camaraderie Pillar ensures that those bonds remain strong and continue to enrich your life 
                and the lives of others who share this unique journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/welcome')}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Join the Brotherhood
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowExplorationModal(true)}
                  className="border border-white/30 hover:border-white/50 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Explore Other Pillars
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pillar Exploration Modal */}
      <PillarExplorationModal
        isOpen={showExplorationModal}
        onClose={() => setShowExplorationModal(false)}
        progress={progress}
        currentPillar="camaraderie"
      />
    </div>
  );
};