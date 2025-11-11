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
import { Badge } from '@/components/ui/badge';
import { format, subDays } from 'date-fns';
import { Skeleton } from '../ui/skeleton';

const chartConfig = {
  score: {
    label: 'Health Score',
    color: 'hsl(var(--accent))',
  },
};

const generateHealthScoreData = (days: number) => {
  const data = [];
  let lastScore = 75;
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const change = (Math.random() - 0.45) * 5; // Fluctuate score
    lastScore = Math.max(40, Math.min(95, lastScore + change));
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      score: Math.round(lastScore),
    });
  }
  return data;
};

export function FinancialHealthTimeline() {
  const [isClient, setIsClient] = React.useState(false);
  const [chartData, setChartData] = React.useState<any[]>([]);

  React.useEffect(() => {
    setIsClient(true);
    setChartData(generateHealthScoreData(30));
  }, []);

  if (!isClient) {
    return (
      <Card style={{ 
        background: "hsla(0, 0%, 100%, 0.05)",
        backdropFilter: "blur(12px)",
      }}>
        <CardHeader>
          <CardTitle className="font-headline">Financial Health Score</CardTitle>
          <CardDescription>
            Your AI-calculated financial score over the last 30 days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-6 w-20" />
        </CardFooter>
      </Card>
    );
  }
  
  const currentScore = chartData.length > 0 ? chartData[chartData.length - 1].score : 0;
  const scoreChange = chartData.length > 1 ? currentScore - chartData[chartData.length - 2].score : 0;
  
  const getStatusBadge = () => {
    if (scoreChange > 2) return <Badge variant="secondary" className="bg-green-500/20 text-green-300">Improving</Badge>;
    if (scoreChange < -2) return <Badge variant="destructive">Declining</Badge>;
    return <Badge variant="outline">Stable</Badge>;
  }

  return (
    <Card style={{ 
      background: "hsla(0, 0%, 100%, 0.05)",
      backdropFilter: "blur(12px)",
    }}>
      <CardHeader>
        <CardTitle className="font-headline">Financial Health Score</CardTitle>
        <CardDescription>
          Your AI-calculated financial score over the last 30 days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--accent))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--accent))"
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
              tickFormatter={value => format(new Date(value), 'd MMM')}
              interval={6}
            />
            <YAxis
              dataKey="score"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[40, 100]}
            />
            <Tooltip
              cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
              content={<ChartTooltipContent
                labelFormatter={(label) => format(new Date(label), 'MMM d, yyyy')}
              />}
            />
            <Area
              dataKey="score"
              type="monotone"
              fill="url(#colorScore)"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
         <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-headline text-foreground">{currentScore}</span>
            <span className="text-sm text-muted-foreground">/ 100</span>
         </div>
        {getStatusBadge()}
      </CardFooter>
    </Card>
  );
}
