'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import type { User, Goal } from '@/firebase/auth/types';
import { WalletCard } from '@/components/wallets/wallet-card';
import { Skeleton } from '@/components/ui/skeleton';
import { DepositDialog } from '@/components/dashboard/deposit-dialog';
import { useToast } from '@/hooks/use-toast';
import { Confetti } from '@/components/ui/confetti';
import { CreateWalletDialog } from '@/components/wallets/create-wallet-dialog';
import { WalletsOverview } from '@/components/wallets/wallets-overview';
import { FinnyInsights } from '@/components/wallets/finny-insights';
import { MoodReflection } from '@/components/wallets/mood-reflection';

export default function WalletsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isDepositDialogOpen, setIsDepositDialogOpen] = React.useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState<'deposit' | 'withdraw'>('deposit');
  const [selectedGoal, setSelectedGoal] = React.useState<Goal | null>(null);
  const [showConfetti, setShowConfetti] = React.useState(false);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const goalsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, `users/${user.uid}/goals`);
  }, [firestore, user]);

  const { data: userData, isLoading: isUserLoading } = useDoc<User>(userDocRef);
  const { data: goals, isLoading: areGoalsLoading } = useCollection<Goal>(goalsCollectionRef);

  const totalBalance = React.useMemo(() => {
    if (!goals) return 0;
    return goals.reduce((acc, goal) => acc + goal.currentAmount, 0);
  }, [goals]);

  const handleOpenDialog = (goal: Goal, mode: 'deposit' | 'withdraw') => {
    setSelectedGoal(goal);
    setDialogMode(mode);
    setIsDepositDialogOpen(true);
  };
  
  const handleGoalComplete = (goalId: string) => {
    const goal = goals?.find(g => g.id === goalId);
    if (goal) {
      toast({
        title: 'Goal Completed!',
        description: `You've reached your goal for "${goal.title}"!`,
      });
      setShowConfetti(true);
      // Note: Goal deletion is handled in the dashboard for now.
      // We can add it here if needed.
    }
  };
  
  const isLoading = areGoalsLoading || isUserLoading;

  return (
    <>
    <div className="container mx-auto max-w-6xl p-4 md:p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-headline">Your Wallets</h1>
          <p className="text-muted-foreground">
            Total Balance: <span className="font-semibold text-foreground">${totalBalance.toLocaleString()}</span>
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-[0_4px_15px_rgba(53,37,139,0.35)] hover:shadow-lg transition-shadow">
          <PlusCircle className="mr-2" />
          Create Wallet
        </Button>
      </div>

      <WalletsOverview user={userData} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-[250px] w-full" />)}
            </div>
          ) : goals && goals.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {goals.map(goal => (
                <WalletCard 
                  key={goal.id} 
                  goal={goal}
                  onDeposit={() => handleOpenDialog(goal, 'deposit')}
                  onWithdraw={() => handleOpenDialog(goal, 'withdraw')}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-lg" style={{ background: "hsla(0, 0%, 100%, 0.05)", backdropFilter: "blur(12px)" }}>
                <h3 className="text-xl font-semibold">No Wallets Found</h3>
                <p className="text-muted-foreground mt-2">Click "Create Wallet" to start your first savings goal.</p>
            </div>
          )}
        </div>
        <div className="space-y-8">
          <MoodReflection />
          <FinnyInsights userId={user?.uid} />
        </div>
      </div>
    </div>
    
    <Confetti active={showConfetti} setActive={setShowConfetti} />

    {goals && user && firestore && selectedGoal && (
      <DepositDialog
        isOpen={isDepositDialogOpen}
        setIsOpen={setIsDepositDialogOpen}
        goals={goals}
        userId={user.uid}
        onGoalComplete={handleGoalComplete}
        initialGoalId={selectedGoal.id}
        mode={dialogMode}
      />
    )}
     {user && (
        <CreateWalletDialog
          isOpen={isCreateDialogOpen}
          setIsOpen={setIsCreateDialogOpen}
          userId={user.uid}
        />
      )}
    </>
  );
}
