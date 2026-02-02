
import React, { useState } from 'react';
import { AnimeSearchResult } from '../types';
import { searchAnime } from '../services/api';
import { AnimeCard } from './AnimeCard';
import { SeriesView } from './SeriesView';
import { AiringSection } from './AiringSection';
import { Loader2, Search } from 'lucide-react';

export const Home: React.FC = () => {
  const [view, setView] = useState<'search' | 'details'>('search');
  const [input, setInput] = useState('');
  const [searchResults, setSearchResults] = useState<AnimeSearchResult[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<AnimeSearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    setIsSearching(true);
    setView('search');
    setSelectedAnime(null);
    setHasSearched(true);
    
    const results = await searchAnime(input.trim());
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleAnimeClick = (anime: AnimeSearchResult) => {
    setSelectedAnime(anime);
    setView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setView('search');
    setSelectedAnime(null);
  };

  return (
    <div className="flex flex-col min-h-[80vh]">
      {view === 'search' ? (
        <>
          <div className="transition-all duration-500 ease-in-out flex flex-col items-center justify-start mb-12">
            <form onSubmit={handleSearch} className="relative w-full max-w-2xl scale-100">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-indigo-500" />
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search for anime..."
                className="w-full bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 text-base text-zinc-100 rounded-xl py-3 pl-10 pr-4 shadow-xl focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-zinc-500"
              />
              {isSearching && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
                </div>
              )}
            </form>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            {!isSearching && searchResults.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <h2 className="text-xl font-semibold text-white">Search Results</h2>
                  <span className="text-xs font-medium text-zinc-500 bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-800">
                    {searchResults.length} FOUND
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
                  {searchResults.map((anime, index) => (
                    <AnimeCard 
                      key={`${anime.session}-${index}`} 
                      anime={anime} 
                      onClick={handleAnimeClick} 
                    />
                  ))}
                </div>
              </div>
            )}

            {!isSearching && !hasSearched && (
              <AiringSection onAnimeClick={handleAnimeClick} />
            )}

            {!isSearching && hasSearched && searchResults.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 opacity-50" />
                </div>
                <p className="text-lg font-medium text-zinc-400">No results found</p>
                <p className="text-sm">Try searching for a different title</p>
              </div>
            )}
          </div>
        </>
      ) : (
        selectedAnime && <SeriesView anime={selectedAnime} onBack={handleBack} />
      )}
    </div>
  );
};
