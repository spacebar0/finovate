'use client';

import * as React from 'react';
import { InvestmentGrowthChart } from '@/components/simulator/investment-growth-chart';
import { SpendingsBubbleChart } from '@/components/simulator/spendings-bubble-chart';
import { GoalsTrackerChart } from '@/components/simulator/goals-tracker-chart';

export default function SimulatorPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <InvestmentGrowthChart />
        </div>
        <SpendingsBubbleChart />
        <GoalsTrackerChart />
      </div>
    </div>
  );
}
