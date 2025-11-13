'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useAuth } from '@/firebase';
import type { User } from 'firebase/auth';

export const useUser = (): { user: User | null | undefined, loading: boolean, error: Error | undefined } => {
  const auth = useAuth();
  
  if (auth === null) {
    return { user: null, loading: true, error: undefined };
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [user, loading, error] = useAuthState(auth);

  return { user, loading, error };
};
