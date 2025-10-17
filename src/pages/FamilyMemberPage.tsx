import React from 'react';
import { MarkdownPage } from '../components/MarkdownPage';
import { Heart } from 'lucide-react';

const content = `# Family Member Support Hub

## Supporting Your Player Through Every Season

As the family member of an NBA player, you experience the unique joys and challenges of professional basketball from a different perspective. You're the constant through trades, injuries, wins, losses, and eventually, retirement. This journey affects you too, and we're here to support you.

## Understanding the Journey

### The Hidden Challenges Families Face
- **Frequent relocations** - Average of 3-4 moves during a career
- **Public scrutiny** - Living in the spotlight affects the whole family
- **Financial pressure** - Managing sudden wealth and requests for money
- **Time apart** - Road games, training camps, and seasons abroad
- **Identity shifts** - From "player's spouse/family" to finding your own path

### The Transition Impact on Families
- **60% of NBA marriages** end within 5 years of retirement
- **Children of players** often struggle with identity and pressure
- **78% of players** experience financial stress within 2 years of retirement
- **Family dynamics** change dramatically when the player is home full-time

## Programs for Family Members

### 1. Education & Empowerment
Build your own identity and skills through personal development, career counseling, entrepreneurship training, and financial literacy programs.

### 2. Relationship Support
Strengthen your family bonds with couples counseling, family therapy, and specialized support for navigating NBA life's unique pressures.

### 3. Community & Connection
Join peer support groups, mentorship programs, and connect with other NBA families who understand your journey.

### 4. Transition Preparation
Get ready for the next chapter with pre-retirement planning, post-retirement support, and guidance for the whole family.

## Children of Players: Special Support

We offer specialized programs for children of NBA players, including:
- Summer camps with other NBA kids
- College preparation and counseling
- Mental health support
- Career exploration beyond sports
- Financial literacy for generational wealth

## Crisis Support

### 24/7 Family Crisis Hotline
Available for domestic concerns, mental health emergencies, substance abuse issues, financial crises, and media or legal problems.

**Emergency Hotline: 1-800-CRISIS-1 (24/7)**

## Get Connected Today

### Contact Family Support Services
- **Email**: families@rpaconnect.org
- **Phone**: 1-800-FAM-NBA1
- **Text**: FAMILY to 55555

---

## NBRPA Resources for Families

### Financial Support & Education
- [Contact NBRPA About Family Scholarships](https://legendsofbasketball.com/contact/)
- [Learn About Member Benefits](https://legendsofbasketball.com/membership/)

### Health & Wellness
- [Contact NBRPA About Health Support](https://legendsofbasketball.com/contact/)
- [About NBRPA Programs](https://legendsofbasketball.com/who-we-are/)

### Community & Events
- [NBRPA Events](https://www.legendsofbasketball.com/events/)
- [Legends Care Programs](https://legendsofbasketball.com/legends-care/)

### Contact & Support
- [Get in Touch with NBRPA](https://legendsofbasketball.com/contact/)
- [Learn About NBRPA](https://legendsofbasketball.com/who-we-are/)

---

*"Behind every player is a family navigating this journey too. Your dreams, struggles, and successes matter just as much."*

You are not just a "player's family"—you are individuals with your own dreams, goals, and needs. We're here to support YOU.`;

export const FamilyMemberPage: React.FC = () => {
  return (
    <MarkdownPage
      content={content}
      title="Family Member Support"
      icon={Heart}
      accentColor="from-pink-500 to-pink-600"
    />
  );
};