import React from 'react';
import { motion } from 'framer-motion';

interface PillarImageCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  icon: React.ElementType;
  color: string;
  bgGradient: string;
}

export const PillarImageCard: React.FC<PillarImageCardProps> = ({
  title,
  description,
  imageUrl,
  icon: Icon,
  color,
  bgGradient
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20"
    >
      {/* Image Section */}
      <div className={`relative h-48 bg-gradient-to-r ${bgGradient} flex items-center justify-center`}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-white">
            <Icon className="w-16 h-16 mb-4" />
            <div className="text-sm font-medium opacity-80">{title}</div>
          </div>
        )}
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
        <p className="text-white/70 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};