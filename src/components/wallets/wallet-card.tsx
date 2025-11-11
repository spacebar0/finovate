'use client';

import type { Goal } from '@/firebase/auth/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { PiggyBank, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

interface WalletCardProps {
  goal: Goal;
  onDeposit: () => void;
  onWithdraw: () => void;
}

const iconMap: { [key: string]: React.ElementType } = {
  default: PiggyBank,
};

// A simple function to get an icon based on goal title
const getIconForGoal = (title: string): React.ElementType => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('pc') || lowerTitle.includes('laptop') || lowerTitle.includes('tech')) return PiggyBank;
    if (lowerTitle.includes('vacation') || lowerTitle.includes('trip')) return PiggyBank;
    if (lowerTitle.includes('ticket') || lowerTitle.includes('concert')) return PiggyBank;
    return iconMap.default;
}

export function WalletCard({ goal, onDeposit, onWithdraw }: WalletCardProps) {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
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

  const Icon = getIconForGoal(goal.title);

  return (
    <Card 
        className="flex flex-col"
        style={{
            background: 'hsla(242, 70%, 33%, 0.1)',
            backdropFilter: 'blur(12px)',
            border: '1px solid hsla(242, 70%, 33%, 0.3)',
        }}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
            <CardTitle className="font-headline text-xl">{goal.title}</CardTitle>
            <div className="p-2 bg-background/50 rounded-lg">
                <Icon className="h-6 w-6 text-primary" />
            </div>
        </div>
        <CardDescription className="text-sm">
            Target: ${goal.targetAmount.toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div>
            <p className="text-3xl font-bold text-foreground">${goal.currentAmount.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">saved</p>
        </div>
        <div className="w-full space-y-1">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{Math.round(progress)}%</span>
            <span>{deadlineText}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={onDeposit}>
            <ArrowUpCircle className="mr-2 h-4 w-4" />
            Add
        </Button>
        <Button variant="ghost" onClick={onWithdraw}>
            <ArrowDownCircle className="mr-2 h-4 w-4" />
            Withdraw
        </Button>
      </CardFooter>
    </Card>
  );
}
