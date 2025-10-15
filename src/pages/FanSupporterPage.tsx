import React from 'react';
import { MarkdownPage } from '../components/MarkdownPage';
import { Star } from 'lucide-react';

const content = `# Fan & Supporter Hub

## Support the Players Who Gave Us Everything

For years, NBA players have given us unforgettable moments, inspired our dreams, and brought communities together. Now, as they transition to life after basketball, it's our turn to support them. Learn how you can make a difference in the lives of the players who made a difference in ours.

## The Reality of Life After Basketball

### Behind the Highlights
While we see the glamorous side of NBA life, the reality for many retired players is challenging:

- **60% of NBA players** face financial difficulty within 5 years of retirement
- **Average career length**: Just 4.5 years
- **Mental health struggles**: 26% experience depression post-retirement
- **Identity crisis**: 83% struggle with "Who am I without basketball?"
- **Physical challenges**: Chronic pain affects 78% of retired players

## How Fans Can Make a Difference

### 1. Follow Player Journeys
Stay connected with players beyond the court through social media support, attending player events, and amplifying their new ventures.

### 2. Support Player Businesses
Vote with your wallet by purchasing products from player-owned businesses, using their services, and leaving positive reviews.

### 3. Contribute to the Cause
Support the RPA Transition Fund with monthly giving starting at $10/month, or sponsor specific services through our Adopt-a-Player Program.

### 4. Volunteer Your Skills
Offer pro bono professional services, mentorship opportunities, or industry-specific guidance to help players transition.

### 5. Advocacy & Awareness
Be a voice for player welfare by spreading awareness, challenging stereotypes, and promoting mental health support.

## Fan Community Initiatives

### RPA Fan Council
Join our official fan support network with monthly virtual meetings, exclusive player interactions, and voting rights on community initiatives.

### Regional Fan Chapters
Connect with local supporters through chapter activities, player appearances, community service projects, and networking events.

### Digital Fan Community
- **Discord Server**: Daily discussions and updates
- **Facebook Groups**: Regional and interest-based communities
- **Reddit Community**: r/NBATransitionSupport
- **Twitter Campaigns**: Coordinated support initiatives

## Take Action Today

### 5 Things You Can Do Right Now
1. **Follow 5 retired players** on social media
2. **Donate $25** to the Transition Fund
3. **Share this page** with 3 friends
4. **Sign up** for our newsletter
5. **Join** a local fan chapter

### Quick Donation Options
- **Text**: SUPPORT to 55555 to donate $10
- **Venmo**: @RPA-Support
- **PayPal**: support@rpaconnect.org
- **Website**: rpaconnect.org/donate

## Stay Connected

### Contact Us
- **Email**: fans@rpaconnect.org
- **Phone**: 1-800-FAN-HELP
- **Social Media**: @RPAFanSupport

---

*"The roar of the crowd doesn't have to end with retirement. Your support echoes into their next chapter."*

**Every fan can make a difference.** Join thousands of supporters helping NBA players transition successfully to life after basketball.`;

export const FanSupporterPage: React.FC = () => {
  return (
    <MarkdownPage
      content={content}
      title="Fan & Supporter Hub"
      icon={Star}
      accentColor="from-yellow-500 to-yellow-600"
    />
  );
};