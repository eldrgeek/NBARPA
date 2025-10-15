import React from 'react';
import { MarkdownPage } from '../components/MarkdownPage';
import { Briefcase } from 'lucide-react';

const content = `# Business Partnership Opportunities

## Connect with NBA Talent for Mutual Success

The NBA Retired Players Association connects forward-thinking businesses with exceptional talent from the NBA community. Our members bring unique skills, perspectives, and networks that can drive your business forward while creating meaningful second careers for former athletes.

## Why Partner with NBA Players?

### Unique Value Proposition
- **Elite Performance Mindset** - Players who've competed at the highest level bring unmatched discipline and drive
- **Proven Team Leadership** - Natural leaders who understand collaboration and motivation
- **Global Brand Recognition** - Instant credibility and attention for your initiatives
- **Diverse Networks** - Access to exclusive relationships across sports, entertainment, and business
- **Resilience & Adaptability** - Athletes who've overcome adversity and adapted to constant change

### Business Impact Statistics
- **87% of companies** with athlete employees report improved team performance
- **3x higher engagement** in marketing campaigns featuring authentic athlete stories
- **65% increase** in brand trust when partnering with respected athletes
- **$2.4M average ROI** from strategic athlete partnership programs

## Partnership Models

### 1. Employment & Career Programs
Integrate elite talent into your workforce through executive positions, specialized roles, and development programs tailored for transitioning athletes.

### 2. Brand Ambassadorship
Leverage authentic voices for your brand through speaking engagements, marketing partnerships, and social media campaigns.

### 3. Business Ventures
Co-create and invest together through joint ventures, franchise opportunities, and strategic consulting services.

### 4. Social Impact Initiatives
Amplify your corporate social responsibility through community programs, foundation partnerships, and collaborative charitable initiatives.

## Industries Seeking NBA Talent

- **Technology & Innovation** - Product development, sports tech, gaming platforms
- **Financial Services** - Wealth management, client relationships, financial education
- **Real Estate & Development** - Commercial projects, property management, investments
- **Media & Entertainment** - Broadcasting, content production, digital platforms
- **Healthcare & Wellness** - Health tech, wellness programs, mental health advocacy
- **Retail & Consumer Goods** - Product development, brand strategy, e-commerce

## Corporate Membership Benefits

### Bronze Level ($25,000/year)
Access to talent database, quarterly networking events, speaking engagement discounts, CSR partnership opportunities

### Silver Level ($50,000/year)
All Bronze benefits plus dedicated relationship manager, priority talent matching, custom workshops, brand partnerships

### Gold Level ($100,000/year)
All Silver benefits plus executive talent pipeline, board member recommendations, co-branded initiatives, strategic planning

### Platinum Level ($250,000+/year)
Fully customized partnership with C-suite access, multi-year talent strategies, and exclusive partnership rights

## Getting Started

### Contact Our Business Development Team
- **Email**: partnerships@rpaconnect.org
- **Phone**: 1-800-RPA-BIZZ
- **LinkedIn**: RPA Business Connect
- **Website**: rpaconnect.org/business

---

*"When you partner with NBA players, you're not just hiring employees or spokespeople—you're gaining champions who know what it takes to win."*

Transform your business with the power of NBA talent. Contact us today to explore partnership opportunities.`;

export const BusinessPartnerPage: React.FC = () => {
  return (
    <MarkdownPage
      content={content}
      title="Business Partnerships"
      icon={Briefcase}
      accentColor="from-purple-500 to-purple-600"
    />
  );
};