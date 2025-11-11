'use client';

import * as React from 'react';
import { animate, useInView } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import type { User } from '@/firebase/auth/types';

function AnimatedNumber({ value }: { value: number }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate: (latest) => {
          setDisplayValue(Math.round(latest));
        }
      });
      return () => controls.stop();
    }
  }, [isInView, value]);

  return <span ref={ref}>${displayValue.toLocaleString()}</span>;
}


interface WalletsOverviewProps {
  user: User | null;
  isLoading: boolean;
}

export function WalletsOverview({ user, isLoading }: WalletsOverviewProps) {
  const budgetData = user?.budget;
  
  if (isLoading || !budgetData) {
    return (
      <Card style={{ background: "hsla(0, 0%, 100%, 0.05)", backdropFilter: "blur(12px)" }}>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-2 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const { spending, currentSavings, savingsGoal } = budgetData;
  const savingsProgress = savingsGoal > 0 ? (currentSavings / savingsGoal) * 100 : 0;

  return (
    <Card style={{ background: "hsla(0, 0%, 100%, 0.05)", backdropFilter: "blur(12px)" }}>
      <CardHeader>
        <CardTitle className="font-headline">Monthly Snapshot</CardTitle>
        <CardDescription>Your spending and savings for this month.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Monthly Spending</p>
            <p className="text-3xl font-bold font-headline text-red-400">
              <AnimatedNumber value={spending} />
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Monthly Savings</p>
            <p className="text-3xl font-bold font-headline text-green-400">
              <AnimatedNumber value={currentSavings} />
            </p>
          </div>
        </div>

        <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
                <span>Savings Goal Progress</span>
                <span><AnimatedNumber value={currentSavings} /> / ${savingsGoal.toLocaleString()}</span>
            </div>
          <Progress value={savingsProgress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
