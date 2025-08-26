import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Heart, 
  DollarSign, 
  Building, 
  User,
  LogIn,
  LogOut,
  FileText,
  Camera,
  ChevronDown,
  Star
} from 'lucide-react';

interface NavigationProps {
  isLoggedIn?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  isLoggedIn = false, 
  onLogin, 
  onLogout 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showPillarDropdown, setShowPillarDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setShowClientDropdown(false);
    setShowPillarDropdown(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const pillars = [
    { id: 'camaraderie', title: 'Camaraderie', icon: Heart, path: '/pillars/camaraderie' },
    { id: 'health', title: 'Health', icon: Heart, path: '/pillars/health' },
    { id: 'finance', title: 'Finance', icon: DollarSign, path: '/pillars/finance' },
    { id: 'community', title: 'Community', icon: Users, path: '/pillars/community' },
    { id: 'family', title: 'Family', icon: Heart, path: '/pillars/family' }
  ];

  const clientTypes = [
    { title: 'Retired Players', path: '/retired-player', icon: User },
    { title: 'Active Players', path: '/active-player', icon: Star },
    { title: 'Family Members', path: '/family', icon: Heart },
    { title: 'Business Partners', path: '/business', icon: Building },
    { title: 'Fans & Supporters', path: '/fan', icon: Users }
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center justify-between p-6 bg-gradient-to-r from-purple-900/95 via-purple-800/95 to-orange-600/95 backdrop-blur-lg border-b border-white/20 shadow-lg">
        <div 
          onClick={() => handleNavigation('/')}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">RPA</span>
          </div>
          <span className="text-white font-semibold text-xl">Connect</span>
        </div>

        <div className="flex items-center gap-8">
          <button
            onClick={() => handleNavigation('/')}
            className={`flex items-center gap-2 text-white hover:text-white transition-colors ${
              isActive('/') ? 'text-white font-bold' : 'text-white/90'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>

          {/* Five Pillars Dropdown */}
          <div className="relative">
            <button
              onMouseEnter={() => setShowPillarDropdown(true)}
              onMouseLeave={() => setShowPillarDropdown(false)}
              onClick={() => handleNavigation('/five-pillars')}
              className={`flex items-center gap-2 text-white hover:text-white transition-colors ${
                location.pathname.includes('/pillars') || isActive('/five-pillars') ? 'text-white font-bold' : 'text-white/90'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Five Pillars</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            
            <AnimatePresence>
              {showPillarDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  onMouseEnter={() => setShowPillarDropdown(true)}
                  onMouseLeave={() => setShowPillarDropdown(false)}
                  className="absolute top-full left-0 mt-2 w-56 bg-gradient-to-br from-purple-900 via-purple-800 to-orange-600 backdrop-blur-lg rounded-xl border border-white/30 py-2 z-50 shadow-2xl"
                >
                  <button
                    onClick={() => handleNavigation('/five-pillars')}
                    className="w-full px-4 py-2 text-left text-white hover:text-white hover:bg-white/20 transition-colors font-medium"
                  >
                    Overview
                  </button>
                  <div className="border-t border-white/20 my-2"></div>
                  {pillars.map((pillar) => {
                    const PillarIcon = pillar.icon;
                    return (
                      <button
                        key={pillar.id}
                        onClick={() => handleNavigation(pillar.path)}
                        className={`w-full px-4 py-2 text-left text-white hover:text-white hover:bg-white/20 transition-colors flex items-center gap-2 ${
                          isActive(pillar.path) ? 'text-white bg-white/25 font-medium' : ''
                        }`}
                      >
                        <PillarIcon className="w-4 h-4" />
                        {pillar.title}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Client Types Dropdown */}
          <div className="relative">
            <button
              onMouseEnter={() => setShowClientDropdown(true)}
              onMouseLeave={() => setShowClientDropdown(false)}
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>For You</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            
            <AnimatePresence>
              {showClientDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  onMouseEnter={() => setShowClientDropdown(true)}
                  onMouseLeave={() => setShowClientDropdown(false)}
                  className="absolute top-full left-0 mt-2 w-56 bg-gradient-to-br from-purple-900 via-purple-800 to-orange-600 backdrop-blur-lg rounded-xl border border-white/30 py-2 z-50 shadow-2xl"
                >
                  {clientTypes.map((client) => {
                    const ClientIcon = client.icon;
                    return (
                      <button
                        key={client.title}
                        onClick={() => handleNavigation(client.path)}
                        className={`w-full px-4 py-2 text-left text-white hover:text-white hover:bg-white/20 transition-colors flex items-center gap-2 ${
                          isActive(client.path) ? 'text-white bg-white/25 font-medium' : ''
                        }`}
                      >
                        <ClientIcon className="w-4 h-4" />
                        {client.title}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => handleNavigation('/blog')}
            className={`flex items-center gap-2 text-white hover:text-white transition-colors ${
              isActive('/blog') ? 'text-white font-bold' : 'text-white/90'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Blog</span>
          </button>

          <button
            onClick={() => handleNavigation('/gallery')}
            className={`flex items-center gap-2 text-white hover:text-white transition-colors ${
              isActive('/gallery') ? 'text-white font-bold' : 'text-white/90'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Gallery</span>
          </button>

          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/20">
            {isLoggedIn ? (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 text-white hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg border border-orange-400/30"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden sticky top-0 z-40 flex items-center justify-between p-4 bg-gradient-to-r from-purple-900/95 via-purple-800/95 to-orange-600/95 backdrop-blur-lg border-b border-white/20 shadow-lg">
        <div 
          onClick={() => handleNavigation('/')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">RPA</span>
          </div>
          <span className="text-white font-semibold">Connect</span>
        </div>

        <div className="flex items-center gap-2">
          {!isLoggedIn && (
            <button
              onClick={onLogin}
              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg font-medium transition-colors"
            >
              Login
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors border border-white/20"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-gradient-to-br from-purple-900 via-purple-800 to-orange-600 backdrop-blur-lg border-b border-white/20 overflow-hidden shadow-2xl"
          >
            <div className="p-4 space-y-2">
              <button
                onClick={() => handleNavigation('/')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  isActive('/') ? 'bg-white/25 text-white font-bold' : 'text-white hover:bg-white/15'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>

              <button
                onClick={() => handleNavigation('/five-pillars')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  isActive('/five-pillars') ? 'bg-white/25 text-white font-bold' : 'text-white hover:bg-white/15'
                }`}
              >
                <Heart className="w-5 h-5" />
                <span>Five Pillars</span>
              </button>

              {/* Mobile Pillars Submenu */}
              <div className="ml-8 space-y-1">
                {pillars.map((pillar) => {
                  const PillarIcon = pillar.icon;
                  return (
                    <button
                      key={pillar.id}
                      onClick={() => handleNavigation(pillar.path)}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors text-sm ${
                        isActive(pillar.path) ? 'bg-white/25 text-white font-bold' : 'text-white/90 hover:bg-white/15'
                      }`}
                    >
                      <PillarIcon className="w-4 h-4" />
                      <span>{pillar.title}</span>
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-white/20 my-2"></div>

              {/* Mobile Client Types */}
              <div className="space-y-1">
                <div className="text-white/90 text-sm font-bold px-3 py-1 border-b border-white/20 mb-1">For You</div>
                {clientTypes.map((client) => {
                  const ClientIcon = client.icon;
                  return (
                    <button
                      key={client.title}
                      onClick={() => handleNavigation(client.path)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                        isActive(client.path) ? 'bg-white/25 text-white font-bold' : 'text-white hover:bg-white/15'
                      }`}
                    >
                      <ClientIcon className="w-5 h-5" />
                      <span>{client.title}</span>
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-white/20 my-2"></div>

              <button
                onClick={() => handleNavigation('/blog')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  isActive('/blog') ? 'bg-white/25 text-white font-bold' : 'text-white hover:bg-white/15'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Blog</span>
              </button>

              <button
                onClick={() => handleNavigation('/gallery')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  isActive('/gallery') ? 'bg-white/20 text-white' : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <Camera className="w-5 h-5" />
                <span>Gallery</span>
              </button>

              <div className="border-t border-white/20 my-2"></div>

              {isLoggedIn ? (
                <button
                  onClick={() => {
                    onLogout?.();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg text-left text-white hover:bg-white/15 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onLogin?.();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg text-left bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold transition-all shadow-lg border border-orange-400/30"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Log In</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};