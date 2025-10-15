import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Home, ArrowLeft, Users, BookOpen, Shield, HeartHandshake } from 'lucide-react';
import { PillarImageCard } from '../components/PillarImageCard';
import { PillarExplorationModal } from '../components/PillarExplorationModal';
import { usePillarProgressContext } from '../contexts/PillarProgressContext';

const content = `# Family - The Fifth Pillar

## Nurture Families and Generational Journeys

Family represents the fifth and culminating pillar of The RPA's Five Pillars model, recognizing that the success and well-being of NBA players is deeply connected to the health and strength of their family relationships. This pillar focuses on nurturing families and supporting generational journeys that create lasting legacies beyond basketball achievements.

## The Family Foundation

### More Than Individual Success
NBA players understand that their achievements are built on family foundations:
- **Family sacrifices** that enabled their basketball development
- **Generational support** from parents, grandparents, and extended family
- **Spousal partnerships** providing emotional and practical support
- **Children's futures** depending on family stability and guidance
- **Extended family responsibilities** for siblings, cousins, and community family

### The Unique Family Challenges
NBA families face distinctive pressures and opportunities:
- **Public scrutiny** of family relationships and decisions
- **Financial pressures** from extended family and community expectations
- **Geographic displacement** from home communities and extended family
- **Lifestyle adjustments** during and after basketball careers
- **Generational responsibility** for breaking cycles and creating new legacies

## 2025+ Game-Winning Execution

### Scholarships
- **RPA Family Education Fund** - Supporting spouses and children's educational goals
- **Next Generation Scholarships** - College funding for NBA players' children
- **Extended Family Education** - Supporting siblings and relatives' educational pursuits
- **Family Business Development Grants** - Funding family-led business ventures
- **Professional Development Scholarships** - Career training for family members

### Family Programs & Support
- **Annual Family Retreat** - Multi-generational gathering for all NBA families
- **Marriage Enrichment Weekends** - Relationship strengthening for couples
- **Children's Leadership Camp** - Development programs for players' kids
- **Extended Family Education Days** - Understanding NBA life and supporting relatives
- **Family Financial Planning Workshops** - Managing wealth for generational benefit

## 2026+ Next Season Vision

### Family Care Hub
- **Comprehensive Family Services Platform** - One-stop support for all family needs
- **Estate Planning and Legal Services** - Protecting family assets and planning inheritance
- **Childcare and Education Coordination** - Supporting working families with quality care
- **Elder Care Support** - Assisting with aging parents and grandparents
- **Family Health and Wellness Programs** - Comprehensive care for entire families

## Core Components

### 1. Marriage & Partnership Strengthening
- **Marriage counseling** specialized for sports couples and transition challenges
- **Communication training** for navigating career changes and family decisions
- **Financial partnership** education for couples managing significant wealth
- **Conflict resolution** skills for handling disagreements and stress
- **Intimacy and connection** maintaining strong relationships through changes

### 2. Parenting & Child Development
- **Parenting education** for raising children in unique NBA family circumstances
- **Child development support** addressing the specific needs of NBA players' children
- **Educational planning** ensuring children receive excellent education opportunities
- **Identity development** helping children develop their own identities beyond basketball
- **Character building** instilling values and principles for lifelong success

### 3. Extended Family & Generational Support
- **Extended family education** helping relatives understand NBA life and expectations
- **Boundary setting** training for managing family financial and emotional requests
- **Generational planning** creating family legacies that extend beyond individual success
- **Family reunion planning** maintaining connections across extended family networks
- **Tradition building** creating new family traditions and celebrating heritage

### 4. Crisis Support & Intervention
- **Family crisis counseling** for major challenges, conflicts, and adjustments
- **Divorce mediation** when relationships cannot be preserved
- **Child custody support** ensuring children's well-being during family changes
- **Domestic violence intervention** protecting family members from abuse
- **Emergency family support** during health crises, financial emergencies, and other urgent needs

## Getting Started

### Family Foundation Building
1. **Assess current family relationships** and identify strengths and challenges
2. **Establish family communication** practices for healthy interaction
3. **Set family goals and values** that guide decisions and priorities
4. **Create family financial plan** that benefits all family members
5. **Build support network** of other families and professional resources

### Relationship Strengthening
1. **Invest in marriage relationship** through counseling, education, and quality time
2. **Develop parenting skills** for effectively raising children through transitions
3. **Set healthy boundaries** with extended family regarding expectations and support
4. **Create family traditions** that build connection and shared identity
5. **Plan for family crises** through communication agreements and support systems

---

**Remember:** Your basketball success is meaningful only when it strengthens and supports the family relationships that matter most. The Family Pillar ensures that your achievements create lasting benefits for the people you love most.`;

export const PillarFamilyPage: React.FC = () => {
  const navigate = useNavigate();
  const { progress, markPillarVisited } = usePillarProgressContext();
  const [showExplorationModal, setShowExplorationModal] = useState(false);

  // Mark this pillar as visited when the component mounts
  useEffect(() => {
    markPillarVisited('family');
  }, [markPillarVisited]);

  const supportAreas = [
    {
      title: "Marriage & Partnership Strengthening",
      description: "Marriage counseling specialized for sports couples, communication training for career changes, and financial partnership education for managing wealth.",
      icon: HeartHandshake,
      color: "pink",
      bgGradient: "from-pink-500 to-rose-600"
    },
    {
      title: "Parenting & Child Development", 
      description: "Parenting education for NBA family circumstances, child development support, educational planning, and character building for lifelong success.",
      icon: Users,
      color: "blue",
      bgGradient: "from-blue-500 to-indigo-600"
    },
    {
      title: "Extended Family & Generational Support",
      description: "Extended family education about NBA life, boundary setting training, generational planning, and tradition building for family legacies.",
      icon: BookOpen,
      color: "green",
      bgGradient: "from-green-500 to-emerald-600"
    },
    {
      title: "Crisis Support & Intervention",
      description: "Family crisis counseling, divorce mediation, child custody support, domestic violence intervention, and emergency family support.",
      icon: Shield,
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
                <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-r from-purple-500 to-purple-600">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white text-left">
                    Family
                  </h1>
                  <p className="text-purple-300 text-lg font-medium text-left">The Fifth Pillar</p>
                </div>
              </div>
              
              <p className="text-white/90 text-xl md:text-2xl max-w-4xl mx-auto mb-6">
                Nurture Families and Generational Journeys
              </p>
              <p className="text-white/70 text-lg max-w-3xl mx-auto">
                Family represents the fifth and culminating pillar, recognizing that the success and well-being of NBA players 
                is deeply connected to the health and strength of their family relationships.
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
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">The Family Foundation</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-300 mb-2">73%</div>
                <div className="text-white/70 text-sm">experience relationship strain during transition</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-300 mb-2">85%</div>
                <div className="text-white/70 text-sm">say family support is crucial for success</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-300 mb-2">92%</div>
                <div className="text-white/70 text-sm">want to create positive family legacies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-300 mb-2">200+</div>
                <div className="text-white/70 text-sm">families supported annually</div>
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
                <h3 className="text-lg font-semibold text-white mb-4">🎓 Scholarships</h3>
                <ul className="text-white/70 text-sm space-y-2">
                  <li>• RPA Family Education Fund</li>
                  <li>• Next Generation Scholarships</li>
                  <li>• Extended Family Education</li>
                  <li>• Family Business Development Grants</li>
                  <li>• Professional Development Scholarships</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">👨‍👩‍👧‍👦 Family Programs & Support</h3>
                <ul className="text-white/70 text-sm space-y-2">
                  <li>• Annual Family Retreat</li>
                  <li>• Marriage Enrichment Weekends</li>
                  <li>• Children's Leadership Camp</li>
                  <li>• Extended Family Education Days</li>
                  <li>• Family Financial Planning Workshops</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* 2026+ Next Season */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-12"
          >
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              2026+ Next Season Vision
            </h2>
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">🏠 Family Care Hub</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="text-white/70 text-sm space-y-2">
                  <li>• Comprehensive Family Services Platform</li>
                  <li>• Estate Planning and Legal Services</li>
                  <li>• Childcare and Education Coordination</li>
                </ul>
                <ul className="text-white/70 text-sm space-y-2">
                  <li>• Elder Care Support</li>
                  <li>• Family Health and Wellness Programs</li>
                  <li>• Generational Legacy Programs</li>
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
                  <li>• Marriage and relationship counseling</li>
                  <li>• Parenting support programs</li>
                  <li>• Extended family guidance</li>
                  <li>• Generational planning assistance</li>
                </ul>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-3">⭐ Active Players</h3>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• Family preparation for life changes</li>
                  <li>• Marriage strengthening programs</li>
                  <li>• Parenting while playing support</li>
                  <li>• Legacy planning for families</li>
                </ul>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-3">👨‍👩‍👧‍👦 Families</h3>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• Spouse support networks</li>
                  <li>• Children's transition programs</li>
                  <li>• Extended family education</li>
                  <li>• Generational support systems</li>
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
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">
                Your Basketball Success Is Meaningful When It Strengthens Family
              </h2>
              <p className="text-purple-100 mb-6">
                The Family Pillar ensures that your achievements create lasting benefits for the people you love most, 
                building legacies that extend far beyond basketball accomplishments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/welcome')}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Start Family Assessment
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
        currentPillar="family"
      />
    </div>
  );
};