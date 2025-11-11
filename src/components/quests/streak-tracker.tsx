
'use client';

import { Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Goal } from '@/firebase/auth/types';
import { Skeleton } from '../ui/skeleton';
import Image from 'next/image';

const StreakDay = ({
  day,
  isComplete,
  isLast,
}: {
  day: string;
  isComplete: boolean;
  isLast?: boolean;
}) => (
  <div className="flex items-center">
    <div className="relative flex flex-col items-center">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-purple-600 rounded-full blur-sm opacity-75"></div>
      <div
        className="relative w-16 h-16 rounded-full bg-gray-800/80 flex flex-col items-center justify-center text-white font-bold"
      >
        {isComplete && <Flame className="h-6 w-6 text-orange-400 mb-1" />}
        <span className="text-sm">{day}</span>
      </div>
    </div>
    {!isLast && <div className="w-6 h-1 bg-gradient-to-r from-green-400 to-purple-600 mx-[-5px]"></div>}
  </div>
);

interface StreakTrackerProps {
  goals: Goal[];
  onSaveTodayClick: () => void;
  isLoading: boolean;
}

export function StreakTracker({ goals, onSaveTodayClick, isLoading }: StreakTrackerProps) {
  const streakDays = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  const completedDays = 4; // Example: 4 out of 5 days completed

  return (
    <div
      className="p-4 rounded-xl space-y-4"
      style={{
        background: 'hsl(var(--muted) / 0.5)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/images/logo.svg" alt="Finnovate Logo" width={24} height={24} />
          <h3 className="text-lg font-bold font-headline uppercase tracking-wider">
            {completedDays} Day Streak
          </h3>
        </div>
        {isLoading ? (
          <Skeleton className="h-10 w-28" />
        ) : (
          <Button 
            className="bg-green-500 hover:bg-green-600 text-black font-bold shadow-lg"
            onClick={onSaveTodayClick}
            disabled={goals.length === 0}
          >
            Save Today
          </Button>
        )}
      </div>

      <div className="flex items-center justify-center">
        {streakDays.map((day, index) => (
          <StreakDay
            key={day}
            day={day}
            isComplete={index < completedDays}
            isLast={index === streakDays.length - 1}
          />
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Only 4% of Cactillionaires made it there, keep it up!
      </p>
    </div>
  );
}
