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
import { format, subDays } from 'date-fns';

type ChartData = { date: string; spending: number };

const generateData = (days: number): ChartData[] => {
  const today = new Date();
  return Array.from({ length: days }, (_, i) => {
    const date = subDays(today, days - 1 - i);
    return {
      date: format(date, 'yyyy-MM-dd'),
      spending:
        2000 +
        Math.sin(i / (days / (Math.PI * (days > 30 ? 4 : 2)))) * 1500 + // Seasonal trend
        Math.random() * 800, // Daily noise
    };
  }).map(d => ({ ...d, spending: Math.round(d.spending) }));
};

export function SpendingTrendChart() {
  const [timeRange, setTimeRange] = React.useState('7');
  const [chartData, setChartData] = React.useState<ChartData[]>([]);

  React.useEffect(() => {
    const dataSets: { [key: string]: ChartData[] } = {
      '7': generateData(7),
      '30': generateData(30),
      '90': generateData(90),
    };
    setChartData(dataSets[timeRange] || []);
  }, [timeRange]);

  return (
    <Card className="bg-card/80 backdrop-blur-lg border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline">Spending Trend</CardTitle>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select range" />
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
                       <p className="text-muted-foreground text-xs">{format(new Date(label), "MMM d, yyyy")}</p>
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
