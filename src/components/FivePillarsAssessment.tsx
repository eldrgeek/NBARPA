import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, Copy, Heart, Activity, DollarSign, Users, Home, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PDFReportButton } from './AssessmentPDFReport';
import AssessmentPDF from './AssessmentPDFReport';
import { BlobProvider } from '@react-pdf/renderer';

interface AssessmentData {
  name: string;
  // Transition Questions (from legacy assessment)
  q0_emotional_state: string[];
  q0_career_fulfillment: string;
  q0_personal_interests: string[];
  q0_future_goals: string;
  q0_areas_of_interest: string[];
  q0_purpose_definition: string;
  q0_support_system: string[];
  q0_clarity: number;
  q0_support_needs: string;
  // Camaraderie
  q1_connection: number;
  q2_player_connection: string;
  q3_reach_out_frequency: string;
  q4_connection_barriers: string[];
  q4_connection_barriers_other: string;
  q5_brotherhood_moment: string;
  // Health
  q6_physical_health: number;
  q7_health_attention: string[];
  q8_health_motivation: string[];
  q8_health_motivation_other: string;
  q9_health_routine: string;
  q10_healthy_habit: string;
  // Finance
  q11_financial_confidence: number;
  q12_financial_area: string[];
  q13_has_advisor: string;
  q13_advisor_satisfaction: number;
  q14_review_frequency: string;
  q15_financial_milestone: string;
  // Community
  q16_community_involvement: number;
  q17_community_impact: string[];
  q17_community_impact_other: string;
  q18_community_frequency: string[];
  q19_community_barriers: string[];
  q19_community_barriers_other: string;
  q20_positive_change: string;
  // Family
  q21_work_life_balance: number;
  q22_biggest_supporter: string;
  q22_biggest_supporter_other: string;
  q23_family_challenge: string[];
  q23_family_challenge_other: string;
  q24_family_activities: string;
  q25_family_goal: string;
}

// Component definitions moved outside to prevent re-creation on every render
const ScaleInput = ({ label, value, onChange, questionNumber }: { label: string; value: number; onChange: (val: number) => void; questionNumber: string }) => (
  <div className="space-y-3">
    <label className="block text-white/90 text-sm font-medium">
      {questionNumber}. {label}
    </label>
    <div className="flex items-center gap-4">
      <span className="text-white/60 text-xs whitespace-nowrap">1 (Low)</span>
      <div className="flex-1 flex gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            className={`
              flex-1 h-10 rounded-lg border-2 text-sm font-bold transition-all
              ${value === num 
                ? 'bg-orange-500 border-orange-500 text-white' 
                : 'border-white/40 text-white/70 hover:border-orange-400 hover:bg-white/5'
              }
            `}
          >
            {num}
          </button>
        ))}
      </div>
      <span className="text-white/60 text-xs whitespace-nowrap">10 (High)</span>
    </div>
    <div className="text-center">
      <span className="text-orange-400 font-bold">Selected: {value}/10</span>
    </div>
  </div>
);

const RadioGroup = ({ label, options, value, onChange, questionNumber }: { label: string; options: string[]; value: string; onChange: (val: string) => void; questionNumber: string }) => (
  <div className="space-y-3">
    <label className="block text-white/90 text-sm font-medium">
      {questionNumber}. {label}
    </label>
    <div className="space-y-2">
      {options.map((option) => (
        <label
          key={option}
          className={`
            flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
            ${value === option 
              ? 'bg-orange-500/20 border-2 border-orange-400' 
              : 'bg-white/5 border-2 border-white/20 hover:bg-white/10'
            }
          `}
        >
          <input
            type="radio"
            checked={value === option}
            onChange={() => onChange(option)}
            className="sr-only"
          />
          <div className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center
            ${value === option ? 'border-orange-500' : 'border-white/40'}
          `}>
            {value === option && (
              <div className="w-3 h-3 rounded-full bg-orange-500" />
            )}
          </div>
          <span className="text-white text-sm">{option}</span>
        </label>
      ))}
    </div>
  </div>
);

const CheckboxGroup = ({ label, options, values, onChange, questionNumber }: { label: string; options: string[]; values: string[]; onChange: (option: string, checked: boolean) => void; questionNumber: string }) => (
  <div className="space-y-3">
    <label className="block text-white/90 text-sm font-medium">
      {questionNumber}. {label}
    </label>
    <div className="space-y-2">
      {options.map((option) => (
        <label
          key={option}
          className={`
            flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
            ${values.includes(option)
              ? 'bg-orange-500/20 border-2 border-orange-400' 
              : 'bg-white/5 border-2 border-white/20 hover:bg-white/10'
            }
          `}
        >
          <input
            type="checkbox"
            checked={values.includes(option)}
            onChange={(e) => onChange(option, e.target.checked)}
            className="sr-only"
          />
          <div className={`
            w-5 h-5 rounded border-2 flex items-center justify-center
            ${values.includes(option) ? 'bg-orange-500 border-orange-500' : 'border-white/40'}
          `}>
            {values.includes(option) && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className="text-white text-sm">{option}</span>
        </label>
      ))}
    </div>
    {values.length > 0 && (
      <p className="text-orange-400 text-sm">
        Selected: {values.length}
      </p>
    )}
  </div>
);

const TextAreaInput = ({ label, value, onChange, questionNumber, placeholder }: { label: string; value: string; onChange: (val: string) => void; questionNumber: string; placeholder?: string }) => (
  <div className="space-y-3">
    <label className="block text-white/90 text-sm font-medium">
      {questionNumber}. {label}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all h-24 resize-none"
      placeholder={placeholder || "Share your thoughts..."}
    />
  </div>
);

export const FivePillarsAssessment: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AssessmentData>({
    name: '',
    q0_emotional_state: [],
    q0_career_fulfillment: '',
    q0_personal_interests: ['', '', ''],
    q0_future_goals: '',
    q0_areas_of_interest: [],
    q0_purpose_definition: '',
    q0_support_system: [],
    q0_clarity: 5,
    q0_support_needs: '',
    q1_connection: 5,
    q2_player_connection: '',
    q3_reach_out_frequency: '',
    q4_connection_barriers: [],
    q4_connection_barriers_other: '',
    q5_brotherhood_moment: '',
    q6_physical_health: 5,
    q7_health_attention: [],
    q8_health_motivation: [],
    q8_health_motivation_other: '',
    q9_health_routine: '',
    q10_healthy_habit: '',
    q11_financial_confidence: 5,
    q12_financial_area: [],
    q13_has_advisor: '',
    q13_advisor_satisfaction: 5,
    q14_review_frequency: '',
    q15_financial_milestone: '',
    q16_community_involvement: 5,
    q17_community_impact: [],
    q17_community_impact_other: '',
    q18_community_frequency: [],
    q19_community_barriers: [],
    q19_community_barriers_other: '',
    q20_positive_change: '',
    q21_work_life_balance: 5,
    q22_biggest_supporter: '',
    q22_biggest_supporter_other: '',
    q23_family_challenge: [],
    q23_family_challenge_other: '',
    q24_family_activities: '',
    q25_family_goal: '',
  });

  const [showReport, setShowReport] = useState(false);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const [incompleteFields, setIncompleteFields] = useState<string[]>([]);
  
  // Refs for scrolling to sections
  const nameRef = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<HTMLDivElement>(null);
  const camaraderieRef = useRef<HTMLDivElement>(null);
  const healthRef = useRef<HTMLDivElement>(null);
  const financeRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);
  const familyRef = useRef<HTMLDivElement>(null);

  const handleScaleChange = (field: keyof AssessmentData, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (field: keyof AssessmentData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: keyof AssessmentData, option: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      if (checked) {
        // Limit areas of interest to 3
        if (field === 'q0_areas_of_interest' && currentArray.length >= 3) return prev;
        return { ...prev, [field]: [...currentArray, option] };
      } else {
        return { ...prev, [field]: currentArray.filter(item => item !== option) };
      }
    });
  };

  const handlePersonalInterestChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      q0_personal_interests: prev.q0_personal_interests.map((interest, i) => i === index ? value : interest)
    }));
  };

  const getIncompleteFields = () => {
    const incomplete: string[] = [];
    
    if (formData.name.trim() === '') incomplete.push('Your Name');
    // Transition questions
    if (formData.q0_emotional_state.length === 0) incomplete.push('Q1: Emotional State');
    if (formData.q0_career_fulfillment.trim() === '') incomplete.push('Q2: Career Fulfillment');
    if (formData.q0_personal_interests.every(i => i.trim() === '')) incomplete.push('Q3: Personal Interests');
    if (formData.q0_future_goals.trim() === '') incomplete.push('Q4: Future Goals');
    if (formData.q0_areas_of_interest.length === 0) incomplete.push('Q5: Areas of Interest');
    if (formData.q0_purpose_definition.trim() === '') incomplete.push('Q6: Purpose Definition');
    if (formData.q0_support_system.length === 0) incomplete.push('Q7: Support System');
    if (formData.q0_support_needs.trim() === '') incomplete.push('Q9: Support Needs');
    // Five Pillars questions
    if (formData.q2_player_connection === '') incomplete.push('Q11: Player Connection Type');
    if (formData.q3_reach_out_frequency === '') incomplete.push('Q12: Outreach Frequency');
    if (formData.q4_connection_barriers.length === 0) incomplete.push('Q13: Connection Barriers');
    if (formData.q5_brotherhood_moment.trim() === '') incomplete.push('Q14: Brotherhood Memory');
    if (formData.q7_health_attention.length === 0) incomplete.push('Q16: Health Attention Areas');
    if (formData.q8_health_motivation.length === 0) incomplete.push('Q17: Health Motivation');
    if (formData.q9_health_routine === '') incomplete.push('Q18: Health Routine');
    if (formData.q10_healthy_habit.trim() === '') incomplete.push('Q19: Healthy Habit Goal');
    if (formData.q12_financial_area.length === 0) incomplete.push('Q21: Financial Areas');
    if (formData.q13_has_advisor === '') incomplete.push('Q22: Financial Advisor');
    if (formData.q14_review_frequency === '') incomplete.push('Q23: Financial Review Frequency');
    if (formData.q15_financial_milestone.trim() === '') incomplete.push('Q24: Financial Milestone');
    if (formData.q17_community_impact.length === 0) incomplete.push('Q26: Community Impact Type');
    if (formData.q18_community_frequency.length === 0) incomplete.push('Q27: Community Participation');
    if (formData.q19_community_barriers.length === 0) incomplete.push('Q28: Community Barriers');
    if (formData.q20_positive_change.trim() === '') incomplete.push('Q29: Positive Change Vision');
    if (formData.q22_biggest_supporter === '') incomplete.push('Q31: Biggest Supporter');
    if (formData.q23_family_challenge.length === 0) incomplete.push('Q32: Family Challenges');
    if (formData.q24_family_activities === '') incomplete.push('Q33: Family Activities');
    if (formData.q25_family_goal.trim() === '') incomplete.push('Q34: Family Goal');
    
    return incomplete;
  };

  const isFormComplete = () => {
    return getIncompleteFields().length === 0;
  };

  const scrollToFirstIncomplete = () => {
    if (formData.name.trim() === '') {
      nameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (formData.q0_emotional_state.length === 0 || formData.q0_career_fulfillment.trim() === '' ||
               formData.q0_personal_interests.every(i => i.trim() === '') || formData.q0_future_goals.trim() === '' ||
               formData.q0_areas_of_interest.length === 0 || formData.q0_purpose_definition.trim() === '' ||
               formData.q0_support_system.length === 0 || formData.q0_support_needs.trim() === '') {
      transitionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (formData.q2_player_connection === '' || formData.q3_reach_out_frequency === '' || 
               formData.q4_connection_barriers.length === 0 || formData.q5_brotherhood_moment.trim() === '') {
      camaraderieRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (formData.q7_health_attention.length === 0 || formData.q8_health_motivation.length === 0 || 
               formData.q9_health_routine === '' || formData.q10_healthy_habit.trim() === '') {
      healthRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (formData.q12_financial_area.length === 0 || formData.q13_has_advisor === '' || 
               formData.q14_review_frequency === '' || formData.q15_financial_milestone.trim() === '') {
      financeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (formData.q17_community_impact.length === 0 || formData.q18_community_frequency.length === 0 || 
               formData.q19_community_barriers.length === 0 || formData.q20_positive_change.trim() === '') {
      communityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (formData.q22_biggest_supporter === '' || formData.q23_family_challenge.length === 0 || 
               formData.q24_family_activities === '' || formData.q25_family_goal.trim() === '') {
      familyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const generateReport = () => {
    const report = `
FIVE PILLARS TRANSITION ASSESSMENT
NBA Retired Players Association
RPA Connect Platform

Name: ${formData.name}
Date: ${new Date().toLocaleDateString()}

=====================================
TRANSITION & PURPOSE
=====================================

Emotional State: ${formData.q0_emotional_state.join(', ')}

Career Fulfillment:
${formData.q0_career_fulfillment}

Personal Interests:
${formData.q0_personal_interests.filter(i => i.trim()).join(', ')}

Future Goals:
${formData.q0_future_goals}

Areas of Interest: ${formData.q0_areas_of_interest.join(', ')}

Purpose Definition:
${formData.q0_purpose_definition}

Support System: ${formData.q0_support_system.join(', ')}
Clarity About Next Steps: ${formData.q0_clarity}/10

Support Needs:
${formData.q0_support_needs}

=====================================
1️⃣ CAMARADERIE
=====================================

Connection Level: ${formData.q1_connection}/10
Most Valued Connection Type: ${formData.q2_player_connection}
Outreach Frequency: ${formData.q3_reach_out_frequency}
Connection Barriers: ${formData.q4_connection_barriers.join(', ')}${formData.q4_connection_barriers.includes('Other') ? ` - ${formData.q4_connection_barriers_other}` : ''}

Brotherhood Memory:
${formData.q5_brotherhood_moment}

=====================================
2️⃣ HEALTH
=====================================

Physical Health Rating: ${formData.q6_physical_health}/10
Priority Health Areas: ${formData.q7_health_attention.join(', ')}
Health Motivations: ${formData.q8_health_motivation.join(', ')}${formData.q8_health_motivation.includes('Other') ? ` - ${formData.q8_health_motivation_other}` : ''}
Routine Consistency: ${formData.q9_health_routine}

Healthy Habit Goal:
${formData.q10_healthy_habit}

=====================================
3️⃣ FINANCE
=====================================

Financial Confidence: ${formData.q11_financial_confidence}/10
Priority Financial Areas: ${formData.q12_financial_area.join(', ')}
Has Financial Advisor: ${formData.q13_has_advisor}${formData.q13_has_advisor === 'Yes' ? ` (Satisfaction: ${formData.q13_advisor_satisfaction}/10)` : ''}
Review Frequency: ${formData.q14_review_frequency}

Financial Milestone:
${formData.q15_financial_milestone}

=====================================
4️⃣ COMMUNITY
=====================================

Community Involvement: ${formData.q16_community_involvement}/10
Priority Impact Areas: ${formData.q17_community_impact.join(', ')}${formData.q17_community_impact.includes('Other') ? ` - ${formData.q17_community_impact_other}` : ''}
Participation Frequency: ${formData.q18_community_frequency.join(', ')}
Participation Barriers: ${formData.q19_community_barriers.join(', ')}${formData.q19_community_barriers.includes('Other') ? ` - ${formData.q19_community_barriers_other}` : ''}

Positive Change Vision:
${formData.q20_positive_change}

=====================================
5️⃣ FAMILY
=====================================

Work-Life Balance: ${formData.q21_work_life_balance}/10
Biggest Supporter: ${formData.q22_biggest_supporter}${formData.q22_biggest_supporter === 'Other' ? ` - ${formData.q22_biggest_supporter_other}` : ''}
Most Difficult Challenges: ${formData.q23_family_challenge.join(', ')}${formData.q23_family_challenge.includes('Other') ? ` - ${formData.q23_family_challenge_other}` : ''}
Shared Activities: ${formData.q24_family_activities}

Family Goal:
${formData.q25_family_goal}

=====================================

Assessment completed on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
Generated by RPA Connect - Five Pillars Assessment
Powered by NBA Retired Players Association
    `.trim();

    return report;
  };

  const downloadReport = () => {
    const report = generateReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formData.name.replace(/\s+/g, '_')}_Five_Pillars_Assessment.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    const report = generateReport();
    navigator.clipboard.writeText(report).then(() => {
      alert('Assessment report copied to clipboard!');
    });
  };

  const handleSubmit = () => {
    if (isFormComplete()) {
      setShowReport(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const incomplete = getIncompleteFields();
      setIncompleteFields(incomplete);
      setShowIncompleteModal(true);
      scrollToFirstIncomplete();
    }
  };

  const handleSubmitAnyway = () => {
    setShowIncompleteModal(false);
    setShowReport(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showReport) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Assessment Complete!</h2>
              <p className="text-white/80">Thank you for completing the Five Pillars Assessment</p>
            </div>

            {/* PDF Preview */}
            <div className="bg-white/5 rounded-xl p-2 mb-6">
              <BlobProvider document={<AssessmentPDF data={formData} />}>
                {({ blob, url, loading }) => {
                  if (loading) {
                    return (
                      <div className="h-96 flex items-center justify-center">
                        <p className="text-white/60">Generating PDF preview...</p>
                      </div>
                    );
                  }
                  return (
                    <iframe
                      src={url || ''}
                      className="w-full h-96 rounded-lg bg-white"
                      title="PDF Preview"
                    />
                  );
                }}
              </BlobProvider>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <PDFReportButton data={formData} />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowReport(false)}
                  className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
                >
                  Back to Form
                </motion.button>
              </div>
              
              <div className="text-center">
                <p className="text-white/60 text-sm mb-3">Or get a text version:</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={copyToClipboard}
                    className="px-6 py-2 bg-white/5 border border-white/20 text-white/80 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Text
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={downloadReport}
                    className="px-6 py-2 bg-white/5 border border-white/20 text-white/80 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download Text
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Five Pillars Assessment
          </h1>
          <p className="text-white/80 text-lg mb-2">
            A comprehensive 34-question assessment based on the Five Pillars framework
          </p>
          <p className="text-white/60 text-sm">
            Complete all questions to receive your personalized transition report
          </p>
        </motion.div>

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/welcome')}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </motion.button>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 space-y-12"
        >
          {/* Basic Info */}
          <div ref={nameRef} className="space-y-4">
            <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-2">
              Basic Information
            </h3>
            <div>
              <label className="block text-white/90 text-sm font-medium mb-3">
                Your Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Transition & Purpose Section */}
          <div ref={transitionRef} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/20 pb-3">
              <Activity className="w-6 h-6 text-blue-400" />
              <h3 className="text-2xl font-semibold text-white">Transition & Purpose</h3>
            </div>

            <CheckboxGroup
              questionNumber="Q1"
              label="How would you describe your emotional state as you transition away from professional basketball?"
              options={['Excited', 'Anxious', 'Relieved', 'Lost', 'Hopeful', 'Overwhelmed', 'Motivated']}
              values={formData.q0_emotional_state}
              onChange={(option, checked) => handleCheckboxChange('q0_emotional_state', option, checked)}
            />

            <TextAreaInput
              questionNumber="Q2"
              label="What parts of your basketball career brought you the most fulfillment? Why?"
              value={formData.q0_career_fulfillment}
              onChange={(val) => handleInputChange('q0_career_fulfillment', val)}
              placeholder="Share what brought you the most joy and satisfaction..."
            />

            <div className="space-y-3">
              <label className="block text-white/90 text-sm font-medium">
                Q3. What are three activities or interests outside of basketball that energize or inspire you?
              </label>
              {formData.q0_personal_interests.map((interest, index) => (
                <div key={index}>
                  <label className="block text-white/70 text-xs mb-2">
                    Activity {index + 1}
                  </label>
                  <input
                    type="text"
                    value={interest}
                    onChange={(e) => handlePersonalInterestChange(index, e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                    placeholder={`Enter activity ${index + 1}...`}
                  />
                </div>
              ))}
            </div>

            <TextAreaInput
              questionNumber="Q4"
              label="When you think about your life after basketball, what are some things you hope to accomplish?"
              value={formData.q0_future_goals}
              onChange={(val) => handleInputChange('q0_future_goals', val)}
              placeholder="Professional goals, personal aspirations, community impact, legacy..."
            />

            <div className="space-y-3">
              <CheckboxGroup
                questionNumber="Q5"
                label="Which areas are you most curious about exploring? (Select up to 3)"
                options={[
                  'Business/Entrepreneurship',
                  'Coaching/Mentoring',
                  'Media/Entertainment',
                  'Philanthropy/Community Work',
                  'Real Estate/Investment',
                  'Health & Wellness',
                  'Education/Personal Development'
                ]}
                values={formData.q0_areas_of_interest}
                onChange={(option, checked) => handleCheckboxChange('q0_areas_of_interest', option, checked)}
              />
              <p className="text-orange-400 text-sm">
                Selected: {formData.q0_areas_of_interest.length}/3
              </p>
            </div>

            <TextAreaInput
              questionNumber="Q6"
              label="How would you define 'purpose' for yourself now?"
              value={formData.q0_purpose_definition}
              onChange={(val) => handleInputChange('q0_purpose_definition', val)}
              placeholder="What gives your life meaning and direction now?"
            />

            <CheckboxGroup
              questionNumber="Q7"
              label="Who do you feel supported by right now in your transition?"
              options={[
                'Family',
                'Former teammates',
                'Coaches/mentors',
                'Business advisors',
                'Friends outside basketball',
                'No one / not sure'
              ]}
              values={formData.q0_support_system}
              onChange={(option, checked) => handleCheckboxChange('q0_support_system', option, checked)}
            />

            <ScaleInput
              questionNumber="Q8"
              label="On a scale of 1 to 10, how clear are you about what you want to do next?"
              value={formData.q0_clarity}
              onChange={(val) => handleScaleChange('q0_clarity', val)}
            />

            <TextAreaInput
              questionNumber="Q9"
              label="What would you like most from a transition coach or support team right now?"
              value={formData.q0_support_needs}
              onChange={(val) => handleInputChange('q0_support_needs', val)}
              placeholder="What kind of support, guidance, or resources would be most helpful?"
            />
          </div>

          {/* 1️⃣ Camaraderie */}
          <div ref={camaraderieRef} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/20 pb-3">
              <Users className="w-6 h-6 text-orange-400" />
              <h3 className="text-2xl font-semibold text-white">1️⃣ Camaraderie</h3>
            </div>

            <ScaleInput
              questionNumber="Q10"
              label="How connected do you currently feel to other players from your era or the RPA network?"
              value={formData.q1_connection}
              onChange={(val) => handleScaleChange('q1_connection', val)}
            />

            <RadioGroup
              questionNumber="Q11"
              label="What type of player connection do you value most?"
              options={[
                'Locker room friendship',
                'Mentorship and advice',
                'Business partnerships',
                'Brotherhood support (life beyond the game)'
              ]}
              value={formData.q2_player_connection}
              onChange={(val) => handleInputChange('q2_player_connection', val)}
            />

            <RadioGroup
              questionNumber="Q12"
              label="How often do you reach out or participate in group activities with former teammates or players?"
              options={['Weekly', 'Monthly', 'Occasionally', 'Rarely', 'Never']}
              value={formData.q3_reach_out_frequency}
              onChange={(val) => handleInputChange('q3_reach_out_frequency', val)}
            />

            <div className="space-y-3">
              <CheckboxGroup
                questionNumber="Q13"
                label="What keeps you from connecting more often with fellow players? (Select all that apply)"
                options={['Busy schedule', 'Distance / geography', 'No clear way to reconnect', "Haven't found the right group yet", 'Other']}
                values={formData.q4_connection_barriers}
                onChange={(option, checked) => handleCheckboxChange('q4_connection_barriers', option, checked)}
              />
              {formData.q4_connection_barriers.includes('Other') && (
                <input
                  type="text"
                  value={formData.q4_connection_barriers_other}
                  onChange={(e) => handleInputChange('q4_connection_barriers_other', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                  placeholder="Please specify..."
                />
              )}
            </div>

            <TextAreaInput
              questionNumber="Q14"
              label="Describe one moment of brotherhood or camaraderie that you miss most from your playing days."
              value={formData.q5_brotherhood_moment}
              onChange={(val) => handleInputChange('q5_brotherhood_moment', val)}
              placeholder="Share a memorable moment..."
            />
          </div>

          {/* 2️⃣ Health */}
          <div ref={healthRef} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/20 pb-3">
              <Activity className="w-6 h-6 text-green-400" />
              <h3 className="text-2xl font-semibold text-white">2️⃣ Health</h3>
            </div>

            <ScaleInput
              questionNumber="Q15"
              label="How would you rate your current physical health and fitness level?"
              value={formData.q6_physical_health}
              onChange={(val) => handleScaleChange('q6_physical_health', val)}
            />

            <CheckboxGroup
              questionNumber="Q16"
              label="Which areas of your health need the most attention right now? (Select all that apply)"
              options={['Nutrition', 'Physical conditioning', 'Mental health', 'Recovery / sleep', 'Preventive care']}
              values={formData.q7_health_attention}
              onChange={(option, checked) => handleCheckboxChange('q7_health_attention', option, checked)}
            />

            <div className="space-y-3">
              <CheckboxGroup
                questionNumber="Q17"
                label="What motivates you to stay healthy today compared to when you were playing? (Select all that apply)"
                options={['Performance goals', 'Longevity / quality of life', 'Family example', 'Appearance / self-confidence', 'Other']}
                values={formData.q8_health_motivation}
                onChange={(option, checked) => handleCheckboxChange('q8_health_motivation', option, checked)}
              />
              {formData.q8_health_motivation.includes('Other') && (
                <input
                  type="text"
                  value={formData.q8_health_motivation_other}
                  onChange={(e) => handleInputChange('q8_health_motivation_other', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                  placeholder="Please specify..."
                />
              )}
            </div>

            <RadioGroup
              questionNumber="Q18"
              label="How consistent is your current health routine (workouts, meals, checkups, etc.)?"
              options={['Daily', 'Several times a week', 'Occasionally', 'Rarely', 'Never']}
              value={formData.q9_health_routine}
              onChange={(val) => handleInputChange('q9_health_routine', val)}
            />

            <TextAreaInput
              questionNumber="Q19"
              label="What one healthy habit do you want to commit to improving this year?"
              value={formData.q10_healthy_habit}
              onChange={(val) => handleInputChange('q10_healthy_habit', val)}
              placeholder="Describe your health goal..."
            />
          </div>

          {/* 3️⃣ Finance */}
          <div ref={financeRef} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/20 pb-3">
              <DollarSign className="w-6 h-6 text-yellow-400" />
              <h3 className="text-2xl font-semibold text-white">3️⃣ Finance</h3>
            </div>

            <ScaleInput
              questionNumber="Q20"
              label="How confident do you feel about your current financial stability and long-term planning?"
              value={formData.q11_financial_confidence}
              onChange={(val) => handleScaleChange('q11_financial_confidence', val)}
            />

            <CheckboxGroup
              questionNumber="Q21"
              label="Which of these financial areas do you most want to strengthen? (Select all that apply)"
              options={[
                'Investments and portfolio management',
                'Taxes and business structures',
                'Budgeting and cash flow',
                'Legacy and estate planning',
                'Insurance and protection'
              ]}
              values={formData.q12_financial_area}
              onChange={(option, checked) => handleCheckboxChange('q12_financial_area', option, checked)}
            />

            <div className="space-y-3">
              <RadioGroup
                questionNumber="Q22"
                label="Do you currently work with a financial advisor or planner?"
                options={['Yes', 'No']}
                value={formData.q13_has_advisor}
                onChange={(val) => handleInputChange('q13_has_advisor', val)}
              />
              {formData.q13_has_advisor === 'Yes' && (
                <ScaleInput
                  questionNumber="Q22b"
                  label="How satisfied are you with their guidance?"
                  value={formData.q13_advisor_satisfaction}
                  onChange={(val) => handleScaleChange('q13_advisor_satisfaction', val)}
                />
              )}
            </div>

            <RadioGroup
              questionNumber="Q23"
              label="How often do you review or update your financial goals?"
              options={['Monthly', 'Quarterly', 'Annually', 'Rarely', 'Never']}
              value={formData.q14_review_frequency}
              onChange={(val) => handleInputChange('q14_review_frequency', val)}
            />

            <TextAreaInput
              questionNumber="Q24"
              label="What financial goal or milestone are you most proud of since retiring?"
              value={formData.q15_financial_milestone}
              onChange={(val) => handleInputChange('q15_financial_milestone', val)}
              placeholder="Share your achievement..."
            />
          </div>

          {/* 4️⃣ Community */}
          <div ref={communityRef} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/20 pb-3">
              <Heart className="w-6 h-6 text-purple-400" />
              <h3 className="text-2xl font-semibold text-white">4️⃣ Community</h3>
            </div>

            <ScaleInput
              questionNumber="Q25"
              label="How involved are you in giving back to your community or supporting causes you care about?"
              value={formData.q16_community_involvement}
              onChange={(val) => handleScaleChange('q16_community_involvement', val)}
            />

            <div className="space-y-3">
              <CheckboxGroup
                questionNumber="Q26"
                label="What types of community impact matter most to you? (Select all that apply)"
                options={[
                  'Youth mentorship',
                  'Sports camps / clinics',
                  'Faith-based outreach',
                  'Social justice / advocacy',
                  'Local volunteering',
                  'Other'
                ]}
                values={formData.q17_community_impact}
                onChange={(option, checked) => handleCheckboxChange('q17_community_impact', option, checked)}
              />
              {formData.q17_community_impact.includes('Other') && (
                <input
                  type="text"
                  value={formData.q17_community_impact_other}
                  onChange={(e) => handleInputChange('q17_community_impact_other', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                  placeholder="Please specify..."
                />
              )}
            </div>

            <CheckboxGroup
              questionNumber="Q27"
              label="How often do you participate in community or charity events? (Select all that apply)"
              options={['Monthly', 'Quarterly', 'Occasionally', 'Rarely', 'Never']}
              values={formData.q18_community_frequency}
              onChange={(option, checked) => handleCheckboxChange('q18_community_frequency', option, checked)}
            />

            <div className="space-y-3">
              <CheckboxGroup
                questionNumber="Q28"
                label="What prevents you from doing more community work? (Select all that apply)"
                options={['Time', 'Resources', 'No organized opportunities', 'Lack of awareness', 'Other']}
                values={formData.q19_community_barriers}
                onChange={(option, checked) => handleCheckboxChange('q19_community_barriers', option, checked)}
              />
              {formData.q19_community_barriers.includes('Other') && (
                <input
                  type="text"
                  value={formData.q19_community_barriers_other}
                  onChange={(e) => handleInputChange('q19_community_barriers_other', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                  placeholder="Please specify..."
                />
              )}
            </div>

            <TextAreaInput
              questionNumber="Q29"
              label="Describe one way you'd like to use your platform or influence to create positive change."
              value={formData.q20_positive_change}
              onChange={(val) => handleInputChange('q20_positive_change', val)}
              placeholder="Share your vision..."
            />
          </div>

          {/* 5️⃣ Family */}
          <div ref={familyRef} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/20 pb-3">
              <Home className="w-6 h-6 text-blue-400" />
              <h3 className="text-2xl font-semibold text-white">5️⃣ Family</h3>
            </div>

            <ScaleInput
              questionNumber="Q30"
              label="How would you describe your current work-life balance with family time?"
              value={formData.q21_work_life_balance}
              onChange={(val) => handleScaleChange('q21_work_life_balance', val)}
            />

            <div className="space-y-3">
              <RadioGroup
                questionNumber="Q31"
                label="Who in your family has been your biggest supporter through your transition?"
                options={['Partner / Spouse', 'Parent', 'Sibling', 'Child', 'Other']}
                value={formData.q22_biggest_supporter}
                onChange={(val) => handleInputChange('q22_biggest_supporter', val)}
              />
              {formData.q22_biggest_supporter === 'Other' && (
                <input
                  type="text"
                  value={formData.q22_biggest_supporter_other}
                  onChange={(e) => handleInputChange('q22_biggest_supporter_other', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                  placeholder="Please specify..."
                />
              )}
            </div>

            <div className="space-y-3">
              <CheckboxGroup
                questionNumber="Q32"
                label="What family-related challenges have been most difficult in retirement? (Select all that apply)"
                options={[
                  'Adjusting to new routines',
                  'Communication',
                  'Parenting or co-parenting',
                  'Financial pressures',
                  'Other'
                ]}
                values={formData.q23_family_challenge}
                onChange={(option, checked) => handleCheckboxChange('q23_family_challenge', option, checked)}
              />
              {formData.q23_family_challenge.includes('Other') && (
                <input
                  type="text"
                  value={formData.q23_family_challenge_other}
                  onChange={(e) => handleInputChange('q23_family_challenge_other', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                  placeholder="Please specify..."
                />
              )}
            </div>

            <RadioGroup
              questionNumber="Q33"
              label="How often does your family engage in shared activities or traditions together?"
              options={['Weekly', 'Monthly', 'Occasionally', 'Rarely', 'Never']}
              value={formData.q24_family_activities}
              onChange={(val) => handleInputChange('q24_family_activities', val)}
            />

            <TextAreaInput
              questionNumber="Q34"
              label="What's one family goal or tradition you'd like to strengthen this year?"
              value={formData.q25_family_goal}
              onChange={(val) => handleInputChange('q25_family_goal', val)}
              placeholder="Share your family goal..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-8 border-t border-white/20">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              className="px-12 py-4 rounded-xl font-semibold text-lg transition-all bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
            >
              Submit Assessment
            </motion.button>
          </div>
        </motion.div>

        {/* Incomplete Modal */}
        <AnimatePresence>
          {showIncompleteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setShowIncompleteModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-purple-900 to-orange-900 rounded-2xl p-8 max-w-md w-full border border-white/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-8 h-8 text-orange-400" />
                  <h3 className="text-2xl font-bold text-white">Some Questions Unanswered</h3>
                </div>
                
                <p className="text-white/80 mb-4">
                  You have {incompleteFields.length} unanswered question{incompleteFields.length !== 1 ? 's' : ''}.
                  We've scrolled to the first section with missing answers.
                </p>

                {incompleteFields.length <= 5 && (
                  <div className="bg-white/10 rounded-lg p-3 mb-4 max-h-32 overflow-y-auto">
                    <p className="text-white/70 text-sm mb-2">Missing:</p>
                    <ul className="text-white/90 text-sm space-y-1">
                      {incompleteFields.map((field, idx) => (
                        <li key={idx}>• {field}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-white/60 text-sm mb-6">
                  You can go back and complete them, or submit anyway if you prefer to skip some questions.
                </p>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowIncompleteModal(false)}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white font-semibold hover:bg-white/20 transition-all"
                  >
                    Go Back & Complete
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmitAnyway}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
                  >
                    Submit Anyway
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
