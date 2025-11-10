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
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

const chartData = [
  { name: 'Essentials', value: 4332, color: 'hsl(var(--chart-1))' },
  { name: 'Lifestyle', value: 2128, color: 'hsl(var(--chart-2))' },
  { name: 'Impulse', value: 1140, color: 'hsl(var(--chart-3))' },
];

const chartConfig = {
  spendings: {
    label: 'Spendings',
  },
  Essentials: {
    label: 'Essentials',
    color: 'hsl(var(--chart-1))',
  },
  Lifestyle: {
    label: 'Lifestyle',
    color: 'hsl(var(--chart-2))',
  },
  Impulse: {
    label: 'Impulse',
    color: 'hsl(var(--chart-3))',
  },
};

export function SpendingsBubbleChart() {
  const totalSpendings = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, []);

  return (
    <Card className="flex flex-col bg-card/80 backdrop-blur-lg border-border">
      <CardHeader>
        <CardTitle className="font-headline">Spendees</CardTitle>
        <CardDescription>Your spending breakdown</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[200px] w-[200px]"
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={80}
              strokeWidth={2}
              stroke="hsl(var(--background))"
            >
              {chartData.map(entry => (
                <Cell key={entry.name} fill={entry.color} />
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
                   <p className="text-xs text-muted-foreground">Total</p>
                   <p className="text-2xl font-bold font-headline text-foreground">
                    ${totalSpendings.toLocaleString()}
                  </p>
                </div>
              </foreignObject>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-4">
        <ChartLegend
          content={<ChartLegendContent nameKey="name" />}
          className="-mt-2"
        />
      </CardFooter>
    </Card>
  );
}
