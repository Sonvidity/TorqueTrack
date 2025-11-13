
'use client';

import { useRouter } from 'next/navigation';
import { MainNav } from '@/app/components/main-nav';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase/index';
import { collection } from 'firebase/firestore';
import type { Vehicle } from '@/lib/schema';
import { Car, PlusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <MainNav />
      </div>
    </header>
  );
}

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>{vehicle.year} {vehicle.make} {vehicle.model}</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/my-vehicles/${vehicle.id}`}>
                            View
                        </Link>
                    </Button>
                </div>
                <CardDescription>{vehicle.engineSwap !== 'stock' ? vehicle.engineSwap : ''}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Chassis: {vehicle.chassisKms.toLocaleString()} km</span>
                    <span>Engine: {vehicle.engineKms.toLocaleString()} km</span>
                </div>
            </CardContent>
        </Card>
    )
}

function VehicleList() {
    const { user } = useUser();
    const firestore = useFirestore();

    const vehiclesCollection = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, 'users', user.uid, 'vehicles');
    }, [user, firestore]);

    const { data: vehicles, isLoading } = useCollection<Vehicle>(vehiclesCollection);

    if (isLoading) {
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
            </div>
        )
    }

    if (!vehicles || vehicles.length === 0) {
        return (
            <div className="text-center py-16 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                <Car className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No Vehicles Yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">You haven't added any vehicles to your garage.</p>
                <Button asChild className="mt-6">
                    <Link href="/#form">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Your First Vehicle
                    </Link>
                </Button>
            </div>
        );
    }
    
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map(v => <VehicleCard key={v.id} vehicle={v} />)}
        </div>
    )
}


export default function MyVehiclesPage() {
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-headline text-3xl font-bold">My Garage</h1>
            <Button asChild>
                <Link href="/#form">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Vehicle
                </Link>
            </Button>
          </div>
          <VehicleList />
        </div>
       </main>
    </div>
  );
}
