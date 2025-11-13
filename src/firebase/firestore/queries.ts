
'use client';

import { collection, doc, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

export const getVehiclesCollectionRef = (userId: string) => {
    const db = useFirestore();
    return collection(db, 'users', userId, 'vehicles');
};

export const getVehicleDocRef = (userId: string, vehicleId: string) => {
    const db = useFirestore();
    return doc(db, 'users', userId, 'vehicles', vehicleId);
};
