
'use client';

import { doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import type { Vehicle } from '@/lib/schema';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from '../config';

// This helper is for use in server-side contexts like actions, where hooks aren't available.
// It ensures Firebase is initialized only once.
const getDb = () => {
    if (!getApps().length) {
        const app = initializeApp(firebaseConfig);
        // Use initializeFirestore to avoid issues with multiple instances in server actions
        return initializeFirestore(app, {});
    }
    // If already initialized (e.g. on the client), get the existing instance.
    return getFirestore(getApp());
}

export const saveVehicle = async (userId: string, vehicleId: string, vehicleData: Vehicle) => {
    const db = getDb();
    const vehicleRef = doc(db, 'users', userId, 'vehicles', vehicleId);
    await setDoc(vehicleRef, vehicleData, { merge: true });
};

export const updateVehicle = async (userId: string, vehicleId: string, updates: Partial<Vehicle>) => {
    const db = getDb();
    const vehicleRef = doc(db, 'users', userId, 'vehicles', vehicleId);
    await updateDoc(vehicleRef, updates);
};

export const deleteVehicle = async (userId: string, vehicleId: string) => {
    const db = getDb();
    const vehicleRef = doc(db, 'users', userId, 'vehicles', vehicleId);
    await deleteDoc(vehicleRef);
};
