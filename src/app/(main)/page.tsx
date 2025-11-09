'use client';

import * as React from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { BudgetHealth } from '@/components/dashboard/budget-health';
import { GoalsSlider } from '@/components/dashboard/goals-slider';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import {
  budgetHealth as initialBudgetHealth,
  goals as initialGoals,
} from '@/lib/data';
import type { Goal } from '@/lib/data';
import { Confetti } from '@/components/ui/confetti';

export type BudgetState = {
  spending: number;
  budget: number;
  savingsGoal: number;
  currentSavings: number;
};

export default function DashboardPage() {
  const [budgetState, setBudgetState] = React.useState<BudgetState>({
    spending: initialBudgetHealth.spending,
    budget: initialBudgetHealth.budget,
    savingsGoal: initialBudgetHealth.savingsGoal,
    currentSavings: initialBudgetHealth.currentSavings,
  });
  const [goals, setGoals] = React.useState<Goal[]>(initialGoals);
  const [showConfetti, setShowConfetti] = React.useState(false);

  const handleDeposit = () => {
    setShowConfetti(true);
  };

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-6">
      <Confetti active={showConfetti} setActive={setShowConfetti} />
      <div className="space-y-6">
        <DashboardHeader />
        <div className="grid gap-6 md:grid-cols-2">
          <BudgetHealth
            budgetState={budgetState}
            setBudgetState={setBudgetState}
          />
          <GoalsSlider goals={goals} setGoals={setGoals} onDeposit={handleDeposit} />
        </div>
        <ActivityFeed />
      </div>
    </div>
  );
}
