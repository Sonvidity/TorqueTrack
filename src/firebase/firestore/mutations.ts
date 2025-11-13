
'use client';

import { doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { setDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '../non-blocking-updates';
import type { Vehicle } from '@/lib/schema';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from '../config';

// Helper function to initialize Firestore for server-side actions
const getDb = () => {
    if (!getApps().length) {
        const app = initializeApp(firebaseConfig);
        // Use initializeFirestore to avoid issues with multiple instances in server actions
        return initializeFirestore(app, {});
    }
    return getFirestore(getApp());
}

export const saveVehicle = (userId: string, vehicleId: string, vehicleData: Vehicle) => {
    const db = getDb();
    const vehicleRef = doc(db, 'users', userId, 'vehicles', vehicleId);
    // Use the non-blocking update to allow for optimistic UI updates on the client
    setDocumentNonBlocking(vehicleRef, vehicleData, { merge: true });
};

export const updateVehicle = (userId: string, vehicleId: string, updates: Partial<Vehicle>) => {
    const db = getDb();
    const vehicleRef = doc(db, 'users', userId, 'vehicles', vehicleId);
    updateDocumentNonBlocking(vehicleRef, updates);
};

export const deleteVehicle = (userId: string, vehicleId: string) => {
    const db = getDb();
    const vehicleRef = doc(db, 'users', userId, 'vehicles', vehicleId);
    deleteDocumentNonBlocking(vehicleRef);
};
