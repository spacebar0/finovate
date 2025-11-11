'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function QuestsPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-6">
      <Card style={{ 
        background: "hsla(0, 0%, 100%, 0.05)",
        backdropFilter: "blur(12px)",
      }}>
        <CardHeader>
          <CardTitle className="font-headline">Quests & Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This is a placeholder for the Quests & Badges page.</p>
        </CardContent>
      </Card>
    </div>
  );
}
