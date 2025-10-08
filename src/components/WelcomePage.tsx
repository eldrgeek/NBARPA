import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBasket as Basketball, CheckCircle, Circle, FileText, Users, TrendingUp, Calendar, ArrowRight, ExternalLink, Bot, MessageSquare } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Transition & Purpose Assessment',
    description: 'Complete your personalized assessment to understand your transition needs',
    icon: FileText,
    active: true,
    completed: false,
    path: '/assessment'
  },
  {
    id: 2,
    title: 'Career Exploration Workshop',
    description: 'Explore post-basketball career opportunities aligned with your interests',
    icon: TrendingUp,
    active: false,
    completed: false,
    path: null
  },
  {
    id: 3,
    title: 'Mentorship Matching',
    description: 'Connect with successful NBA alumni in your areas of interest',
    icon: Users,
    active: false,
    completed: false,
    path: null
  },
  {
    id: 4,
    title: 'Action Plan Development',
    description: 'Create your personalized roadmap for the next chapter',
    icon: Calendar,
    active: false,
    completed: false,
    path: null
  }
];

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Basketball className="w-8 h-8 text-orange-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Welcome to NextChapter
            </h1>
          </div>
          <p className="text-white/80 text-lg md:text-xl max-w-3xl mx-auto mb-4">
            Your journey from the court to your next chapter starts here. 
            Follow these steps to discover your path forward.
          </p>
          
          {/* Association Link */}
          <div className="flex items-center justify-center">
            <a
              href="https://legendsofbasketball.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white/80 text-sm transition-colors"
            >
              <span>Powered by Legends of Basketball</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

        {/* Assessment Options */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20"
        >
          <h2 className="text-xl font-semibold text-white mb-4 text-center">Take the Five Pillars Assessment</h2>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/assessment')}
            className="w-full p-6 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-400/30 rounded-xl text-left hover:from-orange-500/30 hover:to-orange-600/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-6 h-6 text-orange-400" />
              <h3 className="text-lg font-semibold text-white">Five Pillars Assessment (25 Questions)</h3>
            </div>
            <p className="text-white/80 text-sm mb-3">
              Complete our comprehensive assessment covering all five pillars: Camaraderie, Health, Finance, Community, and Family. 
              All questions on one page for easy completion.
            </p>
            <div className="flex items-center gap-2 text-orange-400 text-sm font-medium">
              <MessageSquare className="w-4 h-4" />
              <span>Recommended - Single Page Format</span>
            </div>
          </motion.button>
          
          {/* Legacy assessments link */}
          <div className="mt-4 text-center">
            <p className="text-white/50 text-xs">
              Looking for the old assessments? 
              <button
                onClick={() => navigate('/legacy/conversational-assessment')}
                className="ml-1 text-orange-400 hover:text-orange-300 underline"
              >
                AI Conversation
              </button>
              {' or '}
              <button
                onClick={() => navigate('/legacy/assessment-form')}
                className="text-orange-400 hover:text-orange-300 underline"
              >
                Step-by-Step Form
              </button>
            </p>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Your Progress</h2>
            <div className="text-white/80">
              <span className="text-2xl font-bold text-orange-400">0</span>
              <span className="text-sm"> / 4 Steps Complete</span>
            </div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3">
            <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full w-0 transition-all duration-700"></div>
          </div>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              className={`
                relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 cursor-pointer
                ${step.active 
                  ? 'bg-white/15 border-orange-400/50 hover:bg-white/20 hover:border-orange-400' 
                  : 'bg-white/5 border-white/10 opacity-60'
                }
              `}
              onClick={() => step.active && step.path && navigate(step.path)}
              whileHover={step.active ? { scale: 1.02 } : {}}
            >
              {/* Step Number */}
              <div className={`
                absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${step.completed 
                  ? 'bg-green-500 text-white' 
                  : step.active 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white/10 text-white/50'
                }
              `}>
                {step.completed ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>

              {/* Content */}
              <div className="flex items-start gap-4">
                <div className={`
                  flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center
                  ${step.active 
                    ? 'bg-orange-500/20 text-orange-400' 
                    : 'bg-white/10 text-white/40'
                  }
                `}>
                  <step.icon className="w-6 h-6" />
                </div>

                <div className="flex-1">
                  <h3 className={`text-lg font-semibold mb-2 ${step.active ? 'text-white' : 'text-white/60'}`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm mb-4 ${step.active ? 'text-white/80' : 'text-white/40'}`}>
                    {step.description}
                  </p>

                  {step.active && (
                    <div className="flex items-center gap-2 text-orange-400 font-medium">
                      <span>Start Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}

                  {!step.active && (
                    <div className="flex items-center gap-2 text-white/40 text-sm">
                      <Circle className="w-4 h-4" />
                      <span>Available after previous step</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-white/80 mb-6">
            Ready to begin your transition journey?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/assessment')}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all"
          >
            Start Five Pillars Assessment
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};