import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  User,
  Trophy,
  Heart,
  Briefcase,
  Star,
  Target,
  Users,
  TrendingUp,
  HeartHandshake,
  Lightbulb,
  MessageCircle,
  BookOpen,
  UserPlus
} from 'lucide-react';

interface QuizAnswer {
  question: number;
  answer: string;
}

const questions = [
  {
    id: 1,
    title: "What's your connection to the NBA?",
    options: [
      { id: 'current', label: 'Current Player', icon: User },
      { id: 'retired', label: 'Retired Player', icon: Trophy },
      { id: 'family', label: 'Family Member', icon: Heart },
      { id: 'business', label: 'Business Partner', icon: Briefcase },
      { id: 'fan', label: 'Fan/Supporter', icon: Star }
    ]
  },
  {
    id: 2,
    title: "What's your primary goal?",
    options: [
      { id: 'career', label: 'Career transition planning', icon: TrendingUp },
      { id: 'connections', label: 'Building connections', icon: Users },
      { id: 'opportunities', label: 'Finding opportunities', icon: Target },
      { id: 'support', label: 'Supporting a player', icon: HeartHandshake },
      { id: 'learn', label: 'Learning about transitions', icon: Lightbulb }
    ]
  },
  {
    id: 3,
    title: "How would you like to start?",
    options: [
      { id: 'ai-coach', label: 'Talk to an AI coach', icon: MessageCircle },
      { id: 'resources', label: 'Browse resources', icon: BookOpen },
      { id: 'connect', label: 'Connect with someone', icon: UserPlus },
      { id: 'assessment', label: 'Take the full assessment', icon: CheckCircle }
    ]
  }
];

export const QuickQuiz: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleAnswer = (answerId: string) => {
    setSelectedOption(answerId);
  };

  const handleNext = () => {
    if (!selectedOption) return;

    const newAnswers = [...answers, { question: currentQuestion, answer: selectedOption }];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      // Route based on answers
      routeUser(newAnswers);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const previousAnswer = answers.find(a => a.question === currentQuestion - 1);
      setSelectedOption(previousAnswer?.answer || null);
      setAnswers(answers.filter(a => a.question !== currentQuestion - 1));
    }
  };

  const routeUser = (userAnswers: QuizAnswer[]) => {
    const connection = userAnswers.find(a => a.question === 0)?.answer;
    const goal = userAnswers.find(a => a.question === 1)?.answer;
    const preference = userAnswers.find(a => a.question === 2)?.answer;

    // Route based on preference first
    if (preference === 'ai-coach') {
      navigate('/conversational-assessment');
    } else if (preference === 'assessment') {
      navigate('/assessment');
    } else if (preference === 'resources') {
      navigate('/five-pillars');
    } else if (preference === 'connect') {
      // Route based on connection type
      switch(connection) {
        case 'retired':
          navigate('/retired-player');
          break;
        case 'current':
          navigate('/active-player');
          break;
        case 'family':
          navigate('/family');
          break;
        case 'business':
          navigate('/business');
          break;
        case 'fan':
          navigate('/fan');
          break;
        default:
          navigate('/welcome');
      }
    } else {
      // Default routing based on connection type
      switch(connection) {
        case 'retired':
        case 'current':
          navigate('/welcome');
          break;
        case 'family':
          navigate('/family');
          break;
        case 'business':
          navigate('/business');
          break;
        case 'fan':
          navigate('/fan');
          break;
        default:
          navigate('/');
      }
    }
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-purple-900/95 via-purple-800/95 to-orange-600/95 backdrop-blur-xl z-50 flex items-center justify-center p-4"
    >
      <div className="max-w-2xl w-full">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
        >
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/70 text-sm">Question {currentQuestion + 1} of {questions.length}</span>
              <span className="text-white/70 text-sm">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Question */}
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            {question.title}
          </h2>

          {/* Options */}
          <div className="grid gap-4">
            {question.options.map((option) => {
              const OptionIcon = option.icon;
              return (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option.id)}
                  className={`
                    p-4 rounded-xl border transition-all text-left flex items-center gap-4
                    ${selectedOption === option.id
                      ? 'bg-orange-500/30 border-orange-400 text-white'
                      : 'bg-white/5 border-white/20 text-white/90 hover:bg-white/10 hover:border-white/30'
                    }
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-lg flex items-center justify-center
                    ${selectedOption === option.id
                      ? 'bg-orange-500/30'
                      : 'bg-white/10'
                    }
                  `}>
                    <OptionIcon className="w-6 h-6" />
                  </div>
                  <span className="text-lg font-medium">{option.label}</span>
                  {selectedOption === option.id && (
                    <CheckCircle className="w-5 h-5 ml-auto text-orange-400" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
                ${currentQuestion === 0
                  ? 'text-white/30 cursor-not-allowed'
                  : 'text-white hover:bg-white/10'
                }
              `}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!selectedOption}
              className={`
                flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-all
                ${selectedOption
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                  : 'bg-white/10 text-white/50 cursor-not-allowed'
                }
              `}
            >
              {currentQuestion === questions.length - 1 ? 'Get Started' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Skip Link */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/welcome')}
              className="text-white/60 hover:text-white/80 text-sm transition-colors"
            >
              Skip and explore on my own
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};