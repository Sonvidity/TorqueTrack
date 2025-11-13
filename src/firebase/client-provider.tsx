'use client';
import { useMemo } from 'react';
import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import { FirebaseProvider } from './provider';

type FirebaseInstances = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
};

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const instances = useMemo(() => {
    if (getApps().length === 0) {
      initializeApp(firebaseConfig);
    }
    const app = getApps()[0];
    const auth = getAuth(app);
    const db = getFirestore(app);
    return { app, auth, db };
  }, []);

  return (
    <FirebaseProvider value={instances}>
      {children}
    </FirebaseProvider>
  );
}
