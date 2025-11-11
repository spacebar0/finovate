
'use client';

import { Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GhostIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-red-500"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 8C4 4.68629 6.68629 2 10 2H14C17.3137 2 20 4.68629 20 8V14C20 17.3137 17.3137 20 14 20H10C6.68629 20 4 17.3137 4 14V8Z" />
    <path
      d="M16 20V22L14 20L12 22L10 20L8 22L6 20"
      stroke="hsl(var(--background))"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="8.5" cy="10.5" r="1.5" fill="white" />
    <circle cx="15.5" cy="10.5" r="1.5" fill="white" />
  </svg>
);

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

export function StreakTracker() {
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
          <GhostIcon />
          <h3 className="text-lg font-bold font-headline uppercase tracking-wider">
            {completedDays} Day Streak
          </h3>
        </div>
        <Button className="bg-green-500 hover:bg-green-600 text-black font-bold shadow-lg">
          Save Today
        </Button>
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
        Only 4% of Fundies made it there, keep it up!
      </p>
    </div>
  );
}
