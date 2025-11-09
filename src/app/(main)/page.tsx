'use client';

import * as React from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { BudgetHealth } from '@/components/dashboard/budget-health';
import { GoalsSlider } from '@/components/dashboard/goals-slider';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { budgetHealth as initialBudgetHealth } from '@/lib/data';

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

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-6">
      <div className="space-y-6">
        <DashboardHeader />
        <div className="grid gap-6 md:grid-cols-2">
          <BudgetHealth
            budgetState={budgetState}
            setBudgetState={setBudgetState}
          />
          <GoalsSlider />
        </div>
        <ActivityFeed />
      </div>
    </div>
  );
}
