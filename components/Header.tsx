import React from 'react';
import { MonitorPlay, Search } from 'lucide-react';

export const Header: React.FC = () => {
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

        <div className="flex items-center gap-4">
          <button
            onClick={scrollToSearch}
            className="flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search Anime</span>
          </button>
        </div>
      </div>
    </header>
  );
};