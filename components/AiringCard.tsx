import React from 'react';
import { AiringAnime } from '../types';
import { Play } from 'lucide-react';

interface AiringCardProps {
  anime: AiringAnime;
  onClick: (anime: AiringAnime) => void;
}

export const AiringCard: React.FC<AiringCardProps> = ({ anime, onClick }) => {
  return (
    <div 
      className="group relative cursor-pointer flex flex-col gap-3"
      onClick={() => onClick(anime)}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-900 shadow-lg ring-1 ring-white/5 transition-all duration-300 group-hover:ring-indigo-500/50 group-hover:shadow-indigo-500/10 group-hover:-translate-y-1">
        <img 
          src={anime.snapshot || 'https://picsum.photos/300/169'} 
          alt={anime.anime_title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        
        {/* Play Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[1px]">
             <div className="w-10 h-10 rounded-full border border-white flex items-center justify-center bg-black/40">
                <Play className="w-4 h-4 fill-white text-white ml-0.5" />
             </div>
        </div>

        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
             <div className="px-2 py-0.5 bg-indigo-500/90 backdrop-blur-sm rounded text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                Episode {anime.episode}
             </div>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-zinc-200 line-clamp-1 group-hover:text-indigo-400 transition-colors" title={anime.anime_title}>
          {anime.anime_title}
        </h3>
        <div className="flex items-center justify-between text-xs text-zinc-500">
           <span>{new Date(anime.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
           {anime.fansub && <span className="opacity-70">{anime.fansub}</span>}
        </div>
      </div>
    </div>
  );
};