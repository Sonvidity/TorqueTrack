'use client';
import { useMemo } from 'react';
import { FirebaseProvider } from './provider';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfigString } from './config';

// This function is now local to the client-only provider
function initializeFirebase() {
  const firebaseConfig = JSON.parse(firebaseConfigString);
  const apps = getApps();
  const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  return { app, auth, db };
}

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const instances = useMemo(initializeFirebase, []);

  return <FirebaseProvider value={instances}>{children}</FirebaseProvider>;
}
