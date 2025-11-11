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
import { GoalCompletionTick } from '@/components/dashboard/goal-completion-tick';
import { cn } from '@/lib/utils';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Goal } from '@/firebase/auth/types';
import { differenceInDays, parseISO } from 'date-fns';
import { Skeleton } from '../ui/skeleton';

interface GoalsSliderProps {
  setShowConfetti: (show: boolean) => void;
  goals: Goal[] | null;
  isLoading: boolean;
  onDepositClick: (goal: Goal) => void;
  completedGoalId: string | null;
  setCompletedGoalId: (id: string | null) => void;
  api?: CarouselApi;
  setApi?: (api: CarouselApi) => void;
}

export function GoalsSlider({ 
  setShowConfetti, 
  goals, 
  isLoading,
  onDepositClick,
  completedGoalId,
}: GoalsSliderProps) {
  const [api, setApi] = React.useState<CarouselApi>();

  if (isLoading) {
    return <Card className="flex flex-col" style={{ background: "hsla(0, 0%, 100%, 0.05)", backdropFilter: "blur(12px)" }}><CardHeader><CardTitle className="font-headline">Quick Goals</CardTitle></CardHeader><CardContent className='flex items-center justify-center'><Skeleton className="h-64 w-64" /></CardContent></Card>
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
                            onClick={() => onDepositClick(goal)}
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
    </>
  );
}
