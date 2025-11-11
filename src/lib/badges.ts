import { LucideIcon, Goal, Star, Shield, Gem, Crown, Rocket } from "lucide-react";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export const badges: Badge[] = [
  {
    id: "badge-first-goal",
    name: "Goal Setter",
    description: "You've set your first savings goal. The journey begins!",
    icon: Goal,
    color: "#a855f7", // Purple
  },
  {
    id: "badge-goal-getter",
    name: "Goal Getter",
    description: "Congratulations on completing your first savings goal!",
    icon: Star,
    color: "#eab308", // Yellow
  },
  {
    id: "badge-five-goals",
    name: "Five Star Financer",
    description: "You've successfully completed five savings goals.",
    icon: Shield,
    color: "#22c55e", // Green
  },
  {
    id: "badge-ten-goals",
    name: "Decade of Dedication",
    description: "Ten goals completed! You're a savings master.",
    icon: Gem,
    color: "#3b82f6", // Blue
  },
  {
    id: "badge-high-value-goal",
    name: "High Roller",
    description: "Completed a savings goal over $1,000.",
    icon: Crown,
    color: "#ef4444", // Red
  },
  {
    id: "badge-fast-goal",
    name: "Rocket Saver",
    description: "Completed a savings goal in less than a month.",
    icon: Rocket,
    color: "#f97316", // Orange
  },
];
