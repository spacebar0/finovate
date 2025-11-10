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

const ActiveSectorMark = ({
  cx,
  cy,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
}: any) => {
  if (!cx || !cy) return null;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius * 1.05}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="hsl(var(--background))"
        strokeWidth={2}
      />
    </g>
  );
};


export function SpendingsBubbleChart() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const totalSpendings = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, []);
  const activeEntry = chartData[activeIndex];

  return (
    <Card className="flex flex-col bg-card/80 backdrop-blur-lg border-border">
      <CardHeader className="items-center pb-0">
        <CardTitle className="font-headline">Spendees</CardTitle>
        <CardDescription>Your spending breakdown</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(0)}
          >
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={80}
              outerRadius={100}
              startAngle={90}
              endAngle={450}
              stroke="hsl(var(--background))"
              strokeWidth={3}
              activeIndex={activeIndex}
              activeShape={ActiveSectorMark}
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
              width="160"
              height="160"
              transform="translate(-80, -80)"
            >
              <div className="w-full h-full flex flex-col items-center justify-center text-center">
                <p className="text-muted-foreground text-sm font-medium">
                  {activeEntry.name}
                </p>
                <p className="text-3xl font-bold font-headline text-foreground">
                  ${activeEntry.value.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {Math.round((activeEntry.value / totalSpendings) * 100)}% of
                  total
                </p>
              </div>
            </foreignObject>
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
