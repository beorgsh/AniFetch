import React, { useState } from 'react';
import { MonitorPlay, LogOut, User, PlayCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';

export const Header: React.FC = () => {
  const { user, logOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleAuthAction = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      // Toggle dropdown or do nothing if we just want to show name
      setShowDropdown(!showDropdown);
    }
  };

  const handleLogout = async () => {
    await logOut();
    setShowDropdown(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => window.location.reload()}
          >
            <div className="bg-indigo-500/10 p-2 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
              <MonitorPlay className="w-5 h-5 text-indigo-500" />
            </div>
            <span className="text-lg font-bold tracking-tight text-zinc-100">AniFetch</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Watch Anime / Account Button */}
            <div className="relative">
              <button
                onClick={handleAuthAction}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  user 
                    ? 'bg-zinc-800/50 hover:bg-zinc-800 text-zinc-200 border border-white/5' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40'
                }`}
              >
                {user ? (
                  <>
                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <User className="w-3 h-3" />
                    </div>
                    <span className="max-w-[100px] sm:max-w-xs truncate">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-4 h-4" />
                    <span>Watch Anime</span>
                  </>
                )}
              </button>

              {/* User Dropdown */}
              {user && showDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowDropdown(false)}
                  ></div>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-3 border-b border-zinc-800/50">
                        <p className="text-xs text-zinc-500 uppercase font-semibold tracking-wider mb-1">Signed in as</p>
                        <p className="text-sm text-white truncate font-medium">{user.email}</p>
                    </div>
                    <div className="p-1">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};