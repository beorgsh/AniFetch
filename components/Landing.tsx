import React from 'react';
import { Zap, PlayCircle, ShieldCheck, Download } from 'lucide-react';

interface LandingProps {
  onStartClick: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStartClick }) => {
  return (
    <div className="flex flex-col items-center text-center max-w-4xl mx-auto py-12 md:py-24 px-4">
      <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-500/10 mb-8 ring-1 ring-indigo-500/20 shadow-[0_0_50px_-10px_rgba(99,102,241,0.4)]">
          <Zap className="w-10 h-10 text-indigo-500" />
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500 mb-6 tracking-tight leading-tight">
          The Future of <br />Anime Fetching
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto text-xl leading-relaxed mb-10">
          Discover thousands of series, track airing schedules, and grab high-quality episode links with just a few clicks. Minimalist, fast, and free.
        </p>
        
        <button
          onClick={onStartClick}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-1 active:scale-95"
        >
          Get Started Now
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full">
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm">
          <PlayCircle className="w-8 h-8 text-indigo-400 mb-4 mx-auto" />
          <h3 className="text-lg font-bold text-white mb-2">Instant Streaming</h3>
          <p className="text-sm text-zinc-500">Quick access to the best streaming mirrors for every episode.</p>
        </div>
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm">
          <Download className="w-8 h-8 text-indigo-400 mb-4 mx-auto" />
          <h3 className="text-lg font-bold text-white mb-2">Easy Downloads</h3>
          <p className="text-sm text-zinc-500">Fetch high-quality download links from your favorite providers.</p>
        </div>
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm">
          <ShieldCheck className="w-8 h-8 text-indigo-400 mb-4 mx-auto" />
          <h3 className="text-lg font-bold text-white mb-2">Private & Secure</h3>
          <p className="text-sm text-zinc-500">No trackers, no intrusive ads. Just you and your anime.</p>
        </div>
      </div>
    </div>
  );
};