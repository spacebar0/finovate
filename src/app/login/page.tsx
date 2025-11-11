'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Gamepad2 } from 'lucide-react';
import { useEffect } from 'react';

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="text-center mb-12">
        <Gamepad2 className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-headline font-bold">Welcome to Finnovate</h1>
        <p className="text-muted-foreground mt-2">Play. Save. Grow.</p>
      </div>

      <div className="w-full max-w-xs space-y-4">
        <Button
          onClick={() => router.push('/signup')}
          className="w-full h-12 text-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-[0_4px_15px_rgba(53,37,139,0.35)] hover:shadow-lg transition-shadow"
        >
          Create New Account
        </Button>
        <Button
          onClick={() => router.push('/signin')}
          variant="outline"
          className="w-full h-12 text-lg"
        >
          Sign In
        </Button>
      </div>
      
       <p className="absolute bottom-6 text-xs text-muted-foreground">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
