'use client';

import * as React from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { BudgetHealth } from '@/components/dashboard/budget-health';
import { GoalsSlider } from '@/components/dashboard/goals-slider';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { Confetti } from '@/components/ui/confetti';
import { useUser, useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { collection, doc, deleteDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import type { User, Goal } from '@/firebase/auth/types';
import { useToast } from '@/hooks/use-toast';
import { DepositDialog } from '@/components/dashboard/deposit-dialog';


export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [showConfetti, setShowConfetti] = React.useState(false);
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedGoal, setSelectedGoal] = React.useState<Goal | null>(null);
  const [completedGoalId, setCompletedGoalId] = React.useState<string | null>(null);
  const [carouselApi, setCarouselApi] = React.useState<any | undefined>();


  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const goalsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, `users/${user.uid}/goals`);
  }, [firestore, user]);

  const { data: userData, isLoading: isUserDocLoading } = useDoc<User>(userDocRef);
  const { data: goals, isLoading: areGoalsLoading } = useCollection<Goal>(goalsCollectionRef);

  const handleDepositClick = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsDialogOpen(true);
  };
  
  const handleGoalComplete = (goalId: string) => {
    const goal = goals?.find(g => g.id === goalId);
    if (goal && user && firestore) {
      toast({
        title: 'Goal Completed!',
        description: `You've reached your goal for "${goal.title}"!`,
      });
      setShowConfetti(true);
      setCompletedGoalId(goalId);
      
      const goalDocRef = doc(firestore, `users/${user.uid}/goals`, goalId);

      // Card drop animation is ~1.3s.
      // After it finishes, scroll to the next goal.
      setTimeout(() => {
        carouselApi?.scrollNext();
      }, 1300);

      // Animation duration is ~2.3s. Remove after that.
      setTimeout(() => {
        deleteDoc(goalDocRef); // Non-blocking, but we can assume it works for UI purposes
        setCompletedGoalId(null);
      }, 2300);
    }
  };


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
    <>
      <div className="container mx-auto max-w-5xl p-4 md:p-6">
        <Confetti active={showConfetti} setActive={setShowConfetti} />
        <div className="space-y-6">
          <DashboardHeader user={userData} />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <BudgetHealth user={userData} />
            </div>
            <div className="lg:col-span-2">
              <GoalsSlider 
                setShowConfetti={setShowConfetti}
                goals={goals}
                isLoading={areGoalsLoading}
                onDepositClick={handleDepositClick}
                completedGoalId={completedGoalId}
                setCompletedGoalId={setCompletedGoalId}
                api={carouselApi}
                setApi={setCarouselApi}
              />
            </div>
          </div>
          <ActivityFeed />
        </div>
      </div>
       {selectedGoal && user && firestore && (
        <DepositDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          goal={selectedGoal}
          userId={user.uid}
          onGoalComplete={handleGoalComplete}
        />
      )}
    </>
  );
}
