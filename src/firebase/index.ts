
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  const isConfigured = getApps().length > 0;
  const firebaseApp = isConfigured ? getApp() : initializeApp(firebaseConfig);
  return getSdks(firebaseApp);
}

export function getSdks(firebaseApp: FirebaseApp) {
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);

  if (process.env.NEXT_PUBLIC_EMULATOR_HOST) {
    // These are safe to call multiple times, so no isConfigured check is needed.
    // The host and port are pulled from the NEXT_PUBLIC_EMULATOR_HOST variable.
    const host = process.env.NEXT_PUBLIC_EMULATOR_HOST;
    connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
    connectFirestoreEmulator(firestore, host, 8080);
  }

  return {
    firebaseApp,
    auth,
    firestore,
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './errors';
export * from './error-emitter';
export * from './auth/use-user';
