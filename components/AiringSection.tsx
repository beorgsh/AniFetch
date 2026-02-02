import React, { useEffect, useState } from 'react';
import { AiringAnime, AnimeSearchResult } from '../types';
import { getAiringAnime } from '../services/api';
import { AiringCard } from './AiringCard';
import { ChevronLeft, ChevronRight, Clock, Loader2 } from 'lucide-react';

interface AiringSectionProps {
  onAnimeClick: (anime: AnimeSearchResult) => void;
}

export const AiringSection: React.FC<AiringSectionProps> = ({ onAnimeClick }) => {
  const [airingList, setAiringList] = useState<AiringAnime[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let mounted = true;
    const fetchAiring = async () => {
      setLoading(true);
      const data = await getAiringAnime(page);
      if (mounted && data) {
        setAiringList(data.data);
        setTotalPages(data.last_page);
        setLoading(false);
      }
    };
    fetchAiring();
    return () => { mounted = false; };
  }, [page]);

  const handleCardClick = (airing: AiringAnime) => {
    // Convert AiringAnime to AnimeSearchResult format for the SeriesView
    const mappedAnime: AnimeSearchResult = {
      id: airing.anime_id,
      title: airing.anime_title,
      poster: airing.snapshot, // Use snapshot as placeholder, SeriesView will try to fetch better img
      session: airing.anime_session,
      year: new Date(airing.created_at).getFullYear(),
      episodes: airing.episode,
      status: 'Airing'
    };
    onAnimeClick(mappedAnime);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
        setPage(newPage);
        const element = document.getElementById('airing-section');
        if (element) {
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    }
  };

  return (
    <div id="airing-section" className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
             <Clock className="w-5 h-5 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-white">Just Updated</h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
           {[...Array(8)].map((_, i) => (
             <div key={i} className="flex flex-col gap-3">
                <div className="aspect-video bg-zinc-800/50 rounded-xl animate-pulse"></div>
                <div className="h-4 bg-zinc-800/50 rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-zinc-800/50 rounded w-1/4 animate-pulse"></div>
             </div>
           ))}
        </div>
      ) : (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {airingList.map((anime) => (
                    <AiringCard 
                        key={anime.id} 
                        anime={anime} 
                        onClick={handleCardClick} 
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                    <button 
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium border border-zinc-700"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Prev
                    </button>
                    
                    <span className="text-sm font-medium text-zinc-400">
                        Page <span className="text-white">{page}</span> of <span className="text-white">{totalPages}</span>
                    </span>
                    
                    <button 
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium border border-zinc-700"
                    >
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </>
      )}
    </div>
  );
};