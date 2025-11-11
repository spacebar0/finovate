
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { quests as mockQuests, type Quest } from '@/lib/data';
import { QuestCard } from '@/components/quests/quest-card';
import { useToast } from '@/hooks/use-toast';
import { Target, Check, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

type FilterType = 'All' | Quest['category'];
const questCategories: FilterType[] = ['All', 'Savings', 'Budgeting', 'Learning', 'Investment', 'Community'];

export default function QuestsPage() {
  const [quests, setQuests] = React.useState<Quest[]>(mockQuests);
  const [activeFilter, setActiveFilter] = React.useState<FilterType>('All');
  const { toast } = useToast();

  const handleStartQuest = (questId: string) => {
    setQuests(prevQuests =>
      prevQuests.map(q =>
        q.id === questId ? { ...q, status: 'active', progress: 0 } : q
      )
    );
    const quest = quests.find(q => q.id === questId);
    toast({
      title: 'Quest Started!',
      description: `You've started the "${quest?.title}" quest. Good luck!`,
    });
  };

  const filteredQuests =
    activeFilter === 'All'
      ? quests
      : quests.filter(q => q.category === activeFilter);

  const activeQuests = filteredQuests.filter(q => q.status === 'active');
  const availableQuests = filteredQuests.filter(q => q.status === 'available');
  const completedQuests = filteredQuests.filter(q => q.status === 'completed');

  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-6 space-y-8">
      <Card
        className="overflow-hidden"
        style={{
          background: 'hsla(0, 0%, 100%, 0.05)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <CardHeader className="text-center">
          <Target className="mx-auto h-12 w-12 text-primary mb-2" />
          <CardTitle className="font-headline text-3xl">Quests & Badges</CardTitle>
          <p className="text-muted-foreground">
            Complete challenges to earn XP, level up, and unlock rewards.
          </p>
        </CardHeader>
      </Card>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {questCategories.map(category => (
          <Button
            key={category}
            variant={activeFilter === category ? 'secondary' : 'ghost'}
            onClick={() => setActiveFilter(category)}
            className={cn(activeFilter === category && 'shadow-[0_0_12px_theme(colors.primary.DEFAULT)]')}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="space-y-8">
        {activeQuests.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold font-headline mb-4 flex items-center">
              <Check className="mr-3 h-6 w-6 text-green-400" />
              Active Quests
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeQuests.map(quest => (
                <QuestCard key={quest.id} quest={quest} onStartQuest={handleStartQuest} />
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold font-headline mb-4 flex items-center">
            <Target className="mr-3 h-6 w-6 text-primary" />
            Available Quests
          </h2>
          {availableQuests.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableQuests.map(quest => (
                <QuestCard key={quest.id} quest={quest} onStartQuest={handleStartQuest} />
              ))}
            </div>
          ) : (
             <div className="text-center py-10 rounded-lg" style={{ background: "hsla(0, 0%, 100%, 0.05)", backdropFilter: "blur(12px)" }}>
                <p className="text-muted-foreground">No available quests in this category. Check back later!</p>
             </div>
          )}
        </div>
        
        {completedQuests.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="completed-quests" className="border-none">
              <AccordionTrigger className="text-2xl font-bold font-headline mb-4 flex items-center no-underline hover:no-underline">
                <Trophy className="mr-3 h-6 w-6 text-accent" />
                Completed Quests
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {completedQuests.map(quest => (
                    <QuestCard key={quest.id} quest={quest} onStartQuest={handleStartQuest} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </div>
  );
}
