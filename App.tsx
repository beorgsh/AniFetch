import React, { useState } from 'react';
import { Header } from './components/Header';
import { AnimeCard } from './components/AnimeCard';
import { SeriesView } from './components/SeriesView';
import { AiringSection } from './components/AiringSection';
import { AnimeSearchResult } from './types';
import { searchAnime } from './services/api';
import { Loader2, Search, Zap } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';

const AppContent: React.FC = () => {
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
    <div className="min-h-screen bg-background text-zinc-100 relative selection:bg-indigo-500/30">
      {/* Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-white [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background"></div>
      </div>

      <Header />

      <main className="container mx-auto px-6 py-8 pt-24 relative z-10">
        {view === 'search' && (
          <div className="flex flex-col min-h-[80vh]">
            
            {/* Search Hero Section */}
            <div className={`transition-all duration-500 ease-in-out flex flex-col items-center ${!hasSearched ? 'justify-center py-10' : 'justify-start mb-12'}`}>
                
                {!hasSearched && (
                    <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 mb-6 ring-1 ring-indigo-500/20 shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)]">
                            <Zap className="w-8 h-8 text-indigo-500" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400 mb-4 tracking-tight">
                            Find Your Next Anime
                        </h1>
                        <p className="text-zinc-500 max-w-md mx-auto text-lg">
                            Search thousands of series and download episodes in high quality instantly.
                        </p>
                    </div>
                )}

                <form onSubmit={handleSearch} className={`relative w-full transition-all duration-500 ${!hasSearched ? 'max-w-lg scale-100' : 'max-w-2xl scale-100'}`}>
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search className={`w-5 h-5 transition-colors ${hasSearched ? 'text-indigo-500' : 'text-zinc-500'}`} />
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

            {/* Results or Airing Section */}
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                {/* Search Results */}
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

                {/* Airing Section - Show when not searching and no search results yet */}
                {!isSearching && !hasSearched && (
                    <AiringSection onAnimeClick={handleAnimeClick} />
                )}

                {/* No Results State */}
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
          </div>
        )}

        {view === 'details' && selectedAnime && (
          <SeriesView anime={selectedAnime} onBack={handleBack} />
        )}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;