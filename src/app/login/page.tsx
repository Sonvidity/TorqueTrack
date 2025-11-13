
'use client';

import { useSignInWithGoogle, useCreateUserWithEmailAndPassword, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Logo } from '@/app/components/icons/logo';
import { Chrome } from 'lucide-react';
import { useAuth } from '@/firebase/index';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});


export default function LoginPage() {
  const auth = useAuth();
  const [signInWithGoogle, , , googleError] = useSignInWithGoogle(auth ?? undefined);
  const [createUser, , creatingUser, createUserError] = useCreateUserWithEmailAndPassword(auth ?? undefined);
  const [signIn, , signingIn, signInError] = useSignInWithEmailAndPassword(auth ?? undefined);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    if (signIn) {
        await signIn(values.email, values.password);
    }
  };

  const handleRegister = async (values: z.infer<typeof registerSchema>) => {
    if (createUser) {
        await createUser(values.email, values.password);
    }
  };

  const error = googleError || createUserError || signInError;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <div className="w-full max-w-md p-4 md:p-0">
      <div className="flex justify-center mb-6">
        <Logo className="h-12 w-12 text-primary" />
      </div>

      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
            <Card>
                <CardHeader>
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>Enter your credentials to access your garage.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                            <FormField
                                control={loginForm.control}
                                name="email"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                    <Input placeholder="you@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={loginForm.control}
                                name="password"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                    <Input type="password" placeholder="********" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={signingIn}>
                                {signingIn ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="register">
            <Card>
                <CardHeader>
                    <CardTitle>Create an Account</CardTitle>
                    <CardDescription>Join TorqueTrack to manage your vehicles.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Form {...registerForm}>
                        <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                            <FormField
                                control={registerForm.control}
                                name="email"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                    <Input placeholder="you@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={registerForm.control}
                                name="password"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                    <Input type="password" placeholder="********" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={registerForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                    <Input type="password" placeholder="********" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={creatingUser}>
                                {creatingUser ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>

      <Separator className="my-6" />

      <div className="space-y-4">
        <Button
            variant="outline"
            className="w-full"
            onClick={() => signInWithGoogle && signInWithGoogle()}
            disabled={!auth}
        >
            <Chrome className="mr-2 h-4 w-4" />
            Sign In with Google
        </Button>
        {error && <p className="text-center text-sm text-destructive">{error.message}</p>}
      </div>

      </div>
    </div>
  );
}
