
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/firebase/auth/use-user';

const AUTH_ROUTES = ['/login', '/register'];
const PUBLIC_ROUTES = ['/', '/how-it-works']; 

const AuthListener = () => {
  const { user, loading: isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isUserLoading) {
      return; // Wait until user status is determined
    }

    const isAuthRoute = AUTH_ROUTES.includes(pathname);
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname) || pathname === '/';

    if (user && isAuthRoute) {
      // If user is logged in and tries to access login/register, redirect to garage
      router.push('/my-vehicles');
    } else if (!user && !isAuthRoute && !isPublicRoute) {
      // If user is not logged in and tries to access a protected route, redirect to login
      router.push('/login');
    }
  }, [user, isUserLoading, router, pathname]);

  return null; // This component doesn't render anything
};

export default AuthListener;
