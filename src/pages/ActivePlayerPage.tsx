import React from 'react';
import { MarkdownPage } from '../components/MarkdownPage';
import { UserCheck } from 'lucide-react';

// Import the markdown content as a string
const content = `# Active Player Journey

## Welcome to Your Future Planning Hub

As an active NBA player, you have a unique opportunity to prepare for life after basketball while you're still in the game. The transition from professional sports doesn't have to be sudden or overwhelming—with the right preparation, it can be an exciting evolution.

## Why Start Planning Now?

### The Power of Early Preparation
- **Average NBA career: 4.5 years** - Even successful careers end sooner than expected
- **90% of wealth is earned during playing years** - Smart planning now protects your future
- **Skills transfer better when identified early** - Your current experiences are tomorrow's assets
- **Networks are strongest while playing** - Build relationships when access is easiest

## Core Programs for Active Players

### 1. Financial Wellness Program
**Secure Your Economic Future**

Investment Education, Budget Management, Tax Planning, and Wealth Preservation strategies designed specifically for athletes.

### 2. Career Exploration Workshops
**Discover Your Next Passion**

Self-Assessment Tools, Industry Exposure, Shadow Programs, and Internship Opportunities to help you find your path.

### 3. Education & Skill Development
**Invest in Your Intellectual Capital**

Degree Completion Programs, Professional Certifications, and Executive Education opportunities with flexible scheduling.

### 4. Mental Health & Identity Work
**Strengthen Your Psychological Foundation**

Identity Beyond Basketball, Stress Management, and comprehensive support for your mental well-being.

## Take Action Today

### Contact Your Player Development Team
- **Email**: activeplayer@rpaconnect.org
- **Phone**: 1-800-RPA-NEXT
- **Text**: FUTURE to 55555

---

*"The best time to plant a tree was 20 years ago. The second best time is now."*

Start your transition planning today while you have the power, platform, and resources of an active player.

---

## NBRPA Resources for Active Players

### Financial Planning & Education
- [Contact NBRPA About Financial Programs](https://legendsofbasketball.com/contact/)
- [Learn About NBRPA Membership](https://legendsofbasketball.com/membership/)

### Health & Wellness
- [Contact NBRPA About Health Resources](https://legendsofbasketball.com/contact/)
- [About NBRPA Programs](https://legendsofbasketball.com/who-we-are/)

### Membership & Community
- [Join NBRPA Membership](https://www.legendsofbasketball.com/join)
- [NBRPA Events](https://www.legendsofbasketball.com/events/)

---

**Learn more about the NBA Retired Players Association at [LegendsofBasketball.com](https://legendsofbasketball.com)**`;

export const ActivePlayerPage: React.FC = () => {
  return (
    <MarkdownPage
      content={content}
      title="Active Player Journey"
      icon={UserCheck}
      accentColor="from-blue-500 to-blue-600"
    />
  );
};