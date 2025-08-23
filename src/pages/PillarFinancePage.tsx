import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DollarSign, Home, ArrowLeft, TrendingUp, Shield, BookOpen, AlertTriangle } from 'lucide-react';
import { PillarImageCard } from '../components/PillarImageCard';
import { PillarExplorationModal } from '../components/PillarExplorationModal';
import { usePillarProgressContext } from '../contexts/PillarProgressContext';

const content = `# Finance - The Third Pillar

## Foster Stability and Resilient Futures

Finance represents the third pillar of The RPA's Five Pillars model, addressing one of the most critical challenges facing NBA players: building and maintaining financial stability that extends far beyond their playing careers. This pillar focuses on fostering economic resilience and creating lasting financial security for players and their families.

## The Financial Foundation

### Beyond the Big Contract
NBA players face unique financial challenges that require specialized support:
- **Compressed earning window** with average careers lasting just 4.5 years
- **Complex financial decisions** involving millions of dollars at young ages
- **Extended financial responsibilities** to family and community
- **Irregular income patterns** with peak earnings during playing years
- **Post-career income uncertainty** requiring strategic planning

### The Sobering Statistics
- **60% of NBA players** experience financial difficulties within 5 years of retirement
- **78% face financial stress** within 2 years of leaving the league
- **Average career earnings** vary dramatically from $1M to $400M+
- **40% of income** typically lost to taxes, fees, and expenses
- **Only 18%** feel "very prepared" for post-career financial management

## 2025+ Game-Winning Execution

### Financial Education & Partnerships
- **Annual Financial Literacy Summit** - Comprehensive education for all alumni
- **Regional Financial Workshops** - Quarterly training in major cities
- **Rookie Financial Bootcamp** - Essential education for new players
- **Family Financial Planning Days** - Education and planning for entire families
- **Business Development Seminars** - Entrepreneurship and investment education

### Investment & Partnership Opportunities
- **RPA Investment Fund** - Collective investment opportunities for alumni
- **Business Incubator Program** - Supporting player-led ventures and startups
- **Real Estate Investment Network** - Group purchasing and development opportunities
- **Financial Services Marketplace** - Vetted providers offering athlete-specialized services
- **Peer Investment Groups** - Players collaborating on investment opportunities

## Core Components

### 1. Financial Education & Literacy
- **Comprehensive financial education** covering all aspects of money management
- **Investment fundamentals** including risk assessment and portfolio diversification
- **Tax planning and optimization** minimizing unnecessary financial losses
- **Estate planning** for wealth preservation and transfer
- **Contract and legal education** understanding complex financial agreements

### 2. Professional Financial Services
- **Certified Financial Planners** with extensive athlete experience
- **Investment advisors** with fiduciary responsibility and athlete expertise
- **Tax professionals** specializing in athlete income and deductions
- **Estate planning attorneys** familiar with athlete wealth management needs
- **Insurance specialists** providing comprehensive coverage for unique athlete risks

### 3. Investment Opportunities & Education
- **Traditional investment strategies** including stocks, bonds, and real estate
- **Alternative investments** including private equity, venture capital, and business ownership
- **Athlete-specific opportunities** leveraging sports knowledge and networks
- **Passive income development** creating sustainable post-career revenue streams
- **Risk management** balancing growth potential with security needs

### 4. Crisis Prevention & Support
- **Emergency financial assistance** for immediate crisis situations
- **Debt counseling and restructuring** for overwhelming financial obligations
- **Bankruptcy prevention** through strategic intervention and planning
- **Legal support** for financial disputes and contract issues
- **Bridge funding** during career transitions and income gaps

## Getting Started

### Financial Foundation Building
1. **Complete comprehensive financial assessment** with certified professional
2. **Establish emergency fund** covering 6-12 months of expenses
3. **Optimize tax strategy** ensuring compliance and minimizing unnecessary losses
4. **Review insurance coverage** protecting against financial risks
5. **Begin financial education** through courses, workshops, and reading

### Investment & Growth Planning
1. **Develop investment strategy** aligned with goals and risk tolerance
2. **Create diversified portfolio** balancing growth and security
3. **Explore business opportunities** leveraging skills and networks
4. **Plan passive income streams** for post-career financial security
5. **Build professional advisory team** of trusted financial experts

---

**Remember:** Financial stability isn't just about how much you earn - it's about how much you keep, grow, and pass on. The Finance Pillar ensures your hard work on the court translates into lasting financial security for you and your family.`;

export const PillarFinancePage: React.FC = () => {
  const navigate = useNavigate();
  const { progress, markPillarVisited } = usePillarProgressContext();
  const [showExplorationModal, setShowExplorationModal] = useState(false);

  // Mark this pillar as visited when the component mounts
  useEffect(() => {
    markPillarVisited('finance');
  }, [markPillarVisited]);

  const supportAreas = [
    {
      title: "Financial Education & Literacy",
      description: "Comprehensive financial education covering money management, investment fundamentals, tax planning, and estate planning for wealth preservation.",
      icon: BookOpen,
      color: "blue",
      bgGradient: "from-blue-500 to-indigo-600"
    },
    {
      title: "Professional Financial Services", 
      description: "Certified Financial Planners, investment advisors, tax professionals, and estate planning attorneys with extensive athlete experience.",
      icon: Shield,
      color: "purple",
      bgGradient: "from-purple-500 to-purple-600"
    },
    {
      title: "Investment Opportunities & Education",
      description: "Traditional and alternative investment strategies, athlete-specific opportunities, passive income development, and risk management.",
      icon: TrendingUp,
      color: "green",
      bgGradient: "from-green-500 to-emerald-600"
    },
    {
      title: "Crisis Prevention & Support",
      description: "Emergency financial assistance, debt counseling, bankruptcy prevention, legal support, and bridge funding during transitions.",
      icon: AlertTriangle,
      color: "orange",
      bgGradient: "from-orange-500 to-red-600"
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
                <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white text-left">
                    Finance
                  </h1>
                  <p className="text-green-300 text-lg font-medium text-left">The Third Pillar</p>
                </div>
              </div>
              
              <p className="text-white/90 text-xl md:text-2xl max-w-4xl mx-auto mb-6">
                Foster Stability and Resilient Futures
              </p>
              <p className="text-white/70 text-lg max-w-3xl mx-auto">
                Finance represents the third pillar, addressing one of the most critical challenges facing NBA players: 
                building and maintaining financial stability that extends far beyond their playing careers.
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
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">The Financial Reality</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-300 mb-2">60%</div>
                <div className="text-white/70 text-sm">face financial difficulties in 5 years</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-300 mb-2">4.5</div>
                <div className="text-white/70 text-sm">years average NBA career</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300 mb-2">40%</div>
                <div className="text-white/70 text-sm">of income lost to taxes and fees</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-300 mb-2">18%</div>
                <div className="text-white/70 text-sm">feel prepared for post-career finances</div>
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
                <h3 className="text-lg font-semibold text-white mb-4">📚 Financial Education & Partnerships</h3>
                <ul className="text-white/70 text-sm space-y-2">
                  <li>• Annual Financial Literacy Summit</li>
                  <li>• Regional Financial Workshops</li>
                  <li>• Rookie Financial Bootcamp</li>
                  <li>• Family Financial Planning Days</li>
                  <li>• Business Development Seminars</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">💼 Investment & Partnership Opportunities</h3>
                <ul className="text-white/70 text-sm space-y-2">
                  <li>• RPA Investment Fund</li>
                  <li>• Business Incubator Program</li>
                  <li>• Real Estate Investment Network</li>
                  <li>• Financial Services Marketplace</li>
                  <li>• Peer Investment Groups</li>
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
                  <li>• Financial assessment and planning</li>
                  <li>• Debt restructuring and management</li>
                  <li>• Investment education opportunities</li>
                  <li>• Emergency financial assistance</li>
                </ul>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-3">⭐ Active Players</h3>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• Early financial literacy education</li>
                  <li>• Investment strategy development</li>
                  <li>• Tax optimization planning</li>
                  <li>• Retirement planning from rookie year</li>
                </ul>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-3">👨‍👩‍👧‍👦 Families</h3>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• Family financial planning sessions</li>
                  <li>• Generational wealth strategies</li>
                  <li>• Estate planning guidance</li>
                  <li>• Financial education for family members</li>
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
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">
                Financial Stability Isn't About How Much You Earn
              </h2>
              <p className="text-green-100 mb-6">
                It's about how much you keep, grow, and pass on. The Finance Pillar ensures your hard work 
                on the court translates into lasting financial security for you and your family.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/welcome')}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Start Financial Assessment
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
        currentPillar="finance"
      />
    </div>
  );
};