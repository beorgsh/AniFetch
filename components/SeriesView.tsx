import React, { useEffect, useState, useRef } from 'react';
import { AnimeSearchResult, SeriesDetails } from '../types';
import { getSeriesDetails } from '../services/api';
import { EpisodeList } from './EpisodeList';
import { ArrowLeft, Star, Layers, Tag, Calendar, ChevronLeft, ChevronRight, Search } from 'lucide-react';

interface SeriesViewProps {
  anime: AnimeSearchResult;
  onBack: () => void;
}

export const SeriesView: React.FC<SeriesViewProps> = ({ anime, onBack }) => {
  const [details, setDetails] = useState<SeriesDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchEp, setSearchEp] = useState('');
  const [targetEpisode, setTargetEpisode] = useState<string | null>(null);
  const episodesTopRef = useRef<HTMLDivElement>(null);
  const perPageRef = useRef<number>(0);

  useEffect(() => {
    let mounted = true;
    const loadDetails = async () => {
      setLoading(true);
      
      // If navigating pages manually (not via search jump), scroll to top of list
      if (page > 1 && !targetEpisode && episodesTopRef.current) {
        const offset = 100;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = episodesTopRef.current.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
      }

      const data = await getSeriesDetails(anime.session, page);
      if (mounted) {
        setDetails(data);
        setLoading(false);
        
        if (data) {
           if (data.page < data.total_pages) {
               perPageRef.current = data.episodes.length;
           } else if (perPageRef.current === 0 && data.total > 0 && data.total_pages > 0) {
               perPageRef.current = Math.ceil(data.total / data.total_pages);
           }
        }
      }
    };
    loadDetails();
    return () => { mounted = false; };
  }, [anime.session, page]); // Removed targetEpisode from dependency to prevent scroll conflict

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && details && newPage <= details.total_pages) {
      setPage(newPage);
      setTargetEpisode(null); // Clear target when manually changing pages
    }
  };

  const handleEpisodeJump = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEp || !details) return;
    
    const epNum = parseInt(searchEp);
    if (isNaN(epNum)) return;

    const pageSize = perPageRef.current || (details.episodes.length > 0 ? details.episodes.length : 20);
    const targetPage = Math.ceil(epNum / pageSize);
    
    if (targetPage >= 1 && targetPage <= details.total_pages) {
        setTargetEpisode(searchEp); // Set the target to focus on
        setPage(targetPage);
        setSearchEp('');
    }
  };

  const displayImage = details?.img || anime.poster;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Immersive Backdrop */}
      <div className="fixed inset-0 h-[60vh] -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background z-10"></div>
        <img 
            src={displayImage} 
            alt="background" 
            className="w-full h-full object-cover blur-3xl opacity-30 scale-110"
        />
      </div>

      <div className="container mx-auto px-4 pt-4">
        {/* Navigation */}
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 bg-zinc-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 hover:border-white/20"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Search</span>
        </button>

        <div className="grid md:grid-cols-[220px_1fr] gap-8 md:gap-12 items-start">
            {/* Poster Section - Reduced size to 220px */}
            <div className="relative group mx-auto md:mx-0 max-w-[220px] w-full">
                <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 aspect-[2/3] bg-zinc-900 relative z-20">
                    <img 
                        src={displayImage} 
                        alt={anime.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Info Section */}
            <div className="flex flex-col gap-6 pt-2 text-center md:text-left">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-none drop-shadow-lg">
                        {anime.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm font-medium text-zinc-300">
                        {anime.score && (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-500">
                                <Star className="w-4 h-4 fill-current" />
                                <span>{anime.score}</span>
                            </div>
                        )}
                        {anime.year && (
                             <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800/50 border border-white/5 rounded-full">
                                <Calendar className="w-4 h-4 text-zinc-400" />
                                <span>{anime.year}</span>
                             </div>
                        )}
                        {anime.type && (
                             <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800/50 border border-white/5 rounded-full">
                                <Tag className="w-4 h-4 text-zinc-400" />
                                <span>{anime.type}</span>
                             </div>
                        )}
                        {details?.total && (
                             <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300">
                                <Layers className="w-4 h-4" />
                                <span>{details.total} Episodes</span>
                             </div>
                        )}
                    </div>
                </div>

                {anime.status && (
                    <div className="inline-flex self-center md:self-start items-center gap-2 text-zinc-400 text-sm">
                        <div className={`w-2 h-2 rounded-full ${anime.status.includes('Finished') ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                        <span>Status: <span className="text-zinc-200">{anime.status}</span></span>
                    </div>
                )}

                {details?.synopsis && (
                    <p className="text-zinc-400 leading-relaxed max-w-3xl">
                        {details.synopsis}
                    </p>
                )}
            </div>
        </div>

        {/* Episodes Section */}
        <div className="mt-16 relative z-20" ref={episodesTopRef}>
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-3 self-start sm:self-center">
                    <div className="h-8 w-1 bg-indigo-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-white">Episodes</h2>
                </div>
                
                {/* Episode Search Bar */}
                {details && details.total_pages > 1 && (
                    <form onSubmit={handleEpisodeJump} className="flex items-center gap-2 w-full sm:w-auto">
                        <input 
                            type="number" 
                            placeholder="Go to Ep..." 
                            value={searchEp}
                            onChange={(e) => setSearchEp(e.target.value)}
                            min="1"
                            max={details.total}
                            className="w-full sm:w-32 bg-zinc-900/80 border border-zinc-700 rounded-xl px-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                        />
                        <button 
                            type="submit"
                            disabled={!searchEp}
                            className="p-2 bg-zinc-800 hover:bg-indigo-600 text-zinc-400 hover:text-white rounded-xl border border-zinc-700 hover:border-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Find Episode"
                        >
                            <Search className="w-4 h-4" />
                        </button>
                    </form>
                )}
            </div>
            
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="aspect-[4/1] bg-zinc-800/50 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            ) : details ? (
                <>
                    <EpisodeList 
                        session={anime.session} 
                        episodes={details.episodes} 
                        targetEpisode={targetEpisode}
                    />
                    
                    {/* Pagination Controls */}
                    {details.total_pages > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-8 pt-8 border-t border-white/5">
                            <button 
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </button>
                            
                            <span className="text-sm font-medium text-zinc-400">
                                Page <span className="text-white">{page}</span> of <span className="text-white">{details.total_pages}</span>
                            </span>
                            
                            <button 
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === details.total_pages}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-zinc-500 py-4 italic">Unable to load episodes list.</div>
            )}
        </div>
      </div>
    </div>
  );
};