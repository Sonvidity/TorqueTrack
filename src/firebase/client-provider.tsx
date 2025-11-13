'use client';

import {
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { FirebaseProvider } from './provider';

type FirebaseInstances = {
  auth: Auth | null;
  db: Firestore | null;
  app: FirebaseApp | null;
};

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [instances, setInstances] = useState<FirebaseInstances>({
    app: null,
    auth: null,
    db: null,
  });

  useEffect(() => {
    const firebaseConfigString = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;
    if (firebaseConfigString) {
      try {
        const firebaseConfig = JSON.parse(firebaseConfigString);
        const apps = getApps();
        const app =
          apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);
        setInstances({ app, auth, db });
      } catch (e) {
        console.error("Failed to parse Firebase config:", e);
      }
    }
  }, []);

  return <FirebaseProvider instances={instances}>{children}</FirebaseProvider>;
}
