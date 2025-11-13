'use client';
import { useMemo } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from '.';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const instances = useMemo(initializeFirebase, []);

  return <FirebaseProvider value={instances}>{children}</FirebaseProvider>;
}
