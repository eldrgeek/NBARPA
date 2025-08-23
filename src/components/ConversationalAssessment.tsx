import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Loader, Bot, User, Download, Copy, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { researchPlayer, cachePlayerResearch, getCachedPlayerResearch, PlayerResearchData } from '../services/playerResearch';

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ResponseOption {
  id: string;
  text: string;
  value: string;
}

export const ConversationalAssessment: React.FC = () => {
  const navigate = useNavigate();

  // Ensure page starts at top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);
  const [playerName, setPlayerName] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [playerData, setPlayerData] = useState<PlayerResearchData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState<'name' | 'research' | 'confirmation' | 'format_choice' | 'conversation'>('name');
  const [conversationStep, setConversationStep] = useState<string>('emotional_state');
  const [assessmentData, setAssessmentData] = useState<Record<string, any>>({});
  const [showOptions, setShowOptions] = useState(false);
  const [currentOptions, setCurrentOptions] = useState<ResponseOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showYesNoButtons, setShowYesNoButtons] = useState(false);
  const [showFormatChoice, setShowFormatChoice] = useState(false);
  const [waitingForAddition, setWaitingForAddition] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showOptions, showYesNoButtons, showFormatChoice]);

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setStep('research');
    setIsResearching(true);

    try {
      // Check cache first
      let research = await getCachedPlayerResearch(playerName);
      
      if (!research) {
        // Research the player
        research = await researchPlayer(playerName);
        if (research) {
          await cachePlayerResearch(research);
        }
      }

      setPlayerData(research);

      if (research) {
        // Show confirmation message
        const confirmationMessage = generateConfirmationMessage(research);
        setMessages([{
          id: '1',
          type: 'ai',
          content: confirmationMessage,
          timestamp: new Date()
        }]);
        setStep('confirmation');
        setShowYesNoButtons(true);
      } else {
        // Generic introduction for unknown players
        setMessages([{
          id: '1',
          type: 'ai',
          content: `Hi ${playerName}! I'm here to help you with your transition assessment. Are you ready to begin?`,
          timestamp: new Date()
        }]);
        setStep('confirmation');
        setShowYesNoButtons(true);
      }
    } catch (error) {
      console.error('Research failed:', error);
      setMessages([{
        id: '1',
        type: 'ai',
        content: `Hi ${playerName}! I'm here to help you with your transition assessment. Are you ready to begin?`,
        timestamp: new Date()
      }]);
      setStep('confirmation');
      setShowYesNoButtons(true);
    } finally {
      setIsResearching(false);
    }
  };

  const generateConfirmationMessage = (playerData: PlayerResearchData): string => {
    const description = buildPlayerDescription(playerData);
    return `Are you the ${playerData.name} who ${description}?`;
  };

  const buildPlayerDescription = (playerData: PlayerResearchData): string => {
    const parts = [];
    
    if (playerData.position) {
      parts.push(`played ${playerData.position.toLowerCase()}`);
    }
    
    if (playerData.teams && playerData.teams.length > 0) {
      if (playerData.teams.length === 1) {
        parts.push(`for the ${playerData.teams[0]}`);
      } else if (playerData.teams.length <= 3) {
        parts.push(`for teams like the ${playerData.teams.slice(0, 2).join(' and ')}`);
      } else {
        parts.push(`for teams including the ${playerData.teams[0]} and ${playerData.teams[1]}`);
      }
    }
    
    if (playerData.yearsActive) {
      parts.push(`from ${playerData.yearsActive}`);
    }
    
    if (playerData.achievements && playerData.achievements.length > 0) {
      parts.push(`and ${playerData.achievements[0].toLowerCase()}`);
    }
    
    return parts.join(' ');
  };

  const handleYesNoResponse = async (response: 'yes' | 'no') => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: response === 'yes' ? 'Yes' : 'No',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setShowYesNoButtons(false);
    setIsTyping(true);

    if (response === 'yes') {
      if (waitingForAddition) {
        // User wants to add more to their previous response
        setTimeout(() => {
          const aiMessage: Message = {
            id: Date.now().toString(),
            type: 'ai',
            content: "OK, tell me",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiMessage]);
          setIsTyping(false);
          setWaitingForAddition(false);
        }, 1500);
      } else {
        // Start the greeting sequence with longer delays
        setTimeout(() => {
          const playerFirstName = playerData?.name.split(' ')[0] || playerName.split(' ')[0];
          const greetingMessage = `Glad to meet you, ${playerFirstName}! I've never seen you play in person—other than on YouTube—but I know a lot about you. I'm an AI trained by Antonio and some of the other members of the association, but you might say I'm a fan of sorts.`;
          
          const aiMessage: Message = {
            id: Date.now().toString(),
            type: 'ai',
            content: greetingMessage,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiMessage]);
          
          // Add the transition message after a longer delay (4 seconds to read)
          setTimeout(() => {
            const transitionMessage: Message = {
              id: (Date.now() + 1).toString(),
              type: 'ai',
              content: "I've got a set of questions I'd like to ask, so we (the transition team and I) can tailor programs to your needs.\n\nWould you like to do this in chat, in conversation with AI-me, or would you rather go to a \"fill-out-the-form\"?",
              timestamp: new Date()
            };
            setMessages(prev => [...prev, transitionMessage]);
            
            // Show format choice buttons after another delay (3 seconds)
            setTimeout(() => {
              setIsTyping(false);
              setStep('format_choice');
              setShowFormatChoice(true);
            }, 3000);
          }, 4000);
        }, 2000);
      }
    } else {
      if (waitingForAddition) {
        // User doesn't want to add more, continue to next question
        setWaitingForAddition(false);
        setTimeout(() => {
          handleNext();
        }, 1500);
      } else {
        setTimeout(() => {
          const aiMessage: Message = {
            id: Date.now().toString(),
            type: 'ai',
            content: "No worries! Could you help me understand who you are? I want to make sure I can provide the most relevant guidance for your situation.",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiMessage]);
          setIsTyping(false);
        }, 2000);
      }
    }
  };

  const handleFormatChoice = async (choice: 'conversation' | 'form') => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: choice === 'conversation' ? 'Carry on a conversation' : 'Fill out the form',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setShowFormatChoice(false);

    if (choice === 'form') {
      // Navigate to traditional form
      navigate('/assessment');
      return;
    }

    // Continue with conversation
    setIsTyping(true);
    setTimeout(() => {
      startFirstQuestion();
    }, 2000);
  };

  const startFirstQuestion = () => {
    // Go directly to the first assessment question
    const questionMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: "Emotional State\n\nHow would you describe your emotional state as you transition away from professional basketball?",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, questionMessage]);
    setConversationStep('emotional_state');
    setIsTyping(false);
    setStep('conversation');
    
    // Show options after a longer delay (3 seconds to read the question)
    setTimeout(() => {
      const options = getEmotionalStateOptions();
      setCurrentOptions(options);
      setSelectedOptions([]);
      setShowOptions(true);
    }, 3000);
  };

  const handleMessageSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || isTyping) return;

    // Check for traditional format request
    if (currentMessage.toLowerCase().includes('traditional')) {
      navigate('/assessment');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setShowOptions(false);
    setSelectedOptions([]);

    if (waitingForAddition) {
      // User provided additional information, now continue to next question
      setWaitingForAddition(false);
      setTimeout(() => {
        handleNext();
      }, 1500);
    } else {
      // Save the response
      saveCurrentResponse(userMessage.content);
      
      // Show acknowledgment message after a longer delay
      setTimeout(() => {
        const acknowledgmentMessage: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: "Would you like to add anything else to that response?",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, acknowledgmentMessage]);
        
        // Show yes/no buttons for adding more
        setWaitingForAddition(true);
        setShowYesNoButtons(true);
      }, 1200);
    }
  };

  const handleOptionSelect = (option: ResponseOption) => {
    // Add the selected option to the input field
    const currentText = currentMessage.trim();
    const newText = currentText 
      ? `${currentText}, ${option.value}` 
      : option.value;
    
    setCurrentMessage(newText);
    setSelectedOptions(prev => [...prev, option.id]);
  };

  const handleOptionDismiss = (optionId: string) => {
    // Just mark it as dismissed
    setSelectedOptions(prev => [...prev, optionId]);
  };

  const handleNext = async () => {
    setIsTyping(true);

    // 3 second delay before showing question (longer for reading)
    setTimeout(async () => {
      const nextQuestion = getNextQuestion();
      if (nextQuestion) {
        const aiMessage: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: nextQuestion.content,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        
        // 3 second delay before showing options (longer for reading)
        setTimeout(() => {
          setIsTyping(false);
          if (nextQuestion.options && nextQuestion.options.length > 0) {
            setCurrentOptions(nextQuestion.options);
            setSelectedOptions([]);
            setShowOptions(true);
          }
        }, 3000);
      } else {
        setIsTyping(false);
      }
    }, 3000);
  };

  const saveCurrentResponse = (response: string) => {
    switch (conversationStep) {
      case 'emotional_state':
        setAssessmentData(prev => ({ ...prev, emotionalState: response }));
        break;
      case 'career_fulfillment':
        setAssessmentData(prev => ({ ...prev, careerFulfillment: response }));
        break;
      case 'interests':
        setAssessmentData(prev => ({ ...prev, interests: response }));
        break;
      case 'future_goals':
        setAssessmentData(prev => ({ ...prev, futureGoals: response }));
        break;
      case 'areas_of_interest':
        setAssessmentData(prev => ({ ...prev, areasOfInterest: response }));
        break;
      case 'purpose':
        setAssessmentData(prev => ({ ...prev, purpose: response }));
        break;
      case 'support':
        setAssessmentData(prev => ({ ...prev, support: response }));
        break;
    }
  };

  const getNextQuestion = (): { content: string; options?: ResponseOption[] } | null => {
    switch (conversationStep) {
      case 'emotional_state':
        setConversationStep('career_fulfillment');
        return {
          content: "Career Fulfillment\n\nWhat parts of your basketball career brought you the most fulfillment? Why?",
          options: getCareerFulfillmentOptions()
        };

      case 'career_fulfillment':
        setConversationStep('interests');
        return {
          content: "Personal Interests\n\nWhat are three activities or interests outside of basketball that energize or inspire you?",
          options: getInterestOptions()
        };

      case 'interests':
        setConversationStep('future_goals');
        return {
          content: "Future Goals\n\nWhen you think about your life after basketball, what are some things you hope to accomplish?",
          options: getFutureGoalsOptions()
        };

      case 'future_goals':
        setConversationStep('areas_of_interest');
        return {
          content: "Areas of Interest\n\nWhich areas are you most curious about exploring? (Select up to 3)",
          options: getAreasOfInterestOptions()
        };

      case 'areas_of_interest':
        setConversationStep('purpose');
        return {
          content: "Purpose Definition\n\nHow would you define 'purpose' for yourself now?",
          options: getPurposeOptions()
        };

      case 'purpose':
        setConversationStep('support');
        return {
          content: "Support System\n\nWho do you feel supported by right now in your transition?",
          options: getSupportOptions()
        };

      case 'support':
        setConversationStep('completion');
        return {
          content: "Thank you for completing the assessment! Your responses have been recorded. Would you like to download a summary of your assessment?",
          options: []
        };

      default:
        return null;
    }
  };

  const getEmotionalStateOptions = (): ResponseOption[] => {
    return [
      { id: 'excited', text: 'Excited', value: 'I\'m feeling excited about what\'s next' },
      { id: 'anxious', text: 'Anxious', value: 'I\'m feeling anxious about the uncertainty' },
      { id: 'relieved', text: 'Relieved', value: 'I\'m feeling relieved that my playing career is over' },
      { id: 'lost', text: 'Lost', value: 'I\'m feeling lost and uncertain about my direction' },
      { id: 'hopeful', text: 'Hopeful', value: 'I\'m feeling hopeful about new opportunities' },
      { id: 'overwhelmed', text: 'Overwhelmed', value: 'I\'m feeling overwhelmed by all the possibilities' },
      { id: 'motivated', text: 'Motivated', value: 'I\'m feeling motivated to start this new chapter' }
    ];
  };

  const getCareerFulfillmentOptions = (): ResponseOption[] => {
    return [
      { id: 'winning', text: 'Winning championships and competing', value: 'Winning championships and competing at the highest level brought me the most fulfillment' },
      { id: 'teammates', text: 'Team camaraderie and relationships', value: 'The camaraderie and relationships with teammates were most fulfilling' },
      { id: 'fans', text: 'Connecting with fans and inspiring others', value: 'Connecting with fans and inspiring others was most meaningful to me' },
      { id: 'improvement', text: 'Personal growth and skill development', value: 'Constantly improving my skills and pushing my limits was most fulfilling' },
      { id: 'mentoring', text: 'Mentoring younger players', value: 'Mentoring younger players and sharing knowledge was most rewarding' }
    ];
  };

  const getInterestOptions = (): ResponseOption[] => {
    return [
      { id: 'business', text: 'Business and entrepreneurship', value: 'I\'m interested in business and entrepreneurship opportunities' },
      { id: 'coaching', text: 'Coaching and mentoring', value: 'I\'m drawn to coaching and mentoring the next generation' },
      { id: 'media', text: 'Media and entertainment', value: 'I\'m interested in media and entertainment opportunities' },
      { id: 'community', text: 'Community work and philanthropy', value: 'I want to focus on community work and giving back' },
      { id: 'fitness', text: 'Health and fitness', value: 'I\'m passionate about health and fitness initiatives' },
      { id: 'family', text: 'Spending time with family', value: 'I want to focus on spending quality time with my family' }
    ];
  };

  const getFutureGoalsOptions = (): ResponseOption[] => {
    return [
      { id: 'business_success', text: 'Build a successful business empire', value: 'I hope to build a successful business empire and create wealth' },
      { id: 'help_others', text: 'Help other athletes transition successfully', value: 'I want to help other athletes transition successfully from sports' },
      { id: 'community_impact', text: 'Make a positive impact in my community', value: 'I hope to make a lasting positive impact in my community' },
      { id: 'family_legacy', text: 'Create a lasting legacy for my family', value: 'I want to create a lasting legacy and secure my family\'s future' },
      { id: 'stay_involved', text: 'Stay involved in basketball', value: 'I hope to stay involved in basketball in some meaningful capacity' }
    ];
  };

  const getAreasOfInterestOptions = (): ResponseOption[] => {
    return [
      { id: 'business_entrepreneurship', text: 'Business/Entrepreneurship', value: 'I\'m interested in exploring business and entrepreneurship opportunities' },
      { id: 'coaching_mentoring', text: 'Coaching/Mentoring', value: 'I want to explore coaching and mentoring opportunities' },
      { id: 'media_entertainment', text: 'Media/Entertainment', value: 'I\'m curious about media and entertainment industry opportunities' },
      { id: 'philanthropy', text: 'Philanthropy/Community Work', value: 'I want to focus on philanthropy and community work' },
      { id: 'real_estate', text: 'Real Estate/Investment', value: 'I\'m interested in real estate and investment opportunities' },
      { id: 'health_wellness', text: 'Health & Wellness', value: 'I want to explore health and wellness industry opportunities' },
      { id: 'education', text: 'Education/Personal Development', value: 'I\'m interested in education and personal development fields' }
    ];
  };

  const getPurposeOptions = (): ResponseOption[] => {
    return [
      { id: 'inspire', text: 'Inspiring and motivating others', value: 'My purpose is to inspire and motivate others to achieve their best' },
      { id: 'give_back', text: 'Giving back to the community', value: 'My purpose is to give back to the community that supported me' },
      { id: 'family_first', text: 'Being present for my family', value: 'My purpose is to be present and available for my family and loved ones' },
      { id: 'create_opportunities', text: 'Creating opportunities for others', value: 'My purpose is to create opportunities and open doors for others' },
      { id: 'personal_growth', text: 'Continuous learning and growth', value: 'My purpose is to continue growing and learning throughout my life' }
    ];
  };

  const getSupportOptions = (): ResponseOption[] => {
    return [
      { id: 'family', text: 'Family', value: 'I feel most supported by my family members' },
      { id: 'former_teammates', text: 'Former teammates', value: 'I feel supported by my former teammates and basketball friends' },
      { id: 'coaches', text: 'Coaches/mentors', value: 'I feel supported by coaches and mentors from my career' },
      { id: 'advisors', text: 'Business advisors', value: 'I feel supported by my business advisors and professional team' },
      { id: 'friends', text: 'Friends outside basketball', value: 'I feel supported by friends I have outside of basketball' },
      { id: 'unsure', text: 'No one / not sure', value: 'I\'m not sure who supports me or I don\'t feel supported right now' }
    ];
  };

  const generateReport = () => {
    const playerInfo = playerData ? `Player: ${playerData.name}` : `Player: ${playerName}`;
    
    let report = `CONVERSATIONAL TRANSITION ASSESSMENT\n`;
    report += `Powered by Legends of Basketball\n\n`;
    report += `${playerInfo}\n`;
    report += `Date: ${new Date().toLocaleDateString()}\n\n`;
    report += `CONVERSATION SUMMARY:\n`;
    report += `=====================================\n\n`;
    
    messages.forEach((message) => {
      const speaker = message.type === 'user' ? (playerData?.name || playerName) : 'AI Coach';
      report += `${speaker}: ${message.content}\n\n`;
    });
    
    report += `\nASSESSMENT DATA:\n`;
    report += `=====================================\n`;
    Object.entries(assessmentData).forEach(([key, value]) => {
      report += `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}\n\n`;
    });
    
    return report;
  };

  const downloadReport = () => {
    const report = generateReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${playerName.replace(/\s+/g, '_')}_Conversational_Assessment.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyReport = () => {
    const report = generateReport();
    navigator.clipboard.writeText(report).then(() => {
      alert('Assessment report copied to clipboard!');
    });
  };

  if (step === 'name') {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20"
        >
          <div className="text-center mb-8">
            <Bot className="w-16 h-16 text-orange-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">AI Transition Coach</h1>
            <p className="text-white/80 text-sm">Let's have a conversation about your next chapter</p>
          </div>

          <form onSubmit={handleNameSubmit} className="space-y-6">
            <div>
              <label className="block text-white/90 text-sm font-medium mb-3">
                What's your name?
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                placeholder="Enter your full name"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
            >
              Continue
            </motion.button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/20">
            <button
              onClick={() => navigate('/welcome')}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (step === 'research') {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20 text-center"
        >
          <Loader className="w-12 h-12 text-orange-400 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold text-white mb-2">Getting to know you...</h2>
          <p className="text-white/80 text-sm">
            I'm reading up on you so I can be as helpful as possible
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-lg rounded-t-2xl border border-white/20 border-b-0"
        >
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-orange-400" />
            <div>
              <h1 className="text-lg font-semibold text-white">AI Transition Coach</h1>
              <p className="text-white/60 text-sm">Conversational Assessment</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {messages.length > 2 && (
              <>
                <button
                  onClick={copyReport}
                  className="p-2 text-white/70 hover:text-white transition-colors"
                  title="Copy Report"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={downloadReport}
                  className="p-2 text-white/70 hover:text-white transition-colors"
                  title="Download Report"
                >
                  <Download className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={() => navigate('/welcome')}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </motion.div>

        {/* Messages */}
        <div className="flex-1 bg-white/5 backdrop-blur-lg border-x border-white/20 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className={`
                  max-w-[80%] p-4 rounded-2xl
                  ${message.type === 'user' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white/10 text-white border border-white/20'
                  }
                `}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-orange-100' : 'text-white/50'}`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>

                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-start"
            >
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white/10 border border-white/20 p-4 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Yes/No Buttons for confirmation and "would you like to add anything else" */}
          {showYesNoButtons && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-start"
            >
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleYesNoResponse('yes')}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
                >
                  Yes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleYesNoResponse('no')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all"
                >
                  No
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Format Choice Buttons */}
          {showFormatChoice && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-start"
            >
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleFormatChoice('conversation')}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
                >
                  Carry on a conversation
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleFormatChoice('form')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all"
                >
                  Fill out the form
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Multiple Choice Options with Checkbox and X */}
          {showOptions && currentOptions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-start"
            >
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="max-w-[80%] space-y-2">
                <p className="text-white/80 text-sm mb-3">Choose options to add to your response:</p>
                <AnimatePresence>
                  {currentOptions
                    .filter(option => !selectedOptions.includes(option.id))
                    .map((option) => (
                      <motion.div
                        key={option.id}
                        initial={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2 p-3 bg-white/10 border border-white/20 rounded-xl"
                      >
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleOptionSelect(option)}
                          className="w-6 h-6 rounded border-2 border-orange-400 bg-orange-500/20 hover:bg-orange-500/40 flex items-center justify-center transition-all"
                          title="Add to response"
                        >
                          <Check className="w-3 h-3 text-orange-400" />
                        </motion.button>
                        
                        <span className="flex-1 text-white text-sm">{option.text}</span>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleOptionDismiss(option.id)}
                          className="w-6 h-6 rounded border-2 border-purple-400 bg-purple-500/20 hover:bg-purple-500/40 flex items-center justify-center transition-all"
                          title="Dismiss option"
                        >
                          <X className="w-3 h-3 text-purple-400" />
                        </motion.button>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleMessageSend} className="p-4 bg-white/10 backdrop-blur-lg rounded-b-2xl border border-white/20 border-t-0">
          <div className="flex gap-3">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
              placeholder="Type your response, modify the selected options, or say 'traditional' to switch formats..."
              disabled={isTyping || showYesNoButtons || showFormatChoice}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!currentMessage.trim() || isTyping || showYesNoButtons || showFormatChoice}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};