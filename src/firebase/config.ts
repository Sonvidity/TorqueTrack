// This file is not intended to be edited.
// It is used to store the Firebase configuration object.
// We are exposing the configuration to the client-side.
// It is safe to do so. See https://firebase.google.com/docs/web/setup#safe-to-include-in-code

// Note: This file no longer initializes the Firebase app.
// Initialization is handled in the FirebaseClientProvider.

import type { FirebaseOptions } from 'firebase/app';

const firebaseConfig: FirebaseOptions = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_CONFIG || '{}'
);

export { firebaseConfig };
