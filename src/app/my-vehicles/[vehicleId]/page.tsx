
'use client';

import { useParams, useRouter } from 'next/navigation';
import { MainNav } from '@/app/components/main-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase/index';
import { doc, collection } from 'firebase/firestore';
import type { Vehicle } from '@/lib/schema';
import { getStandardServiceIntervals } from '@/lib/service-data';
import { getRuleBasedServiceIntervals, type RuleBasedIntervalsInput } from '@/lib/rule-based-intervals';
import { ServiceScheduleDisplay } from '@/app/components/service-schedule-display';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <MainNav />
      </div>
    </header>
  );
}

function VehicleServicePage() {
  const params = useParams();
  const vehicleId = params.vehicleId as string;
  const { user } = useUser();
  const firestore = useFirestore();

  const vehicleDocRef = useMemoFirebase(() => {
    if (!user || !firestore || !vehicleId) return null;
    return doc(firestore, 'users', user.uid, 'vehicles', vehicleId);
  }, [user, firestore, vehicleId]);

  const { data: vehicle, isLoading, error } = useDoc<Vehicle>(vehicleDocRef);

  const serviceSchedule = useMemoFirebase(() => {
    if (!vehicle) return null;

    const standardIntervals = getStandardServiceIntervals({
      make: vehicle.make,
      model: vehicle.model,
      transmission: vehicle.transmission,
    });

    const ruleInput: RuleBasedIntervalsInput = {
      drivingHabits: vehicle.drivingHabits,
      modifications: {
        stage: vehicle.stage,
        forcedInduction: vehicle.forcedInduction,
      },
      standardIntervals: standardIntervals.intervals,
    };

    return getRuleBasedServiceIntervals(ruleInput);
  }, [vehicle]);


  if (isLoading) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
            <div className="pt-8 space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
            </div>
        </div>
    );
  }

  if (error) {
    return (
        <Card className="border-destructive bg-destructive/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertCircle />
                    Error Loading Vehicle
                </CardTitle>
                <CardDescription className="text-destructive/90">
                    Could not load vehicle data. Please check your connection or permissions.
                </CardDescription>
            </CardHeader>
        </Card>
    )
  }

  if (!vehicle) {
    return (
        <div className="text-center">
            <p className="text-lg font-semibold">Vehicle not found.</p>
            <p className="text-muted-foreground">This vehicle may have been deleted or the link is incorrect.</p>
        </div>
    )
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle className="font-headline text-3xl">{vehicle.year} {vehicle.make} {vehicle.model}</CardTitle>
            <CardDescription>
                Chassis: {vehicle.chassisKms.toLocaleString()} km | Engine: {vehicle.engineKms.toLocaleString()} km
            </CardDescription>
        </CardHeader>
        <CardContent>
            {serviceSchedule ? (
                <ServiceScheduleDisplay schedule={serviceSchedule} formValues={vehicle} vehicle={vehicle} />
            ) : (
                <p>Generating service schedule...</p>
            )}
        </CardContent>
    </Card>
  )
}


export default function MyVehicleDetailPage() {
  const { user, loading: isUserLoading } = useUser();
  const router = useRouter();

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user && !isUserLoading) {
    router.push('/login');
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
       <Header />
       <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <VehicleServicePage />
        </div>
       </main>
    </div>
  );
}
