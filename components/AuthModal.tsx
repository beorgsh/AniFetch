
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, Loader2, AlertCircle, RefreshCw, UserCircle, Chrome } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginAsGuest, signInWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [mathChallenge, setMathChallenge] = useState({ num1: 0, num2: 0 });
  const [mathAnswer, setMathAnswer] = useState('');

  const generateChallenge = () => {
    setMathChallenge({
      num1: Math.floor(Math.random() * 10) + 1,
      num2: Math.floor(Math.random() * 10) + 1
    });
    setMathAnswer('');
  };

  useEffect(() => {
    if (isOpen) {
      generateChallenge();
      setError(null);
      setEmail('');
      setPassword('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Add toggleMode to fix "Cannot find name 'toggleMode'" error on line 173
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setError("Email cannot be empty.");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return false;
    }
    const sum = mathChallenge.num1 + mathChallenge.num2;
    if (parseInt(mathAnswer) !== sum) {
      setError("Incorrect answer to the math challenge.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) {
      generateChallenge();
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
        if (signInErr) throw signInErr;
      } else {
        const { error: signUpErr } = await supabase.auth.signUp({ email, password });
        if (signUpErr) throw signUpErr;
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
      generateChallenge();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      setGoogleLoading(false);
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-zinc-400 text-sm">{isLogin ? 'Enter your credentials to access your account' : 'Sign up to start saving your favorite anime'}</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-3 mb-6">
          <button onClick={handleGoogleLogin} disabled={googleLoading} className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-200 text-zinc-900 font-bold py-2.5 rounded-xl transition-all disabled:opacity-50">
            {googleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Chrome className="w-5 h-5 text-indigo-600" />}
            Continue with Google
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6 before:h-px before:flex-1 before:bg-zinc-800 after:h-px after:flex-1 after:bg-zinc-800">
          <span className="text-xs text-zinc-500 font-medium uppercase">or use email</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300 ml-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><Mail className="w-4 h-4 text-zinc-500" /></div>
              <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all" placeholder="name@example.com" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><Lock className="w-4 h-4 text-zinc-500" /></div>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all" placeholder="At least 8 characters" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300 ml-1">Human Verify</label>
            <div className="flex items-center gap-3">
              <div className="bg-zinc-800/80 px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 font-mono select-none flex-grow text-center">{mathChallenge.num1} + {mathChallenge.num2} = ?</div>
              <input type="number" value={mathAnswer} onChange={(e) => setMathAnswer(e.target.value)} className="w-24 bg-black/50 border border-zinc-800 rounded-xl py-2.5 px-3 text-center text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all" placeholder="Sum" />
              <button type="button" onClick={generateChallenge} className="p-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"><RefreshCw className="w-4 h-4" /></button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-4 flex items-center gap-4 before:h-px before:flex-1 before:bg-zinc-800 after:h-px after:flex-1 after:bg-zinc-800">
          <span className="text-xs text-zinc-500 font-medium uppercase">or</span>
        </div>

        <button onClick={handleGuestLogin} className="w-full mt-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-medium py-2.5 rounded-xl transition-all flex items-center justify-center gap-2">
          <UserCircle className="w-5 h-5" />
          Continue as Guest
        </button>

        <div className="mt-6 text-center">
          <button onClick={toggleMode} className="text-sm text-zinc-400 hover:text-white transition-colors">{isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}</button>
        </div>
      </div>
    </div>
  );
};
