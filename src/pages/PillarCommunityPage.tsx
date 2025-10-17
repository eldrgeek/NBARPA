import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Home, ArrowLeft, GraduationCap, Building, Heart, Zap, ExternalLink, Handshake, Award } from 'lucide-react';
import { PillarImageCard } from '../components/PillarImageCard';
import { PillarExplorationModal } from '../components/PillarExplorationModal';
import { usePillarProgressContext } from '../contexts/PillarProgressContext';

const content = `# Community - The Fourth Pillar

## Uplift Our Youth and Our Communities

Community represents the fourth pillar of The RPA's Five Pillars model, recognizing that NBA players have unique platforms and opportunities to create positive change in the communities that shaped them and the communities they now call home. This pillar focuses on uplifting youth and strengthening communities through meaningful engagement and sustainable impact.

## The Community Connection

### Beyond Individual Success
NBA players understand that their success was built on community support:
- **Community foundations** that nurtured their early development
- **Youth programs** that provided structure, mentorship, and opportunities
- **Local support systems** that believed in their potential
- **Educational institutions** that balanced academics with athletic development
- **Community pride** that celebrated their achievements and growth

### The Opportunity for Impact
Retired and active NBA players possess unique advantages for community building:
- **Platform and visibility** that can spotlight important causes and needs
- **Financial resources** to fund meaningful programs and initiatives
- **Life experience** overcoming challenges that youth and communities face
- **Network access** connecting communities with additional resources and opportunities
- **Credibility and influence** that can inspire and motivate positive change

## 2025+ Game-Winning Execution

### Basketball Programs
- **RPA Youth Basketball Leagues** - Structured leagues in underserved communities
- **Skills Development Camps** - Intensive training combining basketball and life skills
- **Coach Development Programs** - Training community coaches for sustainable impact
- **Equipment and Facility Investment** - Improving basketball infrastructure in communities
- **Tournament and Showcase Events** - Celebrating youth achievement and providing exposure

### Community Development Initiatives
- **Community Investment Fund** - Direct funding for local development projects
- **Small Business Incubator** - Supporting local entrepreneurship and job creation
- **Educational Excellence Programs** - Comprehensive school and student support
- **Health and Wellness Centers** - Community facilities for physical and mental health
- **Arts and Culture Programs** - Supporting creative expression and community pride

## Core Components

### 1. Youth Development & Mentorship
- **Mentorship programs** pairing players with young people needing guidance and support
- **Athletic programs** teaching basketball skills while building character and leadership
- **Educational support** providing tutoring, scholarships, and academic resources
- **Life skills development** teaching practical skills for success beyond sports
- **Leadership training** developing the next generation of community leaders

### 2. Community Investment & Development
- **Economic development initiatives** supporting local business growth and job creation
- **Infrastructure investment** improving community facilities and resources
- **Housing and neighborhood development** addressing community living conditions
- **Small business support** helping local entrepreneurs start and grow businesses
- **Community center development** creating spaces for gathering, learning, and growth

### 3. Educational Excellence & Opportunity
- **School improvement initiatives** supporting educational quality and resources
- **Scholarship programs** providing educational opportunities for deserving students
- **STEM education promotion** encouraging science, technology, engineering, and math learning
- **Arts and culture programs** supporting creative expression and cultural development
- **College preparation** helping students navigate higher education opportunities

### 4. Health & Wellness Community Programs
- **Community health initiatives** addressing local health challenges and needs
- **Youth fitness programs** promoting healthy lifestyles and athletic participation
- **Mental health awareness** reducing stigma and increasing access to support
- **Nutrition education** teaching healthy eating and cooking skills
- **Safety and violence prevention** creating safer communities for families and youth

## Getting Started

### Community Connection Phase
1. **Assess community needs** through research, listening, and partnership development
2. **Connect with local organizations** already working on community development
3. **Identify youth mentorship opportunities** for meaningful relationship building
4. **Meet community leaders** to understand priorities and partnership possibilities
5. **Evaluate personal capacity** for sustainable community engagement

### Program Development Phase
1. **Design community initiative** addressing identified needs and leveraging personal strengths
2. **Build partnership network** with local organizations and community leaders
3. **Secure initial funding** for program launch and early operations
4. **Recruit volunteers** to support and expand program impact
5. **Establish measurement systems** for tracking progress and outcomes

---

**Remember:** The communities that supported your journey to the NBA deserve your investment in their future. The Community Pillar ensures that your success creates opportunities for others to achieve their dreams.`;

export const PillarCommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const { progress, markPillarVisited } = usePillarProgressContext();
  const [showExplorationModal, setShowExplorationModal] = useState(false);

  // Mark this pillar as visited when the component mounts
  useEffect(() => {
    markPillarVisited('community');
  }, [markPillarVisited]);

  const supportAreas = [
    {
      title: "Youth Development & Mentorship",
      description: "Mentorship programs pairing players with young people, athletic programs building character, and educational support providing scholarships and academic resources.",
      icon: GraduationCap,
      color: "blue",
      bgGradient: "from-blue-500 to-indigo-600"
    },
    {
      title: "Community Investment & Development", 
      description: "Economic development initiatives supporting local business growth, infrastructure investment, and community center development for gathering and learning.",
      icon: Building,
      color: "green",
      bgGradient: "from-green-500 to-emerald-600"
    },
    {
      title: "Educational Excellence & Opportunity",
      description: "School improvement initiatives, scholarship programs, STEM education promotion, and college preparation helping students navigate higher education.",
      icon: GraduationCap,
      color: "purple",
      bgGradient: "from-purple-500 to-purple-600"
    },
    {
      title: "Health & Wellness Community Programs",
      description: "Community health initiatives, youth fitness programs, mental health awareness, nutrition education, and safety and violence prevention.",
      icon: Heart,
      color: "red",
      bgGradient: "from-red-500 to-pink-600"
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
                <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white text-left">
                    Community
                  </h1>
                  <p className="text-blue-300 text-lg font-medium text-left">The Fourth Pillar</p>
                </div>
              </div>
              
              <p className="text-white/90 text-xl md:text-2xl max-w-4xl mx-auto mb-6">
                Uplift Our Youth and Our Communities
              </p>
              <p className="text-white/70 text-lg max-w-3xl mx-auto">
                Community represents the fourth pillar, recognizing that NBA players have unique platforms and 
                opportunities to create positive change in the communities that shaped them.
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
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">The Community Connection</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-300 mb-2">500+</div>
                <div className="text-white/70 text-sm">youth mentored annually</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-300 mb-2">50</div>
                <div className="text-white/70 text-sm">communities with active programs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-300 mb-2">$2M+</div>
                <div className="text-white/70 text-sm">invested in local development</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-300 mb-2">1000+</div>
                <div className="text-white/70 text-sm">scholarships awarded</div>
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
                <h3 className="text-lg font-semibold text-white mb-4">🏀 Basketball Programs</h3>
                <ul className="text-white/70 text-sm space-y-2">
                  <li>• RPA Youth Basketball Leagues</li>
                  <li>• Skills Development Camps</li>
                  <li>• Coach Development Programs</li>
                  <li>• Equipment and Facility Investment</li>
                  <li>• Tournament and Showcase Events</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">🏘️ Community Development Initiatives</h3>
                <ul className="text-white/70 text-sm space-y-2">
                  <li>• Community Investment Fund</li>
                  <li>• Small Business Incubator</li>
                  <li>• Educational Excellence Programs</li>
                  <li>• Health and Wellness Centers</li>
                  <li>• Arts and Culture Programs</li>
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
                  <li>• Community impact programs</li>
                  <li>• Youth mentorship initiatives</li>
                  <li>• Local partnership development</li>
                  <li>• Leadership training for community engagement</li>
                </ul>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-3">⭐ Active Players</h3>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• Community engagement planning</li>
                  <li>• Youth program development</li>
                  <li>• Local community integration</li>
                  <li>• Platform optimization for impact</li>
                </ul>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-3">👨‍👩‍👧‍👦 Families</h3>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• Family volunteering opportunities</li>
                  <li>• Youth development programs</li>
                  <li>• Community integration support</li>
                  <li>• Educational initiatives participation</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* NBRPA Community Programs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-12"
          >
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              Official NBRPA Community Programs
            </h2>
            <p className="text-white/70 text-center mb-6">
              Join official NBRPA Legends Care initiatives making a difference in communities nationwide
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <a
                href="https://legendsofbasketball.com/legends-care/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/15 rounded-xl p-6 transition-all border border-white/20 hover:border-white/30"
              >
                <div className="flex items-start gap-3">
                  <Heart className="w-6 h-6 text-red-300 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2 flex items-center gap-2 text-sm">
                      Legends Care
                      <ExternalLink className="w-3 h-3" />
                    </h3>
                    <p className="text-white/70 text-xs">
                      Official NBRPA community programs
                    </p>
                  </div>
                </div>
              </a>

              <a
                href="https://legendsofbasketball.com/legends-care/full-court-press/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/15 rounded-xl p-6 transition-all border border-white/20 hover:border-white/30"
              >
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-orange-300 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2 flex items-center gap-2 text-sm">
                      Full Court Press
                      <ExternalLink className="w-3 h-3" />
                    </h3>
                    <p className="text-white/70 text-xs">
                      Youth basketball and mentorship initiative
                    </p>
                  </div>
                </div>
              </a>

              <a
                href="https://legendsofbasketball.com/contact/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/15 rounded-xl p-6 transition-all border border-white/20 hover:border-white/30"
              >
                <div className="flex items-start gap-3">
                  <Award className="w-6 h-6 text-purple-300 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2 flex items-center gap-2 text-sm">
                      Educational Support
                      <ExternalLink className="w-3 h-3" />
                    </h3>
                    <p className="text-white/70 text-xs">
                      Contact NBRPA about educational programs
                    </p>
                  </div>
                </div>
              </a>

              <a
                href="https://legendsofbasketball.com/legends-care/donate-now/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/15 rounded-xl p-6 transition-all border border-white/20 hover:border-white/30"
              >
                <div className="flex items-start gap-3">
                  <Handshake className="w-6 h-6 text-green-300 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2 flex items-center gap-2 text-sm">
                      Support Programs
                      <ExternalLink className="w-3 h-3" />
                    </h3>
                    <p className="text-white/70 text-xs">
                      Donate to NBRPA community programs
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">
                The Communities That Supported Your Journey Deserve Your Investment
              </h2>
              <p className="text-blue-100 mb-6">
                The Community Pillar ensures that your success creates opportunities for others to achieve their dreams 
                and strengthens the communities that shape future generations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/welcome')}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Start Community Impact
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
        currentPillar="community"
      />
    </div>
  );
};