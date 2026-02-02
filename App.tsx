import React, { useState } from 'react';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { Landing } from './components/Landing';
import { AuthModal } from './components/AuthModal';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-zinc-100 relative selection:bg-indigo-500/30">
      {/* Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-white [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background"></div>
      </div>

      <Header onAuthClick={() => setIsAuthModalOpen(true)} />

      <main className="container mx-auto px-6 py-8 pt-24 relative z-10">
        {user ? (
          <Home />
        ) : (
          <Landing onStartClick={() => setIsAuthModalOpen(true)} />
        )}

        <AuthModal 
            isOpen={isAuthModalOpen} 
            onClose={() => setIsAuthModalOpen(false)} 
        />
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