import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Home, ArrowLeft, Shield, Activity, Brain, Stethoscope } from 'lucide-react';
import { PillarImageCard } from '../components/PillarImageCard';
import { PillarExplorationModal } from '../components/PillarExplorationModal';
import { usePillarProgressContext } from '../contexts/PillarProgressContext';

export const PillarHealthPage: React.FC = () => {
  const navigate = useNavigate();
  const { progress, markPillarVisited } = usePillarProgressContext();
  const [showExplorationModal, setShowExplorationModal] = useState(false);

  // Mark this pillar as visited when the component mounts
  useEffect(() => {
    markPillarVisited('health');
  }, [markPillarVisited]);

  const supportAreas = [
    {
      title: "Physical Health & Rehabilitation",
      description: "Comprehensive health screenings, injury rehabilitation programs, pain management strategies, and fitness adaptation for lifelong wellness.",
      icon: Activity,
      color: "red",
      bgGradient: "from-red-500 to-pink-600"
    },
    {
      title: "Mental Health & Emotional Wellness", 
      description: "Sports psychology services, depression and anxiety support, identity counseling, and stress management techniques.",
      icon: Brain,
      color: "purple",
      bgGradient: "from-purple-500 to-indigo-600"
    },
    {
      title: "Lifestyle Health Education",
      description: "Nutrition guidance, sleep optimization, substance abuse prevention, and wellness habit development for sustainable health.",
      icon: Stethoscope,
      color: "green",
      bgGradient: "from-green-500 to-emerald-600"
    },
    {
      title: "Healthcare Access & Navigation",
      description: "Insurance optimization, provider network development, care coordination, and healthcare advocacy ensuring appropriate care.",
      icon: Shield,
      color: "blue",
      bgGradient: "from-blue-500 to-cyan-600"
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
                <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-600">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white text-left">
                    Health
                  </h1>
                  <p className="text-red-300 text-lg font-medium text-left">The Second Pillar</p>
                </div>
              </div>
              
              <p className="text-white/90 text-xl md:text-2xl max-w-4xl mx-auto mb-6">
                Cultivate Lifelong Mental and Physical Wellness
              </p>
              <p className="text-white/70 text-lg max-w-3xl mx-auto">
                Health represents the second pillar, recognizing that the physical and mental demands of professional 
                basketball require ongoing attention long after careers end.
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
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">The Wellness Imperative</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-300 mb-2">78%</div>
                <div className="text-white/70 text-sm">experience chronic pain</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-300 mb-2">26%</div>
                <div className="text-white/70 text-sm">struggle with depression</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-300 mb-2">65%</div>
                <div className="text-white/70 text-sm">difficulty maintaining fitness</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-300 mb-2">89%</div>
                <div className="text-white/70 text-sm">want long-term health support</div>
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
                <h3 className="text-lg font-semibold text-white mb-4">🏥 Health Screenings</h3>
                <ul className="text-white/70 text-sm space-y-2">
                  <li>• Annual RPA Health Summit</li>
                  <li>• Regional Health Clinics</li>
                  <li>• Specialized Assessments</li>
                  <li>• Mental Health Check-ins</li>
                  <li>• Family Health Days</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">💪 Physical Health Resources</h3>
                <ul className="text-white/70 text-sm space-y-2">
                  <li>• RPA Rehabilitation Centers</li>
                  <li>• Mobile Health Units</li>
                  <li>• Telehealth Networks</li>
                  <li>• Fitness Adaptation Programs</li>
                  <li>• Pain Management Clinics</li>
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
                  <li>• Comprehensive health screenings</li>
                  <li>• Mental health support services</li>
                  <li>• Physical rehabilitation programs</li>
                  <li>• Healthcare navigation assistance</li>
                </ul>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-3">⭐ Active Players</h3>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• Preventive health planning</li>
                  <li>• Mental health maintenance</li>
                  <li>• Injury prevention education</li>
                  <li>• Healthcare optimization</li>
                </ul>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-3">👨‍👩‍👧‍👦 Families</h3>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• Family health screenings</li>
                  <li>• Mental health support for families</li>
                  <li>• Family fitness programs</li>
                  <li>• Healthcare planning for dependents</li>
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
            <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">
                Your Body and Mind Carried You Through an Incredible Career
              </h2>
              <p className="text-red-100 mb-6">
                The Health Pillar ensures they continue to serve you well throughout a long, healthy, 
                and fulfilling life beyond the court.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/welcome')}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Start Health Assessment
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
        currentPillar="health"
      />
    </div>
  );
};