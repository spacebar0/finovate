'use client';

import * as React from 'react';
import { Label, Pie, PieChart, Cell } from 'recharts';
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
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

const chartData = [
  { name: 'Essentials', value: 4332, color: 'hsl(var(--chart-1))' },
  { name: 'Lifestyle', value: 2128, color: 'hsl(var(--chart-4))' },
  { name: 'Impulse', value: 1140, color: 'hsl(330, 80%, 60%)' },
];

const chartConfig = {
  value: {
    label: 'Spendings',
  },
  Essentials: {
    label: 'Essentials',
    color: 'hsl(var(--chart-1))',
  },
  Lifestyle: {
    label: 'Lifestyle',
    color: 'hsl(var(--chart-4))',
  },
  Impulse: {
    label: 'Impulse',
    color: 'hsl(330, 80%, 60%)',
  },
};

export function SpendingsBubbleChart() {
  const totalSpendings = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, []);

  return (
    <Card className="flex flex-col bg-card/80 backdrop-blur-lg border-border">
      <CardHeader className="items-center pb-0">
        <CardTitle className="font-headline">Spendees</CardTitle>
        <CardDescription>Your spending breakdown</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={8}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold font-headline"
                        >
                          ${totalSpendings.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Spent
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
              {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-4">
        <ChartLegend
            content={<ChartLegendContent nameKey="name" />}
            className="-mx-2 flex-wrap"
          />
      </CardFooter>
    </Card>
  );
}
