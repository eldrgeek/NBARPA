import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Image, Users, Calendar, MapPin, Filter } from 'lucide-react';

interface GalleryItem {
  id: string;
  type: 'video' | 'photo';
  title: string;
  description: string;
  category: string;
  date: string;
  location?: string;
  thumbnail: string;
  videoUrl?: string;
  featured?: boolean;
}

const galleryItems: GalleryItem[] = [
  {
    id: 'brotherhood-retreat-2024',
    type: 'video',
    title: 'RPA Connect Brotherhood Retreat 2024',
    description: 'Highlights from our annual brotherhood retreat where NBA alumni came together to share experiences, build connections, and support each other.',
    category: 'Events',
    date: '2024-11-15',
    location: 'Napa Valley, CA',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop',
    videoUrl: 'https://example.com/brotherhood-retreat',
    featured: true
  },
  {
    id: 'antonio-davis-keynote',
    type: 'video',
    title: 'RPA Five Pillars Keynote',
    description: 'RPA Connect founder Antonio Davis delivers an inspiring keynote about The RPA\'s Five Pillars model and the future of player support.',
    category: 'Keynotes',
    date: '2024-10-20',
    location: 'Chicago, IL',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop',
    videoUrl: 'https://example.com/antonio-keynote'
  },
  {
    id: 'financial-workshop',
    type: 'photo',
    title: 'Financial Literacy Workshop',
    description: 'NBA alumni participating in a comprehensive financial literacy workshop, learning investment strategies and wealth management.',
    category: 'Workshops',
    date: '2024-09-30',
    location: 'New York, NY',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop'
  },
  {
    id: 'youth-basketball-camp',
    type: 'video',
    title: 'Community Youth Basketball Camp',
    description: 'Former NBA players mentor young athletes at our annual community basketball camp, teaching skills and life lessons.',
    category: 'Community',
    date: '2024-08-15',
    location: 'Los Angeles, CA',
    thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=450&fit=crop',
    videoUrl: 'https://example.com/youth-camp'
  },
  {
    id: 'health-screening',
    type: 'photo',
    title: 'Annual Health Screening Day',
    description: 'Comprehensive health screenings for RPA Connect members, focusing on post-career wellness and preventive care.',
    category: 'Health',
    date: '2024-07-20',
    location: 'Atlanta, GA',
    thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=450&fit=crop'
  },
  {
    id: 'family-day',
    type: 'photo',
    title: 'RPA Connect Family Day',
    description: 'A special day celebrating the families of NBA alumni, with activities for all ages and support for family wellness.',
    category: 'Family',
    date: '2024-06-10',
    location: 'Orlando, FL',
    thumbnail: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=450&fit=crop'
  },
  {
    id: 'mentorship-panel',
    type: 'video',
    title: 'Mentorship Panel Discussion',
    description: 'Veteran NBA alumni share their experiences and insights with recent retirees in this powerful panel discussion.',
    category: 'Mentorship',
    date: '2024-05-25',
    location: 'Phoenix, AZ',
    thumbnail: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&h=450&fit=crop',
    videoUrl: 'https://example.com/mentorship-panel'
  },
  {
    id: 'scholarship-ceremony',
    type: 'photo',
    title: 'Annual Scholarship Awards Ceremony',
    description: 'Celebrating the achievements of scholarship recipients and their families at our annual awards ceremony.',
    category: 'Education',
    date: '2024-04-15',
    location: 'Washington, DC',
    thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=450&fit=crop'
  },
  {
    id: 'community-investment',
    type: 'photo',
    title: 'Community Investment Project',
    description: 'NBA alumni partnering with local organizations to invest in community development and youth programs.',
    category: 'Community',
    date: '2024-03-20',
    location: 'Detroit, MI',
    thumbnail: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=450&fit=crop'
  },
  {
    id: 'wellness-retreat',
    type: 'video',
    title: 'Mental Health and Wellness Retreat',
    description: 'A transformative retreat focusing on mental health, meditation, and holistic wellness for NBA alumni.',
    category: 'Health',
    date: '2024-02-14',
    location: 'Sedona, AZ',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop',
    videoUrl: 'https://example.com/wellness-retreat'
  }
];

const categories = ['All', 'Events', 'Workshops', 'Community', 'Health', 'Family', 'Mentorship', 'Education', 'Keynotes'];

export const GalleryPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredItems = selectedCategory === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const featuredItem = galleryItems.find(item => item.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-orange-600">
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
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

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-white/60'}`}
                  >
                    <Image className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/60'}`}
                  >
                    <Users className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                RPA Connect Gallery
              </h1>
              <p className="text-white/70 text-lg max-w-3xl mx-auto">
                Explore moments, memories, and milestones from our community of NBA alumni. 
                From brotherhood events to community impact, see the stories that define us.
              </p>
            </div>

            {/* Filter Categories */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Featured Item */}
          {featuredItem && selectedCategory === 'All' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
                <div className="relative">
                  <img
                    src={featuredItem.thumbnail}
                    alt={featuredItem.title}
                    className="w-full h-64 md:h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    {featuredItem.type === 'video' && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                      >
                        <Play className="w-8 h-8 ml-1" />
                      </motion.button>
                    )}
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      FEATURED
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-3 text-white/60 text-sm">
                    <span className="bg-white/20 px-2 py-1 rounded text-xs">{featuredItem.category}</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(featuredItem.date)}</span>
                    </div>
                    {featuredItem.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{featuredItem.location}</span>
                      </div>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">
                    {featuredItem.title}
                  </h2>
                  <p className="text-white/70 leading-relaxed">
                    {featuredItem.description}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Gallery Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">
                {selectedCategory === 'All' ? 'All Content' : selectedCategory}
                <span className="text-white/60 text-base ml-2">
                  ({filteredItems.length} items)
                </span>
              </h2>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden cursor-pointer hover:bg-white/15 transition-all"
                  >
                    <div className="relative">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        {item.type === 'video' && (
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center text-white">
                            <Play className="w-5 h-5 ml-1" />
                          </div>
                        )}
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className="bg-black/50 text-white text-xs px-2 py-1 rounded">
                          {item.type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2 text-white/60 text-xs">
                        <span className="bg-white/20 px-2 py-1 rounded">{item.category}</span>
                        <span>{formatDate(item.date)}</span>
                      </div>
                      <h3 className="text-white font-semibold mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-white/70 text-sm line-clamp-3">
                        {item.description}
                      </p>
                      {item.location && (
                        <div className="flex items-center gap-1 mt-2 text-white/60 text-xs">
                          <MapPin className="w-3 h-3" />
                          <span>{item.location}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 cursor-pointer hover:bg-white/15 transition-all"
                  >
                    <div className="flex gap-6">
                      <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        {item.type === 'video' && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <Play className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2 text-white/60 text-sm">
                          <span className="bg-white/20 px-2 py-1 rounded text-xs">{item.category}</span>
                          <span className="bg-black/30 text-white text-xs px-2 py-1 rounded">
                            {item.type.toUpperCase()}
                          </span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(item.date)}</span>
                          </div>
                          {item.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{item.location}</span>
                            </div>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {item.title}
                        </h3>
                        <p className="text-white/70 text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Be Part of the Story
              </h2>
              <p className="text-orange-100 mb-6">
                Join RPA Connect and become part of a community that's creating positive change. 
                Your story matters, and together we can build something extraordinary.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/welcome')}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-all"
                >
                  Join Our Community
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/five-pillars')}
                  className="border border-white/30 hover:border-white/50 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Learn About Five Pillars
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};