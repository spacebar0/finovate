'use client';

import * as React from 'react';
import { Pie, PieChart, Cell } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { AdjustBudgetDialog } from '@/components/dashboard/adjust-budget-dialog';
import type { BudgetState } from '@/app/(main)/page';

const chartConfig = {
  progress: {
    label: 'Progress',
  },
  background: {
    label: 'Background',
    color: 'hsl(var(--muted))',
  },
};

const getBudgetStatus = (percentage: number) => {
  if (percentage <= 70) return 'On Track';
  if (percentage <= 90) return 'Approaching Limit';
  return 'Limit Exceeded';
};

const getBudgetColor = (percentage: number): string => {
  if (percentage <= 50) return 'hsl(142, 71%, 45%)'; // Green
  if (percentage <= 75) return 'hsl(48, 96%, 53%)'; // Yellow
  if (percentage <= 90) return 'hsl(30, 95%, 53%)'; // Orange
  return 'hsl(0, 84%, 60%)'; // Red
};

export function BudgetHealth({
  budgetState,
  setBudgetState,
}: {
  budgetState: BudgetState;
  setBudgetState: React.Dispatch<React.SetStateAction<BudgetState>>;
}) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const { spending, budget } = budgetState;
  const percentage = budget > 0 ? Math.min(Math.round((spending / budget) * 100), 150) : 0;
  const status = getBudgetStatus(percentage);
  const color = getBudgetColor(percentage);

  const chartData = [
    { name: 'progress', value: percentage, fill: color },
    { name: 'background', value: Math.max(100 - percentage, 0), fill: chartConfig.background.color },
  ];

  return (
    <>
      <Card className="flex flex-col bg-card backdrop-blur-lg border-border">
        <CardHeader>
          <CardTitle className="font-headline">Budget Health</CardTitle>
          <CardDescription>{status} for this month</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-[140px] w-[140px]"
          >
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                strokeWidth={1}
                innerRadius={50}
                outerRadius={60}
                startAngle={90}
                endAngle={450}
                cornerRadius={percentage > 99 ? 0 : 50}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <foreignObject
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                width="100"
                height="100"
                transform="translate(-50, -50)"
              >
                <div className="w-full h-full flex flex-col items-center justify-center text-center">
                  <p className="text-3xl font-bold font-headline text-foreground">
                    {percentage}%
                  </p>
                </div>
              </foreignObject>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center justify-between w-full">
            <span className="text-muted-foreground">Current Spending</span>
            <span className="font-semibold text-foreground">
              ${spending.toFixed(2)}
            </span>
          </div>
           <div className="flex items-center justify-between w-full">
            <span className="text-muted-foreground">Monthly Budget</span>
            <span className="font-semibold text-foreground">
              ${budget.toFixed(2)}
            </span>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-[0_4px_15px_rgba(53,37,139,0.35)] hover:shadow-lg transition-shadow"
          >
            Adjust Budget
          </Button>
        </CardFooter>
      </Card>
      <AdjustBudgetDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        budgetState={budgetState}
        setBudgetState={setBudgetState}
      />
    </>
  );
}
