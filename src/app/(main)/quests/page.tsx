
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { quests as mockQuests, type Quest } from '@/lib/data';
import { QuestCard } from '@/components/quests/quest-card';
import { useToast } from '@/hooks/use-toast';
import { Target, Check, Trophy, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser, useDoc, useFirestore, useMemoFirebase, useCollection, updateDocumentNonBlocking } from '@/firebase';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import type { User, Goal } from '@/firebase/auth/types';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { StreakTracker } from '@/components/quests/streak-tracker';
import { DepositDialog } from '@/components/dashboard/deposit-dialog';
import { Confetti } from '@/components/ui/confetti';
import { Badge } from '@/components/ui/badge';


type FilterType = 'All' | Quest['category'];
const questCategories: FilterType[] = ['All', 'Savings', 'Budgeting', 'Learning', 'Investment', 'Community'];

const levelUpQuest: Quest = {
  id: 'q10-levelup',
  title: 'Level Up!',
  description: 'A special reward for your dedication. Collect your bonus XP!',
  category: 'Community',
  difficulty: 'Easy',
  xp: 1000,
  icon: 'Trophy',
  status: 'completed',
  progress: 1,
  goal: 1
};


export default function QuestsPage() {
  const [quests, setQuests] = React.useState<Quest[]>([levelUpQuest, ...mockQuests]);
  const [activeFilter, setActiveFilter] = React.useState<FilterType>('All');
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedGoalId, setSelectedGoalId] = React.useState<string | null>(null);
  const [completedGoalId, setCompletedGoalId] = React.useState<string | null>(null);
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [isXpClaimed, setIsXpClaimed] = React.useState(false);

  const { user } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  
  const goalsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, `users/${user.uid}/goals`);
  }, [firestore, user]);

  const { data: userData, isLoading: isUserDocLoading } = useDoc<User>(userDocRef);
  const { data: goals, isLoading: areGoalsLoading } = useCollection<Goal>(goalsCollectionRef);

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
  
  const handleDepositClick = (goal?: Goal) => {
    setSelectedGoalId(goal?.id || null);
    setIsDialogOpen(true);
  };
  
  const handleGoalComplete = (goalId: string) => {
    const goal = goals?.find(g => g.id === goalId);
    if (goal && user && firestore) {
      toast({
        title: 'Goal Completed!',
        description: `You've reached your goal for "${goal.title}"!`,
      });
      setShowConfetti(true);
      setCompletedGoalId(goalId);
      
      const goalDocRef = doc(firestore, `users/${user.uid}/goals`, goalId);

      setTimeout(() => {
        deleteDoc(goalDocRef);
        setCompletedGoalId(null);
      }, 2300);
    }
  };

  const filteredQuests =
    activeFilter === 'All'
      ? quests
      : quests.filter(q => q.category === activeFilter);

  const activeQuests = filteredQuests.filter(q => q.status === 'active');
  const availableQuests = filteredQuests.filter(q => q.status === 'available');
  const completedQuests = quests.filter(q => q.status === 'completed');
  
  // Use the user's current XP from Firestore as the base
  const currentXp = userData?.xp || 0;
  const currentLevel = Math.floor(currentXp / 1000);
  
  const xpForCurrentLevel = currentLevel * 1000;
  const xpInCurrentLevel = currentXp - xpForCurrentLevel;
  const xpNeededForNextLevel = 1000;
  const xpPercentage = (xpInCurrentLevel / xpNeededForNextLevel) * 100;
  const xpToNextLevel = xpNeededForNextLevel - xpInCurrentLevel;

  const handleCollectXp = () => {
    if (!userDocRef || !userData || isXpClaimed) return;
    
    const oldXp = userData.xp || 0;
    const newXp = oldXp + levelUpQuest.xp;
    const oldLevel = Math.floor(oldXp / 1000);
    const newLevel = Math.floor(newXp / 1000);

    updateDocumentNonBlocking(userDocRef, { xp: newXp, level: newLevel });
    setIsXpClaimed(true);

    if (newLevel > oldLevel) {
        setShowConfetti(true);
        toast({
            title: `Level Up! You're now Level ${newLevel}!`,
            description: "New rewards might be available.",
        });
    } else {
        toast({
            title: 'XP Collected!',
            description: `You earned ${levelUpQuest.xp} XP!`,
        });
    }
  };

  return (
    <>
      <Confetti active={showConfetti} setActive={setShowConfetti} />
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
          <CardContent>
            {isUserDocLoading || !userData ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4 mx-auto" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-1/4 ml-auto" />
              </div>
            ) : (
              <div className="max-w-md mx-auto">
                <div className="text-center text-sm text-muted-foreground mb-2">
                  Level {currentLevel} • {currentXp.toLocaleString()} / {(currentLevel + 1) * 1000} XP
                </div>
                <Progress value={xpPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {xpToNextLevel.toLocaleString()} XP to next level
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <StreakTracker 
          goals={goals || []}
          onSaveTodayClick={() => handleDepositClick()}
          isLoading={areGoalsLoading}
        />

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
            <Accordion type="single" collapsible className="w-full" defaultValue='item-1'>
              <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="text-2xl font-bold font-headline mb-4 no-underline hover:no-underline">
                  <div className="flex items-center">
                    <Trophy className="mr-3 h-6 w-6 text-accent" />
                    <span>Completed Quests</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card
                        key={levelUpQuest.id}
                        className='flex flex-col transition-all duration-300'
                        style={{
                            background: 'hsla(40, 100%, 50%, 0.1)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid hsla(40, 100%, 50%, 0.3)',
                        }}
                    >
                        <CardHeader className="flex-row items-start gap-4">
                            <div className="p-3 bg-background/50 rounded-lg">
                                <Trophy className="h-6 w-6 text-accent" />
                            </div>
                            <div className="flex-1">
                                <CardTitle className="font-headline text-lg">{levelUpQuest.title}</CardTitle>
                                <CardDescription className="text-sm">{levelUpQuest.description}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                            <Badge variant="outline" className='font-mono border-yellow-500/50 text-yellow-400'>Special</Badge>
                            <span className="font-bold text-accent">+{levelUpQuest.xp} XP</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            {isXpClaimed ? (
                                    <Button variant="ghost" className="w-full text-green-400 cursor-default" disabled>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    XP Claimed
                                </Button>
                            ) : (
                                <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg" onClick={handleCollectXp}>
                                    Collect XP
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                    {completedQuests.filter(q => q.id !== levelUpQuest.id).map(quest => (
                        <QuestCard key={quest.id} quest={quest} onStartQuest={handleStartQuest} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      </div>
      {goals && user && firestore && (
        <DepositDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          goals={goals}
          userId={user.uid}
          onGoalComplete={handleGoalComplete}
          initialGoalId={selectedGoalId}
        />
      )}
    </>
  );
}
