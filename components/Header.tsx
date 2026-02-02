import React from 'react';
import { MonitorPlay, Search, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onAuthClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAuthClick }) => {
  const { user, signOut } = useAuth();

  const scrollToSearch = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
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

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={scrollToSearch}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 text-zinc-400 hover:text-white hover:bg-white/5"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end mr-1">
                <span className="text-xs font-medium text-zinc-400">Signed in as</span>
                <span className="text-sm text-white max-w-[150px] truncate">{user.email}</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 text-indigo-400">
                <User className="w-4 h-4" />
              </div>
              <button
                onClick={() => signOut()}
                className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onAuthClick}
              className="flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};