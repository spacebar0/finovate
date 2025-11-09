'use client';

import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { DepositDialog } from '@/components/dashboard/deposit-dialog';
import { GoalCompletionTick } from '@/components/dashboard/goal-completion-tick';
import type { Goal } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface GoalsSliderProps {
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  setShowConfetti: (show: boolean) => void;
}

export function GoalsSlider({ goals, setGoals, setShowConfetti }: GoalsSliderProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedGoal, setSelectedGoal] = React.useState<Goal | null>(null);
  const [completedGoalId, setCompletedGoalId] = React.useState<string | null>(null);
  const { toast } = useToast();


  const handleDepositClick = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsDialogOpen(true);
  };

  const handleGoalComplete = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      toast({
        title: 'Goal Completed!',
        description: `You've reached your goal for "${goal.title}"!`,
      });
      setShowConfetti(true);
      setCompletedGoalId(goalId);

      // Animation duration is ~2.3s. Remove after that.
      setTimeout(() => {
        setGoals(prevGoals => prevGoals.filter(g => g.id !== goalId));
        setCompletedGoalId(null);
      }, 2300);
    }
  };

  return (
    <>
      <Card className="flex flex-col bg-card backdrop-blur-lg border-border">
        <CardHeader>
          <CardTitle className="font-headline">Quick Goals</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <Carousel
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
                              <span>{goal.deadline}</span>
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
      {selectedGoal && (
        <DepositDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          goal={selectedGoal}
          setGoals={setGoals}
          onGoalComplete={handleGoalComplete}
        />
      )}
    </>
  );
}
