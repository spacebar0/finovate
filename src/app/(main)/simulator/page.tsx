'use client';

import * as React from 'react';
import { InvestmentGrowthChart } from '@/components/simulator/investment-growth-chart';
import { SpendingTrendChart } from '@/components/simulator/spending-trend-chart';
import { GoalsTrackerChart } from '@/components/simulator/goals-tracker-chart';
import { FinancialHealthTimeline } from '@/components/simulator/financial-health-timeline';
import { SavingsHabitHeatmap } from '@/components/simulator/savings-habit-heatmap';
import { ScenarioComparisonTool } from '@/components/simulator/scenario-comparison-tool';

export default function SimulatorPage() {
  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-6">
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <InvestmentGrowthChart />
        </div>
        <SpendingTrendChart />
        <GoalsTrackerChart />
        <div className="lg:col-span-2">
          <FinancialHealthTimeline />
        </div>
        <div className="lg:col-span-2">
          <SavingsHabitHeatmap />
        </div>
        <div className="lg:col-span-2">
          <ScenarioComparisonTool />
        </div>
      </div>
    </div>
  );
}
