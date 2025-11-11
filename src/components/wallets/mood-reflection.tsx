'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { getMoodBasedInsights } from '@/ai/flows/mood-based-insights';
import { Bot } from 'lucide-react';

const moods = [
  { emoji: '😃', label: 'Happy' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😞', label: 'Sad' },
  { emoji: '😠', label: 'Angry' },
  { emoji: '😥', label: 'Stressed' },
];

// Mock data for AI call
const mockTransactions = [
  { txnId: '1', amount: 25.50, merchant: 'Starbucks', category: 'Food', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
  { txnId: '2', amount: 12.00, merchant: 'Netflix', category: 'Entertainment', timestamp: new Date(Date.now() - 86400000 * 5).toISOString() },
  { txnId: '3', amount: 300.00, merchant: 'Amazon', category: 'Shopping', timestamp: new Date(Date.now() - 86400000 * 10).toISOString() },
];


export function MoodReflection() {
    const [selectedMood, setSelectedMood] = React.useState<string | null>(null);
    const [isProcessing, setIsProcessing] = React.useState(false);
    const { toast } = useToast();

    const handleMoodSelect = async (mood: { emoji: string; label: string }) => {
        if (isProcessing) return;
        
        setIsProcessing(true);
        setSelectedMood(mood.emoji);
        
        try {
            const moodEntry = { entryId: 'temp', mood: mood.label, timestamp: new Date().toISOString() };
            const result = await getMoodBasedInsights({
                moodEntries: [moodEntry],
                transactions: mockTransactions,
            });

            const insight = result.insights[0] || `You've logged your feeling as: ${mood.label}`;
            
            toast({
                title: (
                    <div className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-accent" />
                        Finny's Insight
                    </div>
                ),
                description: insight,
            });

        } catch (error) {
            console.error("Failed to get mood insight:", error);
            toast({
                title: "Mood Logged!",
                description: `You've logged your feeling as: ${mood.label}`,
            });
        } finally {
            // Reset after a short delay to allow toast to be seen
            setTimeout(() => setIsProcessing(false), 1000);
        }
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
                    disabled={isProcessing}
                    className={cn(
                        "text-3xl p-2 rounded-full transition-all duration-200 disabled:opacity-50",
                        selectedMood === mood.emoji && isProcessing
                          ? 'bg-primary/30 scale-125' 
                          : 'hover:bg-primary/20 hover:scale-110'
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
