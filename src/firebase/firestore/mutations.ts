
'use client';

import { doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { setDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '../non-blocking-updates';
import type { Vehicle } from '@/lib/schema';

// This is a client-side only file.
// We are intentionally getting a new firestore instance
// instead of using the one from the provider because
// this can be used in server actions.
const db = getFirestore();

export const saveVehicle = async (userId: string, vehicleId: string, vehicleData: Vehicle) => {
    const vehicleRef = doc(db, 'users', userId, 'vehicles', vehicleId);
    // Use the non-blocking update to allow for optimistic UI updates
    setDocumentNonBlocking(vehicleRef, vehicleData, { merge: true });
};

export const updateVehicle = async (userId: string, vehicleId: string, updates: Partial<Vehicle>) => {
    const vehicleRef = doc(db, 'users', userId, 'vehicles', vehicleId);
    updateDocumentNonBlocking(vehicleRef, updates);
};

export const deleteVehicle = async (userId: string, vehicleId: string) => {
    const vehicleRef = doc(db, 'users', userId, 'vehicles', vehicleId);
    deleteDocumentNonBlocking(vehicleRef);
};
