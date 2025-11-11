'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
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
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Slider } from '@/components/ui/slider';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const chartConfig = {
  value: {
    label: 'Value',
    color: 'hsl(var(--primary))',
  },
};

const calculateFutureValue = (
  principal: number,
  monthlyContribution: number,
  annualRate: number,
  years: number
) => {
  const data = [];
  let currentValue = principal;
  const monthlyRate = annualRate / 12 / 100;
  const totalMonths = years * 12;

  const today = new Date();

  for (let month = 0; month <= totalMonths; month++) {
    const date = new Date(today.getFullYear(), today.getMonth() + month, 1);
    data.push({
      date: date.toISOString(),
      value: Math.round(currentValue),
    });
    currentValue += monthlyContribution;
    currentValue *= 1 + monthlyRate;
  }
  return data;
};

export function InvestmentGrowthChart() {
  const [monthlyContribution, setMonthlyContribution] = React.useState(250);
  const [isClient, setIsClient] = React.useState(false);
  const [chartData, setChartData] = React.useState<any[]>([]);

  React.useEffect(() => {
    setIsClient(true);
  }, []);
  
  React.useEffect(() => {
    if (isClient) {
      setChartData(calculateFutureValue(10000, monthlyContribution, 7, 10));
    }
  }, [monthlyContribution, isClient]);

  if (!isClient) {
    return (
      <Card className="bg-card/80 backdrop-blur-lg border-border">
        <CardHeader>
          <CardTitle className="font-headline">Future Value Simulator</CardTitle>
          <CardDescription>
            See how your investments could grow over the next 10 years.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-full" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="bg-card/80 backdrop-blur-lg border-border">
      <CardHeader>
        <CardTitle className="font-headline">Future Value Simulator</CardTitle>
        <CardDescription>
          See how your investments could grow over the next 10 years.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={value => format(new Date(value), 'yyyy')}
              interval="preserveStartEnd"
              minTickGap={80}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={value => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 2 }}
              content={<ChartTooltipContent
                formatter={(value) => `$${(value as number).toLocaleString()}`}
                labelFormatter={(label) => format(new Date(label), 'MMM yyyy')}
              />}
            />
            <Area
              dataKey="value"
              type="monotone"
              fill="url(#colorValue)"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
        <div className="w-full">
          <label htmlFor="contribution" className="text-sm font-medium">
            Monthly Contribution: ${monthlyContribution}
          </label>
          <Slider
            id="contribution"
            min={50}
            max={1000}
            step={50}
            value={[monthlyContribution]}
            onValueChange={value => setMonthlyContribution(value[0])}
            className="mt-2"
          />
        </div>
      </CardFooter>
    </Card>
  );
}
