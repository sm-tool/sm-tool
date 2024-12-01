import { AuthContext } from '@/lib/auth/providers/auth-provider.tsx';
import React from 'react';

const useAuth = () => {
  const authService = React.useContext(AuthContext);

  if (!authService) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return authService;
};

export default useAuth;
