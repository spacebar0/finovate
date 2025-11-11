'use client';

import * as React from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { BudgetHealth } from '@/components/dashboard/budget-health';
import { GoalsSlider } from '@/components/dashboard/goals-slider';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { Confetti } from '@/components/ui/confetti';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import type { User } from '@/firebase/auth/types';


export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [showConfetti, setShowConfetti] = React.useState(false);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userData, isLoading: isUserDocLoading } = useDoc<User>(userDocRef);

  if (isUserDocLoading || !userData) {
    return (
      <div className="container mx-auto max-w-4xl p-4 md:p-6">
        <div className="space-y-6">
          <Skeleton className="h-[150px] w-full" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-6">
      <Confetti active={showConfetti} setActive={setShowConfetti} />
      <div className="space-y-6">
        <DashboardHeader user={userData} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <BudgetHealth user={userData} />
          </div>
          <div className="lg:col-span-2">
            <GoalsSlider setShowConfetti={setShowConfetti} />
          </div>
        </div>
        <ActivityFeed />
      </div>
    </div>
  );
}
