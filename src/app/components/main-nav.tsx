
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, useAuth } from '@/firebase/index';
import { signOut } from 'firebase/auth';
import { LogIn, LogOut, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/app/components/icons/logo';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function UserNav() {
  const auth = useAuth();
  const { user, isLoading } = useUser();

  if (isLoading || !auth) {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
    );
  }

  if (!user) {
    return (
      <Button asChild variant="ghost">
        <Link href="/login">
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Link>
      </Button>
    );
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
            <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/my-vehicles">
            <Car className="mr-2 h-4 w-4" />
            <span>My Vehicles</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  
  const routes = [
    {
      href: '/',
      label: 'Home',
      active: pathname === '/',
    },
    {
      href: '/my-vehicles',
      label: 'My Cars',
      active: pathname === '/my-vehicles',
      auth: true,
    },
  ];

  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6 h-16', className)}
      {...props}
    >
      <Link href="/" className="flex items-center gap-2 font-bold text-primary">
        <Logo className="h-6 w-6" />
        <span className="hidden sm:inline-block">TorqueTrack</span>
      </Link>
      <div className="flex-1" />
      <div className="flex items-center space-x-4">
        <UserNav />
      </div>
    </nav>
  );
}
