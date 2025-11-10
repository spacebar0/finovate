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
import { Coins } from 'lucide-react';

const TOTAL_SEGMENTS = 50;

const chartData = {
  saved: 15750,
  goal: 35500,
};

const chartConfig = {
  saved: {
    label: 'Saved',
    color: 'hsl(142, 71%, 45%)',
  },
  remaining: {
    label: 'Remaining',
    color: 'hsl(var(--muted) / 0.5)',
  },
};

export function GoalsTrackerChart() {
  const { saved, goal } = chartData;
  const percentage = Math.round((saved / goal) * 100);
  const filledSegments = Math.round((percentage / 100) * TOTAL_SEGMENTS);

  const pieData = Array.from({ length: TOTAL_SEGMENTS }, (_, i) => ({
    name: `segment-${i}`,
    value: 1,
    fill: i < filledSegments ? chartConfig.saved.color : chartConfig.remaining.color,
  }));

  return (
    <Card className="flex flex-col bg-card/80 backdrop-blur-lg border-border">
      <CardHeader>
        <CardTitle className="font-headline">Goals Tracker</CardTitle>
        <CardDescription>Overall progress on your goals</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[200px] w-[200px]"
        >
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              stroke="hsl(var(--background))"
              strokeWidth={2}
              innerRadius={70}
              outerRadius={90}
              startAngle={90}
              endAngle={450}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <foreignObject
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              width="140"
              height="140"
              transform="translate(-70, -70)"
            >
              <div className="w-full h-full flex flex-col items-center justify-center text-center">
                <Coins className="h-8 w-8 text-yellow-400 mb-2" />
                <p className="text-5xl font-bold font-headline text-foreground">
                  {percentage}%
                </p>
              </div>
            </foreignObject>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-4">
        <div className="flex items-center justify-center w-full">
          <span className="text-muted-foreground">Total Saved</span>
        </div>
        <div className="flex items-center justify-center w-full">
          <span className="text-2xl font-bold font-headline text-foreground">
            ${saved.toLocaleString()} / ${goal.toLocaleString()}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
