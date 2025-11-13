'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useAuth } from '@/firebase/provider';

export const useUser = () => {
  const auth = useAuth();
  
  // useAuthState can handle auth being null initially
  const [user, loading, error] = useAuthState(auth);

  return { user, loading: auth === null || loading, error };
};
