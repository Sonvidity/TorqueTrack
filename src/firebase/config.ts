
// This file is not intended to be edited.
// It is used to store the Firebase configuration object.
// We are exposing the configuration to the client-side.
// It is safe to do so. See https://firebase.google.com/docs/web/setup#safe-to-include-in-code

const firebaseConfigString = process.env.NEXT_PUBLIC_FIREBASE_CONFIG || '{}';

export { firebaseConfigString };
