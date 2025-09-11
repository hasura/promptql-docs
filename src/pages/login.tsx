import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import DocsIndexContent from '../components/DocsIndexContent';
import Layout from '@theme/Layout';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // If already authenticated, redirect to home
  React.useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/docs/';
    }
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return (
      <Layout>
        <div className="auth-loading">
          <div className="auth-loading-spinner">
            <div className="auth-loading-dot"></div>
            <div className="auth-loading-dot"></div>
            <div className="auth-loading-dot"></div>
          </div>
          <p>Redirecting...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container margin-vert--lg">
        <DocsIndexContent showSidebarController={false} showTitle={true} />
      </div>
    </Layout>
  );
};

export default LoginPage;
