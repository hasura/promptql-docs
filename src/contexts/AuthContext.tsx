import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

// OAuth2 Configuration
const HYDRA_AUTH_URL = 'http://localhost:4444/oauth2/auth';
const HYDRA_TOKEN_URL = 'http://localhost:4444/oauth2/token';
const HYDRA_USERINFO_URL = 'http://localhost:4444/userinfo';
const CLIENT_ID = 'docusaurus-client';
const CLIENT_SECRET = 'docusaurus-super-secret';
const REDIRECT_URI = 'http://localhost:3001/docs/callback';
const SCOPE = 'openid email';

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

  // Generate random state for OAuth2 security
  const generateState = (): string => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };

  // Check if user has access (mock implementation for development)
  const checkUserAccess = async (token: string): Promise<boolean> => {
    // In production, this would be a GraphQL query to check ddn_promptql_enabled_users
    // For development, we'll mock this as always true
    console.log('Checking user access with token:', token);
    return true;
  };

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = Cookies.get('access_token');
        const userInfo = Cookies.get('user_info');

        if (accessToken && userInfo) {
          const parsedUser = JSON.parse(userInfo);
          const hasAccess = await checkUserAccess(accessToken);
          
          if (hasAccess) {
            setUser(parsedUser);
          } else {
            // Clear invalid session
            Cookies.remove('access_token');
            Cookies.remove('user_info');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear potentially corrupted session
        Cookies.remove('access_token');
        Cookies.remove('user_info');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = () => {
    const state = generateState();
    sessionStorage.setItem('oauth_state', state);
    
    // Store the current path to redirect back after login
    const currentPath = window.location.pathname;
    if (currentPath !== '/login') {
      sessionStorage.setItem('redirect_after_login', currentPath);
    }

    const authUrl = new URL(HYDRA_AUTH_URL);
    authUrl.searchParams.append('client_id', CLIENT_ID);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', SCOPE);
    authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.append('state', state);

    window.location.href = authUrl.toString();
  };

  const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('user_info');
    setUser(null);

    // Redirect to docs index page
    window.location.href = '/docs/index/';
  };

  const handleAuthCallback = async (code: string, state: string): Promise<void> => {
    try {
      // Verify state parameter
      const storedState = sessionStorage.getItem('oauth_state');
      if (state !== storedState) {
        throw new Error('Invalid state parameter');
      }

      // Exchange authorization code for access token
      console.log('Exchanging code:', code);
      console.log('Redirect URI:', REDIRECT_URI);

      const tokenResponse = await fetch(HYDRA_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('Token exchange error:', errorText);
        throw new Error(`Token exchange failed: ${tokenResponse.statusText}`);
      }

      const tokenData = await tokenResponse.json();
      console.log('Token data received:', tokenData);
      const accessToken = tokenData.access_token;

      if (!accessToken) {
        throw new Error('No access token received from token exchange');
      }

      // Get user info
      console.log('Fetching user info with token:', accessToken);
      console.log('Userinfo URL:', HYDRA_USERINFO_URL);

      const userInfoResponse = await fetch(HYDRA_USERINFO_URL, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      console.log('Userinfo response status:', userInfoResponse.status);

      if (!userInfoResponse.ok) {
        const errorText = await userInfoResponse.text();
        console.error('User info error response:', errorText);
        console.error('User info error status:', userInfoResponse.status);
        throw new Error(`Failed to fetch user info: ${userInfoResponse.statusText}`);
      }

      const userInfo = await userInfoResponse.json();
      console.log('User info received:', userInfo);

      // Check if user has access
      const hasAccess = await checkUserAccess(accessToken);
      if (!hasAccess) {
        throw new Error('User does not have access to PromptQL documentation');
      }

      // Store auth data
      const userData: User = {
        id: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
      };

      Cookies.set('access_token', accessToken, { expires: 1 }); // 1 day
      Cookies.set('user_info', JSON.stringify(userData), { expires: 1 });
      setUser(userData);

      // Clean up session storage
      sessionStorage.removeItem('oauth_state');

      // Redirect to original destination or home
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
    handleAuthCallback,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
