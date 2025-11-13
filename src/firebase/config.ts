// This file is not intended to be edited.
// It is used to store the Firebase configuration object.
// We are exposing the configuration to the client-side.
// It is safe to do so. See https://firebase.google.com/docs/web/setup#safe-to-include-in-code
import { getApps, initializeApp, type FirebaseOptions } from 'firebase/app';

const firebaseConfig: FirebaseOptions = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_CONFIG || '{}'
);

// Initialize Firebase
// We need to check if the app is already initialized to prevent errors.
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export { app, firebaseConfig };
