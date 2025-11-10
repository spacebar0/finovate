'use client';

import * as React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  YAxis,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
  { date: '2024-07-01', spending: 4000 },
  { date: '2024-07-02', spending: 3000 },
  { date: '2024-07-03', spending: 5000 },
  { date: '2024-07-04', spending: 8000 },
  { date: '2024-07-05', spending: 4500 },
  { date: '2024-07-06', spending: 6000 },
  { date: '2024-07-07', spending: 7000 },
];

const chartConfig = {
  spending: {
    label: 'Spending',
    color: 'hsl(var(--primary))',
  },
};

export function SpendingTrendChart() {
  return (
    <Card className="bg-card/80 backdrop-blur-lg border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline">Spending Trend</CardTitle>
        <Select defaultValue="7">
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Last 7 days" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 3 months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="white" stopOpacity={0.4} />
                <stop offset="95%" stopColor="white" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
            <Tooltip
              cursor={{
                stroke: 'hsl(var(--primary))',
                strokeWidth: 1,
                strokeDasharray: '3 3',
              }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="p-2 bg-background/80 backdrop-blur-sm rounded-lg border border-border shadow-lg">
                      <p className="text-foreground font-bold">{`$${(
                        payload[0].value as number
                      ).toLocaleString()}`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              dataKey="spending"
              type="monotone"
              stroke="white"
              strokeWidth={2}
              fill="url(#spendingGradient)"
              dot={false}
              activeDot={{
                r: 6,
                fill: 'hsl(var(--primary))',
                stroke: 'white',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
