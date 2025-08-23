import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, ArrowRight, Heart, MessageCircle } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image?: string;
  featured?: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: 'greg-foster-letter',
    title: 'A Letter to My Brothers: Finding Strength in Brotherhood',
    excerpt: 'Greg Foster shares his heartfelt message about the power of community and mutual support among NBA alumni, emphasizing that our greatest victories come not from individual achievements, but from lifting each other up.',
    author: 'Greg Foster',
    date: '2024-12-15',
    readTime: '5 min read',
    category: 'Brotherhood',
    featured: true
  },
  {
    id: 'antonio-davis-vision',
    title: 'Building the Five Pillars: A Vision for Holistic Player Support',
    excerpt: 'Antonio Davis outlines his comprehensive approach to supporting NBA players through The RPA\'s Five Pillars model, addressing the critical need for structured support systems that extend far beyond the basketball court.',
    author: 'Antonio Davis',
    date: '2024-12-10',
    readTime: '8 min read',
    category: 'Five Pillars'
  },
  {
    id: 'transition-challenges',
    title: 'The Hidden Challenges of Retirement: What Every Player Should Know',
    excerpt: 'An in-depth look at the psychological, financial, and social challenges that NBA players face during retirement, and how proper preparation can make all the difference.',
    author: 'RPA Connect Team',
    date: '2024-12-05',
    readTime: '6 min read',
    category: 'Transition'
  },
  {
    id: 'family-first',
    title: 'Family First: Nurturing Relationships That Last Beyond Basketball',
    excerpt: 'Exploring how NBA players can build and maintain strong family relationships that provide foundation and purpose throughout their careers and beyond.',
    author: 'Dr. Sarah Williams',
    date: '2024-11-28',
    readTime: '7 min read',
    category: 'Family'
  },
  {
    id: 'financial-literacy',
    title: 'Financial Literacy: Your Most Important Playbook',
    excerpt: 'Essential financial strategies and principles that every NBA player should understand to secure their financial future and build generational wealth.',
    author: 'Marcus Johnson, CFP',
    date: '2024-11-20',
    readTime: '10 min read',
    category: 'Finance'
  },
  {
    id: 'mental-health-matters',
    title: 'Mental Health Matters: Breaking the Stigma in Professional Sports',
    excerpt: 'Addressing the critical importance of mental health support for athletes and creating a culture where seeking help is seen as a sign of strength, not weakness.',
    author: 'Dr. Michael Chen',
    date: '2024-11-15',
    readTime: '9 min read',
    category: 'Health'
  }
];

export const BlogPage: React.FC = () => {
  const navigate = useNavigate();

  const handlePostClick = (postId: string) => {
    navigate(`/blog/${postId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const featuredPost = blogPosts.find(post => post.featured);
  const otherPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-orange-600">
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
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
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </motion.button>
            </div>

            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                RPA Connect Blog
              </h1>
              <p className="text-white/70 text-lg max-w-3xl mx-auto">
                Insights, stories, and guidance from NBA alumni, experts, and the RPA Connect community. 
                Discover strategies for thriving beyond basketball.
              </p>
            </div>
          </motion.div>

          {/* Featured Post */}
          {featuredPost && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      FEATURED
                    </span>
                    <span className="text-white/60 text-sm">{featuredPost.category}</span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    {featuredPost.title}
                  </h2>
                  
                  <p className="text-white/70 text-lg mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-white/60 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(featuredPost.date)}</span>
                      </div>
                      <span>{featuredPost.readTime}</span>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePostClick(featuredPost.id)}
                      className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
                    >
                      <span>Read Full Post</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Recent Posts Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-semibold text-white mb-8 text-center">
              Recent Posts
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handlePostClick(post.id)}
                  className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 cursor-pointer hover:bg-white/15 transition-all"
                >
                  <div className="mb-4">
                    <span className="text-orange-300 text-xs font-medium bg-orange-500/20 px-2 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-white/70 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-white/60 text-xs">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-xs">{post.readTime}</span>
                      <div className="flex items-center gap-4 text-white/40">
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          <span className="text-xs">{Math.floor(Math.random() * 50) + 10}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          <span className="text-xs">{Math.floor(Math.random() * 20) + 2}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              Stay Connected
            </h2>
            <p className="text-orange-100 mb-6">
              Get the latest insights and stories delivered directly to your inbox. 
              Join our community of NBA alumni and supporters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-all"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};