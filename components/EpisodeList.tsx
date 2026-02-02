import React, { useState, useEffect, useRef } from 'react';
import { Episode, DownloadLink } from '../types';
import { getEpisodeLinks } from '../services/api';
import { Download, ExternalLink, Play, Loader2, Subtitles, Mic, ChevronDown, ChevronUp } from 'lucide-react';

interface EpisodeListProps {
  session: string;
  episodes: Episode[];
  targetEpisode?: string | null;
}

interface ExpandedData {
  loading: boolean;
  sub: DownloadLink[];
  dub: DownloadLink[];
  error: boolean;
  selectedAudio: 'sub' | 'dub';
}

interface ExpandedEpisodeState {
  [key: string]: ExpandedData;
}

export const EpisodeList: React.FC<EpisodeListProps> = ({ session, episodes, targetEpisode }) => {
  const [expanded, setExpanded] = useState<ExpandedEpisodeState>({});
  const episodeRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (targetEpisode && episodes) {
        const targetEp = episodes.find(e => e.episode.toString() === targetEpisode.toString());
        if (targetEp) {
            const el = episodeRefs.current[targetEp.session];
            if (el) {
                setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        }
    }
  }, [targetEpisode, episodes]);

  const toggleEpisode = async (ep: Episode) => {
    const epId = ep.session; 
    
    if (expanded[epId]) {
      const newState = { ...expanded };
      delete newState[epId];
      setExpanded(newState);
      return;
    }

    setExpanded(prev => ({
      ...prev,
      [epId]: { loading: true, sub: [], dub: [], error: false, selectedAudio: 'sub' }
    }));

    try {
      const links = await getEpisodeLinks(session, epId) || [];
      let subLinks: DownloadLink[] = [];
      let dubLinks: DownloadLink[] = [];

      if (links.length > 3) {
          const mid = Math.ceil(links.length / 2);
          subLinks = links.slice(0, mid);
          dubLinks = links.slice(mid);
      } else {
          subLinks = links;
      }

      setExpanded(prev => ({
        ...prev,
        [epId]: { 
            loading: false, 
            sub: subLinks, 
            dub: dubLinks, 
            error: links.length === 0,
            selectedAudio: 'sub'
        }
      }));
    } catch (err) {
      setExpanded(prev => ({
        ...prev,
        [epId]: { loading: false, sub: [], dub: [], error: true, selectedAudio: 'sub' }
      }));
    }
  };

  const switchAudio = (epId: string, audio: 'sub' | 'dub') => {
      setExpanded(prev => ({
          ...prev,
          [epId]: { ...prev[epId], selectedAudio: audio }
      }));
  };

  if (!episodes || episodes.length === 0) {
    return (
      <div className="py-12 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
        No episodes found.
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
        {episodes.map((ep, index) => {
            const epId = ep.session;
            const state = expanded[epId];
            const isOpen = !!state;
            const isTarget = targetEpisode && ep.episode.toString() === targetEpisode.toString();
            const currentLinks = state ? (state.selectedAudio === 'sub' ? state.sub : state.dub) : [];
            const hasDub = state && state.dub.length > 0;

            return (
                <div 
                    key={`${epId}-${index}`} 
                    ref={(el) => { episodeRefs.current[epId] = el; }}
                    className={`group bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/50 hover:border-zinc-700 rounded-lg overflow-hidden transition-all duration-300 ${isOpen ? 'bg-zinc-900 border-zinc-700' : ''} ${isTarget ? 'ring-2 ring-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : ''}`}
                >
                    <div 
                        className="flex flex-col md:flex-row gap-4 p-4 cursor-pointer"
                        onClick={() => toggleEpisode(ep)}
                    >
                        <div className="relative w-full md:w-48 aspect-video flex-shrink-0 rounded-md overflow-hidden bg-black">
                            <img 
                                src={ep.snapshot} 
                                alt={`Episode ${ep.episode}`} 
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-[1px]">
                                <div className="w-10 h-10 rounded-full border border-white flex items-center justify-center bg-black/40">
                                    <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center flex-grow min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className={`text-lg font-bold transition-colors ${isTarget ? 'text-indigo-400' : 'text-white group-hover:text-indigo-400'}`}>
                                    Episode {ep.episode}
                                </h3>
                                <div className="text-zinc-500">
                                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                </div>
                            </div>
                            <p className="text-sm text-zinc-400 line-clamp-2">
                                View download options and streams available for this episode.
                            </p>
                        </div>
                    </div>

                    {isOpen && (
                        <div className="px-4 pb-4 md:pl-[224px] animate-in slide-in-from-top-2 fade-in duration-300">
                             <div className="pt-2 border-t border-zinc-800/50">
                                {state.loading ? (
                                    <div className="flex items-center py-4 text-indigo-400 gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="text-sm">Fetching links...</span>
                                    </div>
                                ) : state.error ? (
                                    <div className="text-red-400 text-sm py-2">
                                        Failed to load links.
                                    </div>
                                ) : (
                                    <div className="space-y-3 pt-2">
                                        {hasDub && (
                                            <div className="flex items-center gap-4 text-sm font-medium">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); switchAudio(epId, 'sub'); }}
                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${state.selectedAudio === 'sub' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
                                                >
                                                    <Subtitles className="w-4 h-4" />
                                                    Subtitles
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); switchAudio(epId, 'dub'); }}
                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${state.selectedAudio === 'dub' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
                                                >
                                                    <Mic className="w-4 h-4" />
                                                    English Dub
                                                </button>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {currentLinks.map((link, idx) => (
                                                <a 
                                                    key={idx}
                                                    href={link.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-3 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/50 hover:border-zinc-600 transition-colors group/link"
                                                >
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <div className="w-8 h-8 rounded bg-zinc-900 flex items-center justify-center flex-shrink-0 text-zinc-400 group-hover/link:text-indigo-400 group-hover/link:bg-indigo-500/10 transition-colors">
                                                            <Download className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-sm text-zinc-300 group-hover/link:text-white truncate font-medium">
                                                            {link.name || `Server ${idx + 1}`}
                                                        </span>
                                                    </div>
                                                    <ExternalLink className="w-4 h-4 text-zinc-600 group-hover/link:text-zinc-400" />
                                                </a>
                                            ))}
                                        </div>
                                        
                                        {currentLinks.length === 0 && (
                                            <div className="text-zinc-500 text-sm py-2">
                                                No links available for {state.selectedAudio === 'sub' ? 'Sub' : 'Dub'}.
                                            </div>
                                        )}
                                    </div>
                                )}
                             </div>
                        </div>
                    )}
                </div>
            );
        })}
    </div>
  );
};