'use client';

import * as React from 'react';
import { Label, RadialBar, RadialBarChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { name: 'Essentials', value: 4332, fill: 'var(--color-essentials)' },
  { name: 'Lifestyle', value: 2128, fill: 'var(--color-lifestyle)' },
  { name: 'Impulse', value: 1140, fill: 'var(--color-impulse)' },
];

const chartConfig = {
  value: {
    label: 'Spendings',
  },
  essentials: {
    label: 'Essentials',
    color: 'hsl(var(--chart-1))',
  },
  lifestyle: {
    label: 'Lifestyle',
    color: 'hsl(var(--chart-4))',
  },
  impulse: {
    label: 'Impulse',
    color: 'hsl(330, 80%, 60%)',
  },
};

export function SpendingsBubbleChart() {
  const totalValue = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, []);

  return (
    <Card className="flex flex-col bg-card/80 backdrop-blur-lg border-border">
      <CardHeader className="items-center pb-0">
        <CardTitle className="font-headline">Spendees</CardTitle>
        <CardDescription>Your spending breakdown</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={270}
            innerRadius={80}
            outerRadius={110}
            barSize={10}
          >
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value) => `$${value.toLocaleString()}`}
                />
              }
            />
            <RadialBar
              dataKey="value"
              background={{
                fill: 'hsla(var(--muted), 0.5)',
              }}
            />
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
                        ${totalValue.toLocaleString()}
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
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-4">
        <ChartLegend
          content={<ChartLegendContent nameKey="name" />}
          className="flex-wrap"
        />
      </CardFooter>
    </Card>
  );
}
