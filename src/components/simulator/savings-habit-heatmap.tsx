'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { subDays, format, isSameDay } from 'date-fns';

const generateHeatmapData = (days: number) => {
  const data = new Map<string, number>();
  let streak = 0;
  let maxStreak = 0;
  for (let i = 0; i < days; i++) {
    const date = subDays(new Date(), i);
    const formattedDate = format(date, 'yyyy-MM-dd');
    const saved = Math.random() > 0.3; // 70% chance of saving
    if (saved) {
      data.set(formattedDate, Math.floor(Math.random() * 4) + 1); // Intensity 1-4
      streak++;
    } else {
      maxStreak = Math.max(maxStreak, streak);
      streak = 0;
    }
  }
  maxStreak = Math.max(maxStreak, streak);
  return { data, maxStreak };
};


export function SavingsHabitHeatmap() {
  const [isClient, setIsClient] = React.useState(false);
  const [heatmapData, setHeatmapData] = React.useState<{ data: Map<string, number>; maxStreak: number }>({ data: new Map(), maxStreak: 0 });

  React.useEffect(() => {
    setIsClient(true);
    setHeatmapData(generateHeatmapData(90));
  }, []);

  const today = new Date();
  const days = Array.from({ length: 90 }, (_, i) => subDays(today, 89 - i));

  const intensityColors = [
    'bg-muted/20', // Level 0 (no savings)
    'bg-primary/20', // Level 1
    'bg-primary/40', // Level 2
    'bg-primary/70', // Level 3
    'bg-primary',      // Level 4
  ];
  
  if (!isClient) return null;

  return (
    <Card className="bg-card/80 backdrop-blur-lg border-border">
      <CardHeader>
        <CardTitle className="font-headline">Savings Habit Heatmap</CardTitle>
        <CardDescription>Your savings consistency over the last 3 months.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="grid grid-cols-15 grid-rows-7 gap-1.5 w-full">
          {days.map(day => {
            const formattedDate = format(day, 'yyyy-MM-dd');
            const intensity = heatmapData.data.get(formattedDate) || 0;
            return (
              <div
                key={day.toString()}
                className={`w-full aspect-square rounded-sm ${intensityColors[intensity]} ${isSameDay(day, today) ? 'ring-2 ring-accent' : ''}`}
                title={`${formattedDate}: Level ${intensity}`}
              />
            );
          })}
        </div>
        <style jsx>{`.grid-cols-15 { grid-template-columns: repeat(15, minmax(0, 1fr)); }`}</style>
      </CardContent>
       <CardFooter className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Longest Streak</span>
        <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">{heatmapData.maxStreak} days</Badge>
      </CardFooter>
    </Card>
  );
}
