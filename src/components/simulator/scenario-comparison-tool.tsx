'use client';

import * as React from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
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

const chartConfig = {
  scenarioA: {
    label: 'Scenario A',
    color: 'hsl(var(--chart-1))',
  },
  scenarioB: {
    label: 'Scenario B',
    color: 'hsl(var(--chart-2))',
  },
};

const calculateFutureValue = (
  principal: number,
  monthlyContribution: number,
  annualRate: number,
  years: number
) => {
  let currentValue = principal;
  const monthlyRate = annualRate / 12 / 100;
  const totalMonths = years * 12;
  
  const data = [];
  for (let month = 0; month <= totalMonths; month++) {
      data.push(currentValue);
      currentValue += monthlyContribution;
      currentValue *= (1 + monthlyRate);
  }
  return data;
};


export function ScenarioComparisonTool() {
  const [contributionA, setContributionA] = React.useState(250);
  const [contributionB, setContributionB] = React.useState(500);

  const years = 10;
  const principal = 10000;
  const annualRate = 7;

  const dataA = calculateFutureValue(principal, contributionA, annualRate, years);
  const dataB = calculateFutureValue(principal, contributionB, annualRate, years);
  
  const chartData = dataA.map((valA, index) => {
    const date = new Date(new Date().getFullYear(), new Date().getMonth() + index, 1);
    return {
        date: format(date, 'yyyy-MM'),
        scenarioA: Math.round(valA),
        scenarioB: Math.round(dataB[index]),
    }
  });


  return (
    <Card className="bg-card/80 backdrop-blur-lg border-border">
      <CardHeader>
        <CardTitle className="font-headline">Scenario Comparison Tool</CardTitle>
        <CardDescription>
          Compare two different investment scenarios side-by-side.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart data={chartData}>
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
              content={<ChartTooltipContent
                formatter={(value, name) => [`$${value.toLocaleString()}`]}
                labelFormatter={(label) => format(new Date(label), 'MMM yyyy')}
              />}
            />
            <Legend />
            <Line dataKey="scenarioA" type="monotone" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} name="Scenario A" />
            <Line dataKey="scenarioB" type="monotone" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} name="Scenario B" />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="space-y-2">
            <label htmlFor="contributionA" className="text-sm font-medium">
                Scenario A: ${contributionA}/month
            </label>
            <Slider
                id="contributionA"
                min={50}
                max={1000}
                step={50}
                value={[contributionA]}
                onValueChange={value => setContributionA(value[0])}
            />
        </div>
        <div className="space-y-2">
            <label htmlFor="contributionB" className="text-sm font-medium">
                Scenario B: ${contributionB}/month
            </label>
            <Slider
                id="contributionB"
                min={50}
                max={1000}
                step={50}
                value={[contributionB]}
                onValueChange={value => setContributionB(value[0])}
            />
        </div>
      </CardFooter>
    </Card>
  );
}
