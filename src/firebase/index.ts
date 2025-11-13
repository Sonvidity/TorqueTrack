'use client';
// This file is a barrel file for exporting Firebase hooks and providers.
// It should not contain any initialization logic.

export {
  FirebaseProvider,
  useAuth,
  useFirebase,
  useFirebaseApp,
  useFirestore,
} from './provider';

export * from './client-provider';
export { useUser } from './auth/use-user';
