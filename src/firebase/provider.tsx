'use client';
import { createContext, useContext } from 'react';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { app } from '@/firebase/config';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

type FirebaseContextValue = {
  auth: Auth;
  db: Firestore;
};

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const auth = getAuth(app);
  const db = getFirestore(app);

  return (
    <FirebaseContext.Provider value={{ auth, db }}>
      {children}
      <Toaster />
      <FirebaseErrorListener />
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const useFirebaseApp = () => {
    return app;
}

export const useAuth = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return context.auth;
}

export const useFirestore = () => {
    const context = useContext(FirebaseContext);
    if (!context) {
      throw new Error('useFirestore must be used within a FirebaseProvider');
    }
    return context.db;
}