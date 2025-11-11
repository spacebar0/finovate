'use client';

import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { DepositDialog } from '@/components/dashboard/deposit-dialog';
import { GoalCompletionTick } from '@/components/dashboard/goal-completion-tick';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc } from 'firebase/firestore';
import type { Goal } from '@/firebase/auth/types';
import { differenceInDays, parseISO } from 'date-fns';

interface GoalsSliderProps {
  setShowConfetti: (show: boolean) => void;
}

export function GoalsSlider({ setShowConfetti }: GoalsSliderProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedGoal, setSelectedGoal] = React.useState<Goal | null>(null);
  const [completedGoalId, setCompletedGoalId] = React.useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const goalsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, `users/${user.uid}/goals`);
  }, [firestore, user]);

  const { data: goals, isLoading } = useCollection<Goal>(goalsCollectionRef);

  const handleDepositClick = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsDialogOpen(true);
  };

  const handleGoalComplete = (goalId: string) => {
    const goal = goals?.find(g => g.id === goalId);
    if (goal && user) {
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
        api?.scrollNext();
      }, 1300);

      // Animation duration is ~2.3s. Remove after that.
      setTimeout(() => {
        deleteDoc(goalDocRef); // Non-blocking, but we can assume it works for UI purposes
        setCompletedGoalId(null);
      }, 2300);
    }
  };

  if (isLoading) {
    return <Card className="flex flex-col" style={{ background: "hsla(0, 0%, 100%, 0.05)", backdropFilter: "blur(12px)" }}><CardHeader><CardTitle className="font-headline">Quick Goals</CardTitle></CardHeader><CardContent className='flex items-center justify-center'><p>Loading goals...</p></CardContent></Card>
  }
  
  if (!goals || goals.length === 0) {
    return <Card className="flex flex-col" style={{ background: "hsla(0, 0%, 100%, 0.05)", backdropFilter: "blur(12px)" }}><CardHeader><CardTitle className="font-headline">Quick Goals</CardTitle></CardHeader><CardContent className='flex items-center justify-center'><p>No goals set yet. Add one!</p></CardContent></Card>
  }

  return (
    <>
      <Card className="flex flex-col" style={{ 
        background: "hsla(0, 0%, 100%, 0.05)",
        backdropFilter: "blur(12px)",
      }}>
        <CardHeader>
          <CardTitle className="font-headline">Quick Goals</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <Carousel
            setApi={setApi}
            opts={{
              align: 'start',
            }}
            className="w-full max-w-sm"
          >
            <CarouselContent>
              {goals.map(goal => {
                const progress =
                  (goal.currentAmount / goal.targetAmount) * 100;
                const isCompleted = completedGoalId === goal.id;

                const daysLeft = differenceInDays(parseISO(goal.deadline), new Date());
                let deadlineText: string;

                if (daysLeft < 0) {
                  deadlineText = 'Overdue';
                } else if (daysLeft > 99) {
                  deadlineText = '99+ days left';
                } else if (daysLeft === 1) {
                  deadlineText = '1 day left';
                } else {
                  deadlineText = `${daysLeft} days left`;
                }

                return (
                  <CarouselItem
                    key={goal.id}
                    className={cn(isCompleted && 'animate-card-drop')}
                  >
                    <div className="p-1 relative">
                       {isCompleted && <GoalCompletionTick />}
                      <Card className="bg-background/40">
                        <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                          <h3 className="font-semibold text-lg text-foreground">
                            {goal.title}
                          </h3>
                          <div className="w-full text-center">
                            <p className="text-2xl font-bold text-foreground">
                              ${goal.currentAmount.toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              of ${goal.targetAmount.toLocaleString()}
                            </p>
                          </div>
                          <div className="w-full space-y-1">
                            <Progress value={progress} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{Math.round(progress)}%</span>
                              <span>{deadlineText}</span>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleDepositClick(goal)}
                            className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-[0_4px_15px_rgba(53,37,139,0.35)] hover:shadow-lg transition-shadow"
                            disabled={isCompleted}
                          >
                            Deposit
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </CardContent>
      </Card>
      {selectedGoal && user && (
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
