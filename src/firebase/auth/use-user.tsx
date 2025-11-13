
'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useAuth } from '@/firebase/provider';
import { type Auth } from 'firebase/auth';

export const useUser = () => {
  const auth = useAuth();
  
  const [user, loading, error] = useAuthState(auth ?? undefined);

  return { user, loading: auth === null || loading, error };
};
