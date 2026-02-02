import React from 'react';

// Dummy context to satisfy any remaining imports during transition, 
// though the app no longer uses this.
export const useAuth = () => ({ 
  user: null, 
  loading: false, 
  logOut: async () => {} 
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return <>{children}</>;
};