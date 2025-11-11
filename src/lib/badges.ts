import type { LucideIcon } from "lucide-react";
import { Goal, Star, Shield, Gem, Crown, Rocket } from "lucide-react";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Changed from LucideIcon to string for image paths
  color: string;
}

export const badges: Badge[] = [
  {
    id: "badge-first-goal",
    name: "Goal Setter",
    description: "You've set your first savings goal. The journey begins!",
    icon: "/images/badges/1.png",
    color: "#a855f7", // Purple
  },
  {
    id: "badge-goal-getter",
    name: "Goal Getter",
    description: "Congratulations on completing your first savings goal!",
    icon: "/images/badges/2.png",
    color: "#eab308", // Yellow
  },
  {
    id: "badge-five-goals",
    name: "Five Star Financer",
    description: "You've successfully completed five savings goals.",
    icon: "/images/badges/3.png",
    color: "#22c55e", // Green
  },
  {
    id: "badge-ten-goals",
    name: "Decade of Dedication",
    description: "Ten goals completed! You're a savings master.",
    icon: "/images/badges/4.png",
    color: "#3b82f6", // Blue
  },
  {
    id: "badge-high-value-goal",
    name: "High Roller",
    description: "Completed a savings goal over $1,000.",
    icon: "/images/badges/5.png",
    color: "#ef4444", // Red
  },
  {
    id: "badge-fast-goal",
    name: "Rocket Saver",
    description: "Completed a savings goal in less than a month.",
    icon: "/images/badges/6.png",
    color: "#f97316", // Orange
  },
];
