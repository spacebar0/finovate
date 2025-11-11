
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { Quest } from '@/lib/data';
import {
  PiggyBank,
  ListChecks,
  TrendingUp,
  BrainCircuit,
  Lock,
  Calendar,
  Users,
  Trophy,
  Landmark,
  CheckCircle2,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: { [key: string]: LucideIcon } = {
  PiggyBank,
  ListChecks,
  TrendingUp,
  BrainCircuit,
  Lock,
  Calendar,
  Users,
  Trophy,
  Landmark,
};

const difficultyColors = {
  Easy: 'border-green-500/50 text-green-400',
  Medium: 'border-yellow-500/50 text-yellow-400',
  Hard: 'border-red-500/50 text-red-400',
};

const categoryBackgrounds: { [key: string]: string } = {
  Savings: 'hsl(210 100% 50% / 0.1)',
  Budgeting: 'hsl(270 100% 60% / 0.1)',
  Learning: 'hsl(30 100% 50% / 0.1)',
  Investment: 'hsl(250 100% 60% / 0.1)',
  Community: 'hsl(330 100% 60% / 0.1)',
};

interface QuestCardProps {
  quest: Quest;
  onStartQuest: (questId: string) => void;
}

export function QuestCard({ quest, onStartQuest }: QuestCardProps) {
  const Icon = iconMap[quest.icon];
  const progress =
    quest.status === 'active' && quest.progress !== undefined && quest.goal
      ? (quest.progress / quest.goal) * 100
      : quest.status === 'completed' ? 100 : 0;
      
  const isCompleted = quest.status === 'completed';

  const cardStyle = {
    background: isCompleted ? 'hsla(0, 0%, 20%, 0.2)' : categoryBackgrounds[quest.category] || 'hsla(0, 0%, 100%, 0.05)',
    backdropFilter: 'blur(12px)',
    border: `1px solid ${isCompleted ? 'hsl(var(--border))' : (categoryBackgrounds[quest.category] ? categoryBackgrounds[quest.category].replace('0.1', '0.3') : 'hsl(var(--border))')}`,
  };

  return (
    <Card
      className='flex flex-col transition-all duration-300'
      style={cardStyle}
    >
      <CardHeader className="flex-row items-start gap-4">
        {Icon && (
          <div className="p-3 bg-background/50 rounded-lg">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        )}
        <div className="flex-1">
          <CardTitle className="font-headline text-lg">{quest.title}</CardTitle>
          <CardDescription className="text-sm">
            {quest.description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="flex justify-between items-center text-sm">
          <Badge
            variant="outline"
            className={cn('font-mono', difficultyColors[quest.difficulty])}
          >
            {quest.difficulty}
          </Badge>
          <span className="font-bold text-accent">+{quest.xp} XP</span>
        </div>
        {(quest.status === 'active' || quest.status === 'completed') && (
          <div className="space-y-1">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                Progress: {quest.progress}/{quest.goal}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {quest.status === 'available' && (
          <Button
            className="w-full bg-primary/80 hover:bg-primary"
            onClick={() => onStartQuest(quest.id)}
          >
            Start Quest
          </Button>
        )}
        {quest.status === 'active' && (
          <Button variant="secondary" className="w-full" disabled>
            In Progress
          </Button>
        )}
         {isCompleted && (
          <Button variant="ghost" className="w-full text-green-400 cursor-default" disabled>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Completed
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
