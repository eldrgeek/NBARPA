import React from 'react';
import { MarkdownPage } from '../components/MarkdownPage';
import { Award } from 'lucide-react';

// Import the markdown content as a string
const content = `# Retired Player Community

## Welcome to Your Next Chapter

Your playing days may be behind you, but your most impactful years lie ahead. The NBA Retired Players Association recognizes that life after basketball is not just about what you've accomplished—it's about what you'll build next.

## You Are Not Alone

### The Brotherhood Continues
- **4,500+ retired NBA players** in our community
- **Shared experiences** of transition and reinvention
- **Collective wisdom** from decades of professional success
- **Ongoing support** through every stage of your journey

## Comprehensive Support Programs

### 1. Health & Wellness Initiative
**Your Body Served You—Now Serve It**

Post-Career Medical Support, Injury Recovery Programs, Preventive Care, and Mental Health Resources specifically designed for former professional athletes.

### 2. Financial Security Program
**Protect and Grow Your Legacy**

Retirement Planning, Investment Management, Estate Planning, and Financial Recovery assistance for players at every stage of their financial journey.

### 3. Career Development Center
**Transform Your Experience Into Opportunity**

Coaching Certifications, Media Training, Business Development, Speaking Opportunities, and Executive Placement services.

### 4. Family Support Network
**Your Success Includes Your Loved Ones**

Spouse Programs, Children's Education Support, Family Counseling, and Generational Wealth Planning.

### 5. Community Impact Platform
**Give Back with Purpose**

Foundation Development, Mentorship Programs, Youth Basketball Initiatives, and Community Leadership opportunities.

## Success Stories

*"The transition was scary at first, but finding my purpose in coaching young players has been more fulfilling than I ever imagined."* - Former NBA Guard, now High School Coach

*"The financial planning program helped me turn my basketball earnings into a thriving business empire."* - Former NBA Forward, now Entrepreneur

## Connect With Your Community

### Regional Chapters
Join retired players in your area for networking, social events, and local support initiatives.

### Annual Convention
Reconnect with former teammates and opponents while accessing the latest resources and opportunities.

### Digital Platform
24/7 access to resources, exclusive job boards, and connection with the broader retired player community.

## Get Started Today

### Contact Your Retired Player Services Team
- **Email**: support@rpaconnect.org
- **Phone**: 1-800-RPA-HELP
- **Text**: RETIRED to 55555

### Priority Services
- Health insurance navigation
- Career transition counseling
- Financial wellness assessment
- Mental health support

---

*"Once a player, always family. Your jersey may be retired, but your impact continues."*

The game gave you a platform. Now use it to build something lasting.

---

**Learn more about the NBA Retired Players Association at [LegendsofBasketball.com](https://legendsofbasketball.com)**`;

export const RetiredPlayerPage: React.FC = () => {
  return (
    <MarkdownPage
      content={content}
      title="Retired Player Community"
      icon={Award}
      accentColor="from-purple-500 to-orange-500"
    />
  );
};