'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const chartData = [
  { name: 'Essentials', value: 4332, color: 'hsl(var(--chart-1))' },
  { name: 'Lifestyle', value: 2128, color: 'hsl(var(--chart-4))' },
  { name: 'Impulse', value: 1140, color: 'hsl(330, 80%, 60%)' },
];

export function SpendingsBubbleChart() {
  const totalSpendings = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, []);

  const bubbles = chartData.map(item => {
    const percentage = (item.value / totalSpendings) * 100;
    return {
      ...item,
      percentage: Math.round(percentage),
      size: Math.sqrt(percentage) * 12, // Scale size for better visual balance
    };
  });

  // Position the bubbles manually for the desired overlap effect
  const bubblePositions: { [key: string]: { top?: string, bottom?: string, left?: string, right?: string } } = {
    Essentials: { top: '0%', left: '15%' },
    Lifestyle: { bottom: '5%', right: '10%' },
    Impulse: { bottom: '20%', left: '5%' },
  };

  return (
    <Card className="flex flex-col bg-card/80 backdrop-blur-lg border-border">
      <CardHeader className="items-center pb-0">
        <CardTitle className="font-headline">Spendees</CardTitle>
        <CardDescription>Your spending breakdown</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        <div className="relative w-full h-[250px]">
          {bubbles.map(bubble => {
            const position = bubblePositions[bubble.name];
            return (
              <div
                key={bubble.name}
                className="absolute rounded-full flex items-center justify-center text-white font-bold text-center transition-all duration-300"
                style={{
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                  top: position.top,
                  bottom: position.bottom,
                  left: position.left,
                  right: position.right,
                  background: `radial-gradient(circle at 30% 30%, ${bubble.color}BF, ${bubble.color}80)`,
                  boxShadow: `0 0 40px -10px ${bubble.color}`,
                  backdropFilter: 'blur(4px)',
                }}
              >
                <div className='flex flex-col'>
                  <span className="text-2xl font-headline">{bubble.percentage}%</span>
                  <span className="text-xs uppercase tracking-wider">{bubble.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
