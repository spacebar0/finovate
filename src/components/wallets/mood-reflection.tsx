'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const moods = [
  { emoji: '😃', label: 'Happy' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😞', label: 'Sad' },
  { emoji: '😠', label: 'Angry' },
  { emoji: ' stressed', label: 'Stressed' },
];

export function MoodReflection() {
    const [selectedMood, setSelectedMood] = React.useState<string | null>(null);
    const { toast } = useToast();

    const handleMoodSelect = (mood: { emoji: string; label: string }) => {
        setSelectedMood(mood.emoji);
        // Here you would typically save the mood to Firestore
        // For now, we'll just show a toast
        toast({
            title: "Mood Logged!",
            description: `You've logged your feeling as: ${mood.label}`,
        });
    };

  return (
    <Card style={{ background: "hsla(0, 0%, 100%, 0.05)", backdropFilter: "blur(12px)" }}>
      <CardHeader>
        <CardTitle className="font-headline">Mood Check-in</CardTitle>
        <CardDescription>How do you feel about your spending this week?</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around items-center">
            {moods.map(mood => (
                <button
                    key={mood.label}
                    onClick={() => handleMoodSelect(mood)}
                    className={cn(
                        "text-3xl p-2 rounded-full transition-all duration-200",
                        selectedMood === mood.emoji ? 'bg-primary/30 scale-125' : 'hover:bg-primary/20 hover:scale-110'
                    )}
                    aria-label={`Select mood: ${mood.label}`}
                >
                    {mood.emoji}
                </button>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
