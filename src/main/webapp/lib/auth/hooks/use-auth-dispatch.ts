import { useContext } from 'react';
import { AuthDispatchContext } from '@/lib/auth/providers/auth-provider.tsx';

const useAuthDispatch = () => {
  const dispatch = useContext(AuthDispatchContext);

  if (!dispatch) {
    throw new Error('useAuthDispatch must be used within AuthProvider');
  }

  return dispatch;
};

export default useAuthDispatch;
