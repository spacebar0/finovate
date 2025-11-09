
"use client";

import * as React from "react";
import { Pie, PieChart, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  ChartContainer,
} from "@/components/ui/chart";
import { budgetHealth } from "@/lib/data";
import { Button } from "@/components/ui/button";

const chartConfig = {
  progress: {
    label: "Progress",
    color: "hsl(var(--primary))",
  },
  background: {
    label: "Background",
    color: "hsl(var(--muted))"
  }
};

export function BudgetHealth() {
  const chartData = [
    { name: "progress", value: budgetHealth.percentage, fill: "url(#gradient-primary)" },
    { name: "background", value: 100 - budgetHealth.percentage, fill: chartConfig.background.color },
  ];

  return (
    <Card className="flex flex-col bg-card backdrop-blur-lg border-border">
      <CardHeader>
        <CardTitle className="font-headline">Budget Health</CardTitle>
        <CardDescription>
          {budgetHealth.status} for this month
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-full max-h-[200px]"
        >
          <PieChart>
            <defs>
              <linearGradient id="gradient-primary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--secondary))" />
              </linearGradient>
            </defs>
            <Pie
              data={[{ value: 100 }]}
              dataKey="value"
              strokeWidth={0}
              innerRadius={60}
              outerRadius={80}
              fill={chartConfig.background.color}
              startAngle={90}
              endAngle={450}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={80}
              startAngle={90}
              endAngle={90 + (budgetHealth.percentage / 100) * 360}
              cornerRadius={50}
              strokeWidth={0}
            >
               {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.name === 'progress' ? entry.fill : 'none'} />
              ))}
            </Pie>
             <foreignObject x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" width="120" height="120" transform="translate(-60, -60)">
                <div className="w-full h-full flex flex-col items-center justify-center text-center">
                  <p className="text-4xl font-bold font-headline text-foreground">
                    {budgetHealth.percentage}%
                  </p>
                  <p className="text-sm text-muted-foreground">On Track</p>
                </div>
              </foreignObject>
          </PieChart>
        </ChartContainer>
      </CardContent>
       <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center justify-between w-full">
            <span className="text-muted-foreground">Current Savings</span>
            <span className="font-semibold text-foreground">${budgetHealth.savings.toFixed(2)}</span>
        </div>
        <Button className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-[0_4px_15px_rgba(53,37,139,0.35)] hover:shadow-lg transition-shadow">
          Adjust Budget
        </Button>
      </CardFooter>
    </Card>
  );
}

