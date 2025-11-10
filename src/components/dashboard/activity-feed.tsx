'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { activityFeed as initialActivityFeed } from "@/lib/data";
import { Lightbulb, ShieldCheck, TrendingUp, Award } from "lucide-react";
import { cn } from '@/lib/utils';

const iconMap: { [key: string]: React.ElementType } = {
  Lightbulb,
  ShieldCheck,
  TrendingUp,
  Award,
};

type ActivityItem = (typeof initialActivityFeed)[0];

export function ActivityFeed() {
  const [feedItems, setFeedItems] = React.useState<ActivityItem[]>(initialActivityFeed);
  const [dismissingId, setDismissingId] = React.useState<string | null>(null);

  const handleDismiss = (id: string) => {
    setDismissingId(id);
    
    // The animation duration is 500ms. After that, remove the item.
    setTimeout(() => {
      setFeedItems((prevItems) => prevItems.filter((item) => item.id !== id));
      setDismissingId(null);
    }, 500);
  };

  return (
    <Card className="bg-card/80 backdrop-blur-lg border-border">
      <CardHeader>
        <CardTitle className="font-headline">Activity Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {feedItems.map((item) => {
            const Icon = iconMap[item.icon];
            const isAchievement = item.type === "achievement";
            const isDismissing = dismissingId === item.id;
            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-lg bg-background/40 transition-all duration-500",
                  isDismissing && "animate-slide-out"
                )}
              >
                {Icon && (
                  <div className={isAchievement ? "text-accent" : "text-primary"}>
                    <Icon className="h-6 w-6" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={isAchievement ? "outline" : "default"}
                    size="sm"
                    className={
                      isAchievement
                        ? "border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                        : "bg-primary/80 hover:bg-primary"
                    }
                  >
                    {item.actions[0]}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDismiss(item.id)}>
                    {item.actions[1]}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}