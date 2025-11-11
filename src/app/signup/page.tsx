'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, setDocumentNonBlocking } from '@/firebase';
import { doc, getFirestore } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Gamepad2 } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import type { User } from '@/firebase/auth/types';

const formSchema = z.object({
  displayName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type SignUpFormValues = z.infer<typeof formSchema>;

export default function SignUpPage() {
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const firestore = getFirestore(auth.app);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
    },
  });

  if (user) {
    router.push('/');
    return null;
  }

  const onSubmit = async (values: SignUpFormValues) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const newUser = userCredential.user;

      const userProfile: User = {
        uid: newUser.uid,
        displayName: values.displayName,
        email: newUser.email,
        avatarUrl: 'user-avatar',
        xp: 0,
        level: 1,
        theme: 'dark',
        joinedAt: new Date().toISOString(),
        parentConsent: false,
        budget: {
          spending: 450.75,
          budget: 600,
          savingsGoal: 200,
          currentSavings: 150,
        }
      };

      const userDocRef = doc(firestore, 'users', newUser.uid);
      setDocumentNonBlocking(userDocRef, userProfile, { merge: true });

      // Seed initial goals for the new user
      const goals = [
        {
          id: "goal1",
          title: "New Laptop",
          currentAmount: 800,
          targetAmount: 1200,
          deadline: "in 2 months",
        },
        {
          id: "goal2",
          title: "Summer Vacation",
          currentAmount: 350,
          targetAmount: 1500,
          deadline: "in 5 months",
        },
        {
          id: "goal3",
          title: "Concert Tickets",
          currentAmount: 150,
          targetAmount: 200,
          deadline: "in 3 weeks",
        },
      ];

      goals.forEach(goal => {
        const goalDocRef = doc(firestore, `users/${newUser.uid}/goals`, goal.id);
        setDocumentNonBlocking(goalDocRef, goal, { merge: false });
      });


      toast({
        title: 'Account Created!',
        description: 'Redirecting you to the dashboard.',
      });
      // The onAuthStateChanged listener will handle the redirect
    } catch (error: any) {
      console.error('Signup Error:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'Could not create your account.',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm bg-card/80 backdrop-blur-lg">
        <CardHeader className="items-center text-center">
          <Gamepad2 className="h-8 w-8 text-primary mb-2" />
          <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
          <CardDescription>Start your gamified financial journey</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Alex" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
