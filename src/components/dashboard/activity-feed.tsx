import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { activityFeed } from "@/lib/data";
import { Lightbulb, ShieldCheck, TrendingUp, Award } from "lucide-react";

const iconMap: { [key: string]: React.ElementType } = {
  Lightbulb,
  ShieldCheck,
  TrendingUp,
  Award,
};

export function ActivityFeed() {
  return (
    <Card className="bg-card/80 backdrop-blur-lg border-border">
      <CardHeader>
        <CardTitle className="font-headline">Activity Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activityFeed.map((item) => {
            const Icon = iconMap[item.icon];
            const isAchievement = item.type === "achievement";
            return (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-background/40"
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
                  <Button variant="ghost" size="sm">
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
