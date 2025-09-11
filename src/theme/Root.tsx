import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';

interface RootProps {
  children: React.ReactNode;
}

// Root component that provides the auth context to the entire app
const Root: React.FC<RootProps> = ({ children }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

export default Root;
