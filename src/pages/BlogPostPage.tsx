import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Clock, Share2, Heart, MessageCircle } from 'lucide-react';

interface BlogPostContent {
  id: string;
  title: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
}

const blogPosts: Record<string, BlogPostContent> = {
  'greg-foster-letter': {
    id: 'greg-foster-letter',
    title: 'A Letter to My Brothers: Finding Strength in Brotherhood',
    author: 'Greg Foster',
    date: '2024-12-15',
    readTime: '5 min read',
    category: 'Brotherhood',
    content: `
# Dear Brothers,

As I sit here reflecting on my journey from the hardwood to where I am today, I'm reminded of a fundamental truth that has carried me through every challenge, every triumph, and every moment of uncertainty: **we are stronger together**.

## The Game Taught Us More Than We Realized

When we stepped onto that court, we weren't just playing basketball. We were learning the art of trust, the power of collective effort, and the beauty of lifting each other up. Every assist was a lesson in selflessness. Every screen was an act of protection. Every celebration was a shared victory.

But somewhere along the way, when the final buzzer sounded on our playing careers, many of us forgot these lessons. We scattered to the winds, carrying our individual burdens, facing our personal struggles in isolation.

## The Brotherhood Never Ended

Here's what I've learned: **the game may have ended, but the brotherhood never did.**

The same principles that made us successful on the court are the ones that can carry us through the challenges of life after basketball:

### Trust Your Teammates
In life, just as in basketball, you can't do it alone. Whether it's dealing with financial challenges, relationship struggles, or finding new purpose, your brothers have your back. We've all walked similar paths, faced similar demons, and discovered similar truths.

### Call the Right Plays
Sometimes you need to run a different offense. Maybe the isolation plays that worked in your twenties don't work in your forties. That's okay. The best teams adapt. The best players evolve. And the best brothers help each other learn new plays.

### Celebrate Every Victory
We've learned to honor the big moments – the championships, the All-Star selections, the record-breaking nights. But life's victories are often quieter: a conversation that saves a marriage, a piece of advice that prevents a financial disaster, a phone call that reminds someone they're not alone.

## What Brotherhood Really Means

Brotherhood isn't just about sharing war stories from our playing days. It's about:

- **Being present** when a brother is struggling with transition
- **Sharing wisdom** when someone is facing unfamiliar territory
- **Offering accountability** when old habits threaten new growth
- **Providing encouragement** when the path forward seems unclear
- **Creating space** for vulnerability and honest conversation

## The Camaraderie Pillar Lives in Us

Antonio Davis talks about Camaraderie as one of The RPA's Five Pillars, and I couldn't agree more. This isn't just a nice idea – it's a lifeline. When we actively cultivate brotherhood, we create a network of strength that can catch any one of us when we fall.

I've seen brothers save brothers from financial ruin. I've watched former teammates help each other navigate divorce, job loss, and identity crisis. I've witnessed the power of a simple phone call to remind someone that their life has value beyond basketball.

## The Assist That Matters Most

Here's my challenge to each of you, my brothers: **Make the assist that matters most.**

Reach out to that teammate you haven't spoken to in years. Check on the brother who's been quiet lately. Share your story with someone who might be walking the same difficult path you once traveled.

Your greatest assist might not happen on a basketball court. It might happen in a coffee shop, over a phone call, or in a text message that arrives at exactly the right moment.

## We Rise Together

The NBA taught us that individual talent is good, but championship teams are built on something deeper. They're built on trust, sacrifice, communication, and an unwavering commitment to each other's success.

Life after basketball is our championship run, and we're all on the same team.

Let's play like champions. Let's protect each other. Let's celebrate each other. Let's remember that the brotherhood we built on the court was never meant to end when we took off the jersey for the last time.

**Together, we are unstoppable. Separated, we struggle.**

The choice is ours.

With love and respect for all my brothers,

**Greg Foster**

---

*Greg Foster is a former NBA player and current advocate for player transition support. He serves on the advisory board for RPA Connect and is passionate about building strong community networks among NBA alumni.*

## Join the Conversation

This is more than just a blog post – it's a call to action. If Greg's words resonated with you, consider:

- Reaching out to a former teammate
- Sharing your own story of brotherhood
- Getting involved with RPA Connect's community initiatives
- Attending one of our Brotherhood events

*What does brotherhood mean to you? Share your thoughts in the comments below or connect with us on social media.*
    `
  },
  'antonio-davis-vision': {
    id: 'antonio-davis-vision',
    title: 'Building the Five Pillars: A Vision for Holistic Player Support',
    author: 'Antonio Davis',
    date: '2024-12-10',
    readTime: '8 min read',
    category: 'Five Pillars',
    content: `
# Building the Five Pillars: A Vision for Holistic Player Support

Twenty years ago, when I was grinding through my NBA career, I thought success was measured in points, rebounds, and championship rings. I was wrong. Today, I understand that true success is measured by how well we prepare our brothers for the life that comes after the final buzzer.

## The Wake-Up Call

The statistics are sobering, and they demand our attention:

- **60% of NBA players face financial difficulties within five years of retirement**
- **Over 70% struggle with identity and purpose after their playing careers end**
- **Mental health challenges affect nearly 80% of retired players**
- **Family relationships suffer in 65% of cases during the transition**

These aren't just numbers – they're our brothers, our friends, our community. And they represent a systemic failure that we have the power to change.

## Why a Holistic Approach?

During my playing days, I experienced firsthand how interconnected our challenges really are. A financial stress would affect my performance on the court. Performance struggles would strain my family relationships. Family tension would impact my mental health. It was all connected.

That's when I realized: **you can't address these challenges in isolation.** You need a comprehensive, integrated approach that recognizes the whole person, not just the player.

## The Five Pillars Framework

After years of research, consultation with experts, and countless conversations with retired players, I developed what I call The RPA's Five Pillars model. Each pillar is essential, and together they create a foundation strong enough to support any player through any transition.

### Pillar 1: Camaraderie - Celebrate Legacy and Continue to Be a Home

**The brotherhood never ends.** This pillar is about maintaining and strengthening the bonds that were forged in competition. It's about creating spaces where players can be vulnerable, share experiences, and support each other through challenges.

*Key Elements:*
- Alumni networks and regular gatherings
- Mentorship programs pairing recent retirees with veteran alumni
- Legacy celebration events that honor contributions beyond statistics
- Peer support groups for specific challenges (divorce, financial crisis, career transition)

### Pillar 2: Health - Cultivate Lifelong Mental and Physical Wellness

**Your body and mind are your greatest assets, long after basketball.** This pillar addresses both the physical toll of a professional sports career and the mental health challenges that often accompany major life transitions.

*Key Elements:*
- Comprehensive health screenings and ongoing medical support
- Mental health resources with sports psychology expertise
- Addiction recovery and prevention programs
- Fitness and nutrition guidance for life after elite athletics

### Pillar 3: Finance - Foster Stability and Resilient Futures

**Financial literacy is your most important playbook.** This pillar provides education, resources, and ongoing support to help players build and maintain wealth that extends far beyond their playing careers.

*Key Elements:*
- Financial education starting from rookie year
- Access to trusted financial advisors with sports expertise
- Investment opportunities and business development support
- Emergency financial assistance and crisis intervention

### Pillar 4: Community - Uplift Our Youth and Our Communities

**Your platform is a privilege with purpose.** This pillar helps players understand and maximize their potential for positive community impact, creating meaning and purpose beyond individual achievement.

*Key Elements:*
- Community development and investment opportunities
- Youth mentorship and basketball programs
- Educational initiatives and scholarship programs
- Civic engagement and leadership development

### Pillar 5: Family - Nurture Families and Generational Journeys

**Your greatest victory is a strong family.** This pillar recognizes that player success is deeply connected to family health and provides support for the unique challenges that sports families face.

*Key Elements:*
- Marriage and relationship counseling with sports family expertise
- Parenting resources for raising children in the public eye
- Extended family education about sports careers and transitions
- Estate planning and generational wealth strategies

## From Vision to Reality: 2025+ Game-Winning Execution

The Five Pillars aren't just a theoretical framework – they're a practical roadmap for action. Here's how we're bringing this vision to life:

### Immediate Initiatives (2025+)
- **Signature In-Person Events:** Annual Five Pillars Summit, regional brotherhood gatherings, family retreats
- **Health Screenings:** Comprehensive annual health assessments for all RPA Connect members
- **Financial Education:** Monthly workshops, one-on-one financial planning sessions
- **Basketball Programs:** Youth leagues, skills camps, coaching development
- **Scholarships:** RPA Connect scholarship fund for player families and community youth

### Long-Term Vision (2026+)
- **Digital Engagement Platform:** Comprehensive app and website connecting all services
- **Physical Health Resources:** Network of sports medicine specialists and rehabilitation centers
- **Discount Network:** Exclusive access to services and products for RPA Connect members
- **Chapter-Led Causes:** Local RPA chapters driving community-specific initiatives
- **Family Care Hub:** Comprehensive services including estate planning, childcare, and elder care

## Why This Matters to Every Player

Whether you're a rookie just entering the league or a veteran planning your retirement, The RPA's Five Pillars model offers something essential: **a framework for thinking about your whole life, not just your basketball career.**

### For Active Players:
- Start building these foundations now, while you have resources and time
- Create sustainable habits and relationships that will serve you later
- Begin developing interests and skills beyond basketball
- Establish financial systems that will grow with you

### For Recent Retirees:
- Access immediate support for the challenges you're facing right now
- Connect with others who understand your unique experience
- Develop new sources of purpose and identity
- Build on the foundation you already have

### For Veteran Alumni:
- Share your wisdom and experience with younger players
- Continue growing in areas you may have neglected
- Find new ways to contribute to the community that supported you
- Leave a legacy that extends beyond your playing career

## The Collective Impact

When we implement The RPA's Five Pillars model effectively, we don't just help individual players – we transform entire communities. Former NBA players become:

- **Community leaders** who drive positive change
- **Financial examples** who build generational wealth
- **Family anchors** who create stable, loving homes
- **Mental health advocates** who break stigmas and encourage help-seeking
- **Brotherhood builders** who support and uplift each other

## The Call to Action

This vision can only become reality with collective commitment. Here's how you can be part of The RPA's Five Pillars movement:

### For Players:
1. **Assess yourself honestly** across all five pillars
2. **Engage actively** with RPA Connect programs and initiatives
3. **Share your story** to help others learn from your experience
4. **Mentor others** who are facing challenges you've overcome
5. **Advocate for comprehensive support** in all NBA-related organizations

### For Organizations:
1. **Adopt holistic approaches** that address interconnected challenges
2. **Invest in long-term solutions** rather than short-term fixes
3. **Measure success comprehensively** across all life domains
4. **Create sustainable funding** for ongoing support
5. **Collaborate actively** with other organizations serving the same community

## From Warm-Up to Buzzer

The RPA's Five Pillars model represents more than just a support system – it's a philosophy of life that recognizes the complexity and interconnectedness of human experience. It acknowledges that NBA players are whole people with multifaceted needs, deserving of comprehensive support that honors their full humanity.

**From warm-up to buzzer, we're focused on making every play count for our members.**

This isn't just about surviving the transition from basketball – it's about thriving in every aspect of life. It's about building a community of champions who support each other on and off the court. It's about creating a legacy that extends far beyond individual achievements.

The game of basketball gave us a platform. The RPA's Five Pillars give us a purpose.

Let's build this together.

**Antonio Davis**  
*Founder, RPA Connect*  
*Champion of the Five Pillars*

---

*Want to learn more about The RPA's Five Pillars model? Explore each pillar in detail on our website or attend one of our upcoming events. Together, we're building a stronger future for every NBA player.*
    `
  }
};

export const BlogPostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  const post = postId ? blogPosts[postId] : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-orange-600 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
          <p className="text-white/70 mb-6">The blog post you're looking for doesn't exist.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/blog')}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium"
          >
            Back to Blog
          </motion.button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-orange-600">
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Blog</span>
            </motion.button>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
              <div className="mb-4">
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {post.category}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-white/60 text-sm mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/20">
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                    <span>{Math.floor(Math.random() * 100) + 20}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>{Math.floor(Math.random() * 30) + 5}</span>
                  </motion.button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8"
          >
            <div 
              className="prose prose-invert prose-orange max-w-none prose-headings:text-white prose-p:text-white/80 prose-strong:text-white prose-li:text-white/80 prose-blockquote:text-white/70 prose-blockquote:border-orange-500"
              dangerouslySetInnerHTML={{ 
                __html: post.content
                  .split('\n')
                  .map(line => {
                    if (line.startsWith('# ')) {
                      return `<h1 class="text-3xl font-bold text-white mb-6">${line.substring(2)}</h1>`;
                    } else if (line.startsWith('## ')) {
                      return `<h2 class="text-2xl font-semibold text-white mb-4 mt-8">${line.substring(3)}</h2>`;
                    } else if (line.startsWith('### ')) {
                      return `<h3 class="text-xl font-semibold text-white mb-3 mt-6">${line.substring(4)}</h3>`;
                    } else if (line.startsWith('#### ')) {
                      return `<h4 class="text-lg font-semibold text-white mb-2 mt-4">${line.substring(5)}</h4>`;
                    } else if (line.startsWith('- ')) {
                      return `<li class="text-white/80 mb-1">${line.substring(2)}</li>`;
                    } else if (line.includes('**') && line.includes('**')) {
                      return `<p class="text-white/80 mb-4 leading-relaxed">${line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')}</p>`;
                    } else if (line.startsWith('*') && line.endsWith('*') && !line.includes('**')) {
                      return `<p class="text-white/60 italic mb-4">${line.substring(1, line.length - 1)}</p>`;
                    } else if (line.trim() === '---') {
                      return `<hr class="border-white/20 my-8" />`;
                    } else if (line.trim().length > 0) {
                      return `<p class="text-white/80 mb-4 leading-relaxed">${line}</p>`;
                    }
                    return '<br />';
                  })
                  .join('')
              }}
            />
          </motion.div>

          {/* Related Posts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <h3 className="text-2xl font-semibold text-white mb-6">Continue Reading</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/blog')}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
              >
                View All Posts
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/five-pillars')}
                className="border border-white/30 hover:border-white/50 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Explore Five Pillars
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};