'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateBehaviorNudges } from '@/ai/flows/generate-behavior-nudges';
import { getMoodBasedInsights } from '@/ai/flows/mood-based-insights';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, Bot } from 'lucide-react';

// Mock data - replace with actual Firestore data
const mockTransactions = [
  { txnId: '1', amount: 25.50, merchant: 'Starbucks', category: 'Food', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
  { txnId: '2', amount: 12.00, merchant: 'Netflix', category: 'Entertainment', timestamp: new Date(Date.now() - 86400000 * 5).toISOString() },
  { txnId: '3', amount: 75.00, merchant: 'Zara', category: 'Shopping', timestamp: new Date(Date.now() - 86400000 * 7).toISOString() },
  { txnId: '4', amount: 300.00, merchant: 'Amazon', category: 'Shopping', timestamp: new Date(Date.now() - 86400000 * 10).toISOString() },
];

const mockMoods = [
    { entryId: '1', mood: 'Happy', timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
    { entryId: '2', mood: 'Stressed', timestamp: new Date(Date.now() - 86400000 * 11).toISOString() },
]

export function FinnyInsights({ userId }: { userId?: string }) {
  const [nudge, setNudge] = React.useState<string | null>(null);
  const [moodInsight, setMoodInsight] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!userId) return;

    const fetchInsights = async () => {
      setIsLoading(true);
      try {
        const [nudgeRes, moodRes] = await Promise.all([
          generateBehaviorNudges({
            userId,
            transactionData: JSON.stringify(mockTransactions),
          }),
          getMoodBasedInsights({
            transactions: mockTransactions,
            moodEntries: mockMoods,
          })
        ]);

        setNudge(nudgeRes.nudge);
        if (moodRes.insights.length > 0) {
            setMoodInsight(moodRes.insights[0]);
        }
        
      } catch (error) {
        console.error("Failed to fetch AI insights:", error);
        setNudge("Could not fetch insights at the moment. Please try again later.");
      }
      setIsLoading(false);
    };

    fetchInsights();
  }, [userId]);

  return (
    <Card style={{ background: "hsla(0, 0%, 100%, 0.05)", backdropFilter: "blur(12px)" }}>
      <CardHeader className='flex-row items-center gap-3'>
        <Bot className="h-8 w-8 text-accent"/>
        <div>
            <CardTitle className="font-headline">Finny's Insights</CardTitle>
            <CardDescription>Your personal AI savings coach.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </>
        ) : (
          <>
            {nudge && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background/40">
                <Lightbulb className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                <p className="text-sm text-foreground">{nudge}</p>
              </div>
            )}
            {moodInsight && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background/40">
                <Lightbulb className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                <p className="text-sm text-foreground">{moodInsight}</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
