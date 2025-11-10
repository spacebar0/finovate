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
    const size = 50 + percentage * 2.5; 
    return {
      ...item,
      percentage: Math.round(percentage),
      size: size,
    };
  });

  // Explicitly defining positions for visibility and overlap
  const bubblePositions: { [key: string]: { top: string, left: string, zIndex: number } } = {
    Essentials: { top: '50%', left: '50%', zIndex: 1 }, // Center and back
    Lifestyle: { top: '30%', left: '25%', zIndex: 2 }, // Top-left overlap
    Impulse: { top: '65%', left: '20%', zIndex: 3 },  // Bottom-left overlap
  };

  return (
    <Card className="flex flex-col bg-card/80 backdrop-blur-lg border-border">
      <CardHeader className="items-center pb-0">
        <CardTitle className="font-headline">Spendees</CardTitle>
        <CardDescription>Your spending breakdown</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        <div className="relative w-[300px] h-[250px]">
          {bubbles.map(bubble => {
            const position = bubblePositions[bubble.name];
            return (
              <div
                key={bubble.name}
                className="absolute rounded-full flex items-center justify-center text-white font-bold text-center -translate-x-1/2 -translate-y-1/2"
                style={{
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                  top: position.top,
                  left: position.left,
                  zIndex: position.zIndex,
                  backgroundColor: bubble.color, // SOLID COLOR
                  boxShadow: `0 0 20px ${bubble.color}`, // Glow effect
                }}
              >
                <div className='flex flex-col'>
                  <span className="text-2xl font-headline drop-shadow-md">{bubble.percentage}%</span>
                  <span className="text-xs uppercase tracking-wider opacity-80">{bubble.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
