import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import { 
  onAuthStateChanged, 
  signOut as firebaseSignOut, 
  User as FirebaseUser 
} from 'firebase/auth';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  loginAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  loginAsGuest: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [guestUser, setGuestUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setGuestUser(null);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    if (guestUser) {
      setGuestUser(null);
    } else {
      await firebaseSignOut(auth);
    }
  };

  const loginAsGuest = () => {
    const guest = {
      uid: 'guest-' + Math.random().toString(36).substr(2, 9),
      email: 'guest@anifetch.com',
      displayName: 'Guest User',
      isGuest: true
    };
    setGuestUser(guest);
  };

  const value = {
    user: user || guestUser,
    loading,
    signOut,
    loginAsGuest
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};