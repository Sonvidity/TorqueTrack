'use client';
import { createContext, useContext, useMemo } from 'react';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { FirebaseApp } from 'firebase/app';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

type FirebaseContextValue = {
  auth: Auth;
  db: Firestore;
  app: FirebaseApp;
};

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export function FirebaseProvider({ 
    children, 
    value 
}: { 
    children: React.ReactNode;
    value: FirebaseContextValue;
}) {
  const memoizedValue = useMemo(() => value, [value]);

  return (
    <FirebaseContext.Provider value={memoizedValue}>
      {children}
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
    const context = useContext(FirebaseContext);
    if (!context) {
      throw new Error('useFirebaseApp must be used within a FirebaseProvider');
    }
    return context.app;
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
