import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { logAuthDebugInfo, validateAuthEnvironment } from '../utils/authDebug';
import { initiateLogin, handleAuthCallback } from './helpers/oauthFlow';
import { initializeAuthFromSession, performLogout, storeSession } from './helpers/sessionManager';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  handleAuthCallback: (code: string, state: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = user !== null;

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Log debug information in development
        if (process.env.NODE_ENV === 'development') {
          logAuthDebugInfo();

          const validation = validateAuthEnvironment();
          if (!validation.isValid) {
            console.warn('⚠️  Authentication environment validation issues:', validation.issues);
          }
        }

        const userData = await initializeAuthFromSession();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = () => {
    initiateLogin();
  };

  const logout = () => {
    setUser(null);
    performLogout();
  };

  const handleAuthCallbackWrapper = async (code: string, state: string): Promise<void> => {
    try {
      const accessToken = await handleAuthCallback(code, state);

      // Store just the access token - we don't need user data
      storeSession(accessToken);

      // Set a minimal user object to indicate authentication
      setUser({ id: 'authenticated', email: 'authenticated' });

      // Clean up session storage and redirect
      sessionStorage.removeItem('oauth_state');
      const redirectPath = sessionStorage.getItem('redirect_after_login') || '/';
      sessionStorage.removeItem('redirect_after_login');
      window.location.href = redirectPath;

    } catch (error) {
      console.error('Auth callback error:', error);
      throw error;
    }
  };

  // Make handleAuthCallback available globally for the callback page
  useEffect(() => {
    (window as any).handleAuthCallback = handleAuthCallback;
    return () => {
      delete (window as any).handleAuthCallback;
    };
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    handleAuthCallback: handleAuthCallbackWrapper,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
