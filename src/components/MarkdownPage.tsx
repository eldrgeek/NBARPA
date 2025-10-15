import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, CheckCircle } from 'lucide-react';

interface MarkdownPageProps {
  content: string;
  title: string;
  icon: React.ElementType;
  accentColor: string;
}

export const MarkdownPage: React.FC<MarkdownPageProps> = ({ 
  content, 
  title, 
  icon: Icon,
  accentColor 
}) => {
  const navigate = useNavigate();

  // Ensure page starts at top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-orange-600">
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
            
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${accentColor} flex items-center justify-center`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {title}
              </h1>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
          >
            <div className="prose prose-lg prose-invert max-w-none markdown-content">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({children}) => (
                      <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 mt-8 first:mt-0">
                        {children}
                      </h1>
                    ),
                    h2: ({children}) => (
                      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4 mt-8">
                        {children}
                      </h2>
                    ),
                    h3: ({children}) => (
                      <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 mt-6">
                        {children}
                      </h3>
                    ),
                    h4: ({children}) => (
                      <h4 className="text-lg md:text-xl font-semibold text-white mb-2 mt-4">
                        {children}
                      </h4>
                    ),
                    p: ({children}) => (
                      <p className="text-white/90 mb-4 leading-relaxed">
                        {children}
                      </p>
                    ),
                    ul: ({children}) => (
                      <ul className="list-disc list-inside text-white/90 mb-4 space-y-2 ml-4">
                        {children}
                      </ul>
                    ),
                    ol: ({children}) => (
                      <ol className="list-decimal list-inside text-white/90 mb-4 space-y-2 ml-4">
                        {children}
                      </ol>
                    ),
                    li: ({children}) => (
                      <li className="text-white/90">
                        {children}
                      </li>
                    ),
                    strong: ({children}) => (
                      <strong className="text-white font-semibold">
                        {children}
                      </strong>
                    ),
                    em: ({children}) => (
                      <em className="text-white/90 italic">
                        {children}
                      </em>
                    ),
                    blockquote: ({children}) => (
                      <blockquote className="border-l-4 border-orange-400 pl-4 my-6 italic text-white/80">
                        {children}
                      </blockquote>
                    ),
                    a: ({href, children}) => (
                      <a 
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-400 hover:text-orange-300 underline inline-flex items-center gap-1"
                      >
                        {children}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ),
                    hr: () => (
                      <hr className="border-white/20 my-8" />
                    ),
                    input: ({type}) => {
                      if (type === 'checkbox') {
                        return (
                          <span className="inline-flex items-center justify-center w-5 h-5 border-2 border-orange-400 rounded mr-2">
                            <CheckCircle className="w-3 h-3 text-orange-400" />
                          </span>
                        );
                      }
                      return null;
                    },
                  }}
                >
                  {content}
                </ReactMarkdown>
            </div>
          </motion.div>

          {/* Back to Top Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={scrollToTop}
            className="mt-8 mx-auto block px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all"
          >
            Back to Top
          </motion.button>
        </div>
      </div>
    </div>
  );
};