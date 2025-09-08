import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AccessDeniedError } from '../contexts/helpers/oauthFlow';

const AuthCallback: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'error' | 'access_denied'>('loading');
  const [error, setError] = useState<string>('');
  const [showLoader, setShowLoader] = useState(false);
  const { handleAuthCallback } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Set a timer to show the loader after 5 seconds
    const loaderTimer = setTimeout(() => {
      setShowLoader(true);
    }, 5000);

    const processCallback = async () => {
      // Prevent duplicate processing in React Strict Mode
      if (hasProcessed.current) {
        return;
      }
      hasProcessed.current = true;

      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const errorParam = urlParams.get('error');

        if (errorParam) {
          throw new Error(`OAuth error: ${errorParam}`);
        }

        if (!code || !state) {
          throw new Error('Missing authorization code or state');
        }

        // Use the auth context callback handler
        await handleAuthCallback(code, state);

        // If we get here, authentication was successful
        // The handleAuthCallback function will handle the redirect
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');

        // Check if this is an access denied error
        if (err instanceof AccessDeniedError) {
          // Mark access denied in session and redirect to index without query params
          try { sessionStorage.setItem('access_denied', '1'); } catch {}
          window.location.replace('/docs/index/');
          return;
        } else {
          setStatus('error');
        }

        clearTimeout(loaderTimer); // Clear timer on error
      }
    };

    processCallback();

    // Cleanup timer on unmount
    return () => {
      clearTimeout(loaderTimer);
    };
  }, [handleAuthCallback]);

  if (status === 'loading') {
    if (!showLoader) {
      // Don't show anything for the first 5 seconds
      return null;
    }

    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner">
          <div className="auth-loading-dot"></div>
          <div className="auth-loading-dot"></div>
          <div className="auth-loading-dot"></div>
        </div>
      </div>
    );
  }

  // If access was denied, we redirect to the docs index with a flag above.
  // This branch is intentionally removed.

  return (
    <div className="auth-error-container">
      <h2>Authentication Failed</h2>
      <p>Sorry, there was an error during authentication:</p>
      <div className="auth-error-details">
        {error}
      </div>
      <a href="/docs/login" className="auth-button">
        Try Again
      </a>
    </div>
  );
};

export default AuthCallback;