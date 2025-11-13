'use client';

import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/app/components/icons/logo';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Chrome } from 'lucide-react';
import { useAuth, useUser } from '@/firebase/index';

export default function LoginPage() {
  const auth = useAuth();
  // The useSignInWithGoogle hook can handle auth being null initially
  const [signInWithGoogle, , loading, error] = useSignInWithGoogle(auth ?? undefined);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      router.push('/my-vehicles');
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Logo className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Welcome to TorqueTrack</CardTitle>
          <CardDescription>Sign in to save and manage your vehicles.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full"
            onClick={() => signInWithGoogle && signInWithGoogle()}
            disabled={loading || !auth}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Sign In with Google
          </Button>
          {error && <p className="text-center text-sm text-red-500">{error.message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
