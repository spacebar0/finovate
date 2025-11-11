'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WalletsPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-6">
      <Card style={{ 
        background: "hsla(0, 0%, 100%, 0.05)",
        backdropFilter: "blur(12px)",
      }}>
        <CardHeader>
          <CardTitle className="font-headline">Wallets & Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This is a placeholder for the Wallets & Goals page.</p>
        </CardContent>
      </Card>
    </div>
  );
}
