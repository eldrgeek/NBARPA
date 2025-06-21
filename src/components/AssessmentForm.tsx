import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Download, CheckCircle, ShoppingBasket as Basketball, Star, Trophy, ExternalLink, Copy, FileText, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FormData {
  name: string;
  date: string;
  emotionalState: string[];
  fulfillment: string;
  activities: string[];
  accomplishments: string;
  interests: string[];
  purpose: string;
  support: string[];
  clarity: number;
  supportNeeds: string;
}

const emotionalOptions = [
  'Excited', 'Anxious', 'Relieved', 'Lost', 'Hopeful', 'Overwhelmed', 'Motivated'
];

const interestOptions = [
  'Business/Entrepreneurship', 'Coaching/Mentoring', 'Media/Entertainment',
  'Philanthropy/Community Work', 'Real Estate/Investment', 'Health & Wellness',
  'Education/Personal Development'
];

const supportOptions = [
  'Family', 'Former teammates', 'Coaches/mentors', 'Business advisors',
  'Friends outside basketball', 'No one / not sure'
];

export const AssessmentForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState<FormData>({
    name: '',
    date: new Date().toISOString().split('T')[0],
    emotionalState: [],
    fulfillment: '',
    activities: ['', '', ''],
    accomplishments: '',
    interests: [],
    purpose: '',
    support: [],
    clarity: 5,
    supportNeeds: ''
  });

  const totalSteps = 10; // Added one more step for summary
  const progress = ((completedSteps.size + (currentStep > 0 ? 1 : 0)) / totalSteps) * 100;

  // Test data prefill function
  const prefillTestData = () => {
    setFormData({
      name: 'Michael Jordan',
      date: new Date().toISOString().split('T')[0],
      emotionalState: ['Excited', 'Hopeful', 'Motivated'],
      fulfillment: 'Leading my team to championships and mentoring younger players brought me the most fulfillment. The competitive spirit and the ability to inspire others to be their best was incredibly rewarding.',
      activities: ['Golf and competitive sports', 'Business ventures and investments', 'Mentoring young athletes'],
      accomplishments: 'I hope to build a successful business empire, continue mentoring the next generation of athletes, and make a positive impact in my community through philanthropy and youth programs.',
      interests: ['Business/Entrepreneurship', 'Coaching/Mentoring', 'Philanthropy/Community Work'],
      purpose: 'My purpose is to use the platform and resources I gained from basketball to create opportunities for others and leave a lasting positive impact on the world.',
      support: ['Family', 'Business advisors', 'Former teammates'],
      clarity: 8,
      supportNeeds: 'I would like strategic guidance on business opportunities and help connecting with other successful athletes who have transitioned well into business and philanthropy.'
    });
    
    // Mark all steps as completed except the last one
    const completed = new Set<number>();
    for (let i = 0; i < totalSteps - 2; i++) {
      completed.add(i);
    }
    setCompletedSteps(completed);
    setCurrentStep(totalSteps - 2); // Go to next-to-last step
  };

  // Hotkey listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.shiftKey && event.key === 'T') {
        event.preventDefault();
        prefillTestData();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleArrayChange = (field: keyof FormData, value: string, checked?: boolean) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      if (checked !== undefined) {
        // Checkbox handling
        if (checked) {
          if (field === 'interests' && currentArray.length >= 3) return prev;
          return { ...prev, [field]: [...currentArray, value] };
        } else {
          return { ...prev, [field]: currentArray.filter(item => item !== value) };
        }
      }
      return prev;
    });
  };

  const handleActivityChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.map((activity, i) => i === index ? value : activity)
    }));
  };

  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 0: return formData.name.trim() !== '';
      case 1: return formData.emotionalState.length > 0;
      case 2: return formData.fulfillment.trim() !== '';
      case 3: return formData.activities.some(activity => activity.trim() !== '');
      case 4: return formData.accomplishments.trim() !== '';
      case 5: return formData.interests.length > 0;
      case 6: return formData.purpose.trim() !== '';
      case 7: return formData.support.length > 0;
      case 8: return formData.supportNeeds.trim() !== '';
      case 9: return true; // Summary page is always "complete"
      default: return false;
    }
  };

  const nextStep = () => {
    if (isStepComplete(currentStep)) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const generateTextReport = () => {
    const report = `
TRANSITION & PURPOSE INTAKE ASSESSMENT
For Retiring or Recently Retired NBA Players
Powered by Legends of Basketball

Name: ${formData.name}
Date: ${formData.date}

=====================================

1. EMOTIONAL STATE DURING TRANSITION:
${formData.emotionalState.length > 0 ? formData.emotionalState.map(state => `• ${state}`).join('\n') : 'Not specified'}

2. MOST FULFILLING PARTS OF BASKETBALL CAREER:
${formData.fulfillment || 'Not specified'}

3. ACTIVITIES/INTERESTS THAT ENERGIZE YOU:
${formData.activities.filter(a => a.trim()).length > 0 ? formData.activities.filter(a => a.trim()).map((activity, i) => `${i + 1}. ${activity}`).join('\n') : 'Not specified'}

4. HOPES FOR LIFE AFTER BASKETBALL:
${formData.accomplishments || 'Not specified'}

5. AREAS OF INTEREST TO EXPLORE:
${formData.interests.length > 0 ? formData.interests.map(interest => `• ${interest}`).join('\n') : 'Not specified'}

6. HOW YOU DEFINE PURPOSE:
${formData.purpose || 'Not specified'}

7. SUPPORT SYSTEM:
${formData.support.length > 0 ? formData.support.map(support => `• ${support}`).join('\n') : 'Not specified'}

8. CLARITY ABOUT NEXT STEPS:
${formData.clarity}/10

9. WHAT YOU NEED FROM SUPPORT TEAM:
${formData.supportNeeds || 'Not specified'}

=====================================

Assessment completed on: ${new Date().toLocaleDateString()}
Generated by NextChapter Transition Assessment
Powered by Legends of Basketball
    `.trim();

    return report;
  };

  const downloadReport = () => {
    try {
      const report = generateTextReport();
      const blob = new Blob([report], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${formData.name.replace(/\s+/g, '_')}_Transition_Assessment.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: copy to clipboard
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    const report = generateTextReport();
    navigator.clipboard.writeText(report).then(() => {
      alert('Assessment report copied to clipboard!');
    }).catch(() => {
      // Final fallback: show in new window
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`<pre style="font-family: monospace; padding: 20px; white-space: pre-wrap;">${report}</pre>`);
        newWindow.document.title = `${formData.name} - Transition Assessment`;
      }
    });
  };

  const renderSummaryStep = () => {
    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Assessment Complete!</h3>
          <p className="text-white/80">
            Review your responses below and download your personalized report.
          </p>
        </div>

        <div className="space-y-6 max-h-96 overflow-y-auto bg-white/5 rounded-xl p-6">
          <div className="grid gap-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-2">Basic Information</h4>
                <p className="text-white/80 text-sm">Name: {formData.name}</p>
                <p className="text-white/80 text-sm">Date: {formData.date}</p>
              </div>
              <button
                onClick={() => goToStep(0)}
                className="text-orange-400 hover:text-orange-300 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-2">Emotional State</h4>
                <p className="text-white/80 text-sm">
                  {formData.emotionalState.length > 0 ? formData.emotionalState.join(', ') : 'Not specified'}
                </p>
              </div>
              <button
                onClick={() => goToStep(1)}
                className="text-orange-400 hover:text-orange-300 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-2">Career Fulfillment</h4>
                <p className="text-white/80 text-sm line-clamp-3">
                  {formData.fulfillment || 'Not specified'}
                </p>
              </div>
              <button
                onClick={() => goToStep(2)}
                className="text-orange-400 hover:text-orange-300 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-2">Personal Interests</h4>
                <p className="text-white/80 text-sm">
                  {formData.activities.filter(a => a.trim()).join(', ') || 'Not specified'}
                </p>
              </div>
              <button
                onClick={() => goToStep(3)}
                className="text-orange-400 hover:text-orange-300 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-2">Areas of Interest</h4>
                <p className="text-white/80 text-sm">
                  {formData.interests.length > 0 ? formData.interests.join(', ') : 'Not specified'}
                </p>
              </div>
              <button
                onClick={() => goToStep(5)}
                className="text-orange-400 hover:text-orange-300 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-2">Support System</h4>
                <p className="text-white/80 text-sm">
                  {formData.support.length > 0 ? formData.support.join(', ') : 'Not specified'}
                </p>
              </div>
              <button
                onClick={() => goToStep(7)}
                className="text-orange-400 hover:text-orange-300 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-2">Clarity Level</h4>
                <p className="text-white/80 text-sm">{formData.clarity}/10</p>
              </div>
              <button
                onClick={() => goToStep(8)}
                className="text-orange-400 hover:text-orange-300 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyToClipboard}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            <Copy className="w-5 h-5" />
            Copy Report
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadReport}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-green-600 hover:to-green-700 transition-all"
          >
            <Download className="w-5 h-5" />
            Download Report
          </motion.button>
        </div>
      </div>
    );
  };

  const renderStep = () => {
    if (currentStep === 9) {
      return renderSummaryStep();
    }

    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-white/90 text-sm font-medium mb-3">
                Your Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <p className="text-white/90 mb-4">
              How would you describe your emotional state as you transition away from professional basketball?
            </p>
            <div className="grid grid-cols-2 gap-3">
              {emotionalOptions.map((option) => (
                <motion.label
                  key={option}
                  whileHover={{ scale: 1.02 }}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
                    ${formData.emotionalState.includes(option) 
                      ? 'bg-orange-500/20 border border-orange-400' 
                      : 'bg-white/5 border border-white/20 hover:bg-white/10'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={formData.emotionalState.includes(option)}
                    onChange={(e) => handleArrayChange('emotionalState', option, e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`
                    w-5 h-5 rounded border-2 flex items-center justify-center
                    ${formData.emotionalState.includes(option) 
                      ? 'bg-orange-500 border-orange-500' 
                      : 'border-white/40'
                    }
                  `}>
                    {formData.emotionalState.includes(option) && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-white text-sm">{option}</span>
                </motion.label>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <p className="text-white/90 mb-4">
              What parts of your basketball career brought you the most fulfillment? Why?
            </p>
            <textarea
              value={formData.fulfillment}
              onChange={(e) => setFormData(prev => ({ ...prev, fulfillment: e.target.value }))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all h-32 resize-none"
              placeholder="Share what brought you the most joy and satisfaction in your basketball career..."
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <p className="text-white/90 mb-4">
              What are three activities or interests outside of basketball that energize or inspire you?
            </p>
            {formData.activities.map((activity, index) => (
              <div key={index}>
                <label className="block text-white/70 text-sm mb-2">
                  Activity {index + 1}
                </label>
                <input
                  type="text"
                  value={activity}
                  onChange={(e) => handleActivityChange(index, e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                  placeholder={`Enter activity ${index + 1}...`}
                />
              </div>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <p className="text-white/90 mb-4">
              When you think about your life after basketball, what are some things you hope to accomplish?
            </p>
            <textarea
              value={formData.accomplishments}
              onChange={(e) => setFormData(prev => ({ ...prev, accomplishments: e.target.value }))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all h-32 resize-none"
              placeholder="Professional goals, personal aspirations, community impact, legacy..."
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <p className="text-white/90 mb-4">
              Which areas are you most curious about exploring? (Select up to 3)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {interestOptions.map((option) => (
                <motion.label
                  key={option}
                  whileHover={{ scale: 1.02 }}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
                    ${formData.interests.includes(option) 
                      ? 'bg-orange-500/20 border border-orange-400' 
                      : formData.interests.length >= 3 
                        ? 'bg-white/5 border border-white/10 opacity-50 cursor-not-allowed'
                        : 'bg-white/5 border border-white/20 hover:bg-white/10'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={formData.interests.includes(option)}
                    onChange={(e) => handleArrayChange('interests', option, e.target.checked)}
                    disabled={!formData.interests.includes(option) && formData.interests.length >= 3}
                    className="sr-only"
                  />
                  <div className={`
                    w-5 h-5 rounded border-2 flex items-center justify-center
                    ${formData.interests.includes(option) 
                      ? 'bg-orange-500 border-orange-500' 
                      : 'border-white/40'
                    }
                  `}>
                    {formData.interests.includes(option) && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-white text-sm">{option}</span>
                </motion.label>
              ))}
            </div>
            <p className="text-orange-400 text-sm">
              Selected: {formData.interests.length}/3
            </p>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <p className="text-white/90 mb-4">
              How would you define "purpose" for yourself now?
            </p>
            <textarea
              value={formData.purpose}
              onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all h-32 resize-none"
              placeholder="What gives your life meaning and direction now?"
            />
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <p className="text-white/90 mb-4">
              Who do you feel supported by right now in your transition?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {supportOptions.map((option) => (
                <motion.label
                  key={option}
                  whileHover={{ scale: 1.02 }}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
                    ${formData.support.includes(option) 
                      ? 'bg-orange-500/20 border border-orange-400' 
                      : 'bg-white/5 border border-white/20 hover:bg-white/10'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={formData.support.includes(option)}
                    onChange={(e) => handleArrayChange('support', option, e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`
                    w-5 h-5 rounded border-2 flex items-center justify-center
                    ${formData.support.includes(option) 
                      ? 'bg-orange-500 border-orange-500' 
                      : 'border-white/40'
                    }
                  `}>
                    {formData.support.includes(option) && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-white text-sm">{option}</span>
                </motion.label>
              ))}
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div>
              <p className="text-white/90 mb-4">
                On a scale of 1 to 10, how clear are you about what you want to do next?
              </p>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-white/70 text-sm">No idea</span>
                <div className="flex-1 flex gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <motion.button
                      key={num}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setFormData(prev => ({ ...prev, clarity: num }))}
                      className={`
                        w-8 h-8 rounded-full border-2 text-sm font-bold transition-all
                        ${formData.clarity === num 
                          ? 'bg-orange-500 border-orange-500 text-white' 
                          : 'border-white/40 text-white/70 hover:border-orange-400'
                        }
                      `}
                    >
                      {num}
                    </motion.button>
                  ))}
                </div>
                <span className="text-white/70 text-sm">Very clear</span>
              </div>
              <div className="text-center">
                <span className="text-orange-400 font-bold text-lg">
                  Selected: {formData.clarity}/10
                </span>
              </div>
            </div>

            <div>
              <p className="text-white/90 mb-4">
                What would you like most from a transition coach or support team right now?
              </p>
              <textarea
                value={formData.supportNeeds}
                onChange={(e) => setFormData(prev => ({ ...prev, supportNeeds: e.target.value }))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all h-32 resize-none"
                placeholder="What kind of support, guidance, or resources would be most helpful?"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const stepTitles = [
    'Basic Information',
    'Emotional State',
    'Career Fulfillment',
    'Personal Interests',
    'Future Goals',
    'Areas of Interest',
    'Purpose Definition',
    'Support System',
    'Clarity & Support Needs',
    'Assessment Summary'
  ];

  const allStepsComplete = completedSteps.size >= totalSteps - 1;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Test Hotkey Indicator */}
        <div className="fixed top-4 right-4 bg-black/50 text-white/70 px-3 py-1 rounded text-xs">
          Press Cmd+Shift+T to test
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Basketball className="w-6 h-6 text-orange-400" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Transition & Purpose Assessment
            </h1>
          </div>
          <p className="text-white/80 mb-2">
            For Retiring or Recently Retired NBA Players
          </p>
          <a
            href="https://legendsofbasketball.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white/80 text-sm transition-colors"
          >
            <span>Powered by Legends of Basketball</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Progress</h2>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-orange-400" />
              <span className="text-white/80">
                <span className="text-xl font-bold text-orange-400">{completedSteps.size}</span>
                <span className="text-sm"> / {totalSteps} Complete</span>
              </span>
            </div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3 mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full"
            />
          </div>
          <p className="text-white/70 text-sm">{Math.round(progress)}% Complete</p>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
        >
          {/* Step Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                {currentStep + 1}
              </div>
              <h3 className="text-xl font-semibold text-white">
                {stepTitles[currentStep]}
              </h3>
              {(isStepComplete(currentStep) || currentStep === 9) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-400"
                >
                  <CheckCircle className="w-6 h-6" />
                </motion.div>
              )}
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/20">
            <button
              onClick={() => navigate('/welcome')}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>

            <div className="flex items-center gap-4">
              {currentStep > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevStep}
                  className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all"
                >
                  Previous
                </motion.button>
              )}

              {currentStep < totalSteps - 1 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextStep}
                  disabled={!isStepComplete(currentStep)}
                  className={`
                    px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all
                    ${isStepComplete(currentStep)
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                      : 'bg-white/10 text-white/50 cursor-not-allowed'
                    }
                  `}
                >
                  {currentStep === totalSteps - 2 ? 'Review Summary' : 'Continue'}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};