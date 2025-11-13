'use client';
import { useState, useEffect } from 'react';
import { FirebaseProvider } from './provider';
import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfigString } from './config';

type FirebaseInstances = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
};

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [instances, setInstances] = useState<FirebaseInstances | null>(null);

  useEffect(() => {
    const firebaseConfig = JSON.parse(firebaseConfigString);
    const apps = getApps();
    const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    setInstances({ app, auth, db });
  }, []);

  if (!instances) {
    return null; // Or a loading spinner
  }

  return <FirebaseProvider value={instances}>{children}</FirebaseProvider>;
}
