
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { MainNav } from '@/app/components/main-nav';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useUser } from '@/firebase';

function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <MainNav />
      </div>
    </header>
  );
}


export default function MyVehiclesPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
       <Header />
       <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-headline text-3xl font-bold">My Vehicles</h1>
            <Button asChild>
                <Link href="/#form">Add New Vehicle</Link>
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>No Vehicles Yet</CardTitle>
              <CardDescription>You haven't saved any vehicles to your profile.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Go back to the <Link href="/" className="underline text-primary">homepage</Link> to configure and save your first vehicle.
              </p>
            </CardContent>
          </Card>
        </div>
       </main>
    </div>
  );
}
