import React from 'react';
import { AnimeSearchResult } from '../types';
import { Star } from 'lucide-react';

interface AnimeCardProps {
  anime: AnimeSearchResult;
  onClick: (anime: AnimeSearchResult) => void;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onClick }) => {
  return (
    <div 
      className="group relative cursor-pointer flex flex-col gap-3"
      onClick={() => onClick(anime)}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-zinc-900 shadow-lg ring-1 ring-white/5 transition-all duration-300 group-hover:ring-indigo-500/50 group-hover:shadow-indigo-500/10 group-hover:-translate-y-1">
        <img 
          src={anime.poster || 'https://picsum.photos/300/450'} 
          alt={anime.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {anime.score && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md flex items-center gap-1 border border-white/10 shadow-sm">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-medium text-white">{anime.score}</span>
          </div>
        )}

        {anime.type && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-indigo-500/80 backdrop-blur-sm rounded text-[10px] font-bold uppercase tracking-wider text-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {anime.type}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-zinc-200 line-clamp-1 group-hover:text-indigo-400 transition-colors">
          {anime.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          {anime.year && <span>{anime.year}</span>}
          {anime.year && anime.episodes && <span>•</span>}
          {anime.episodes && <span>{anime.episodes} eps</span>}
        </div>
      </div>
    </div>
  );
};