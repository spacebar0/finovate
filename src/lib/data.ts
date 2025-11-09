export const user = {
  name: "Alex",
  avatarUrl: "user-avatar",
  level: 4,
  xp: 1400,
  xpForNextLevel: 2000,
};

export const budgetHealth = {
  spending: 450.75,
  budget: 600,
  savingsGoal: 200,
  currentSavings: 150,
};

export type Goal = {
  id: string;
  title: string;
  currentAmount: number;
  targetAmount: number;
  deadline: string;
};

export const goals: Goal[] = [
  {
    id: "goal1",
    title: "New Laptop",
    currentAmount: 800,
    targetAmount: 1200,
    deadline: "in 2 months",
  },
  {
    id: "goal2",
    title: "Summer Vacation",
    currentAmount: 350,
    targetAmount: 1500,
    deadline: "in 5 months",
  },
  {
    id: "goal3",
    title: "Concert Tickets",
    currentAmount: 150,
    targetAmount: 200,
    deadline: "in 3 weeks",
  },
];

export const activityFeed: {
  id: string;
  type: "nudge" | "achievement";
  icon: string;
  title: string;
  actions: string[];
}[] = [
  {
    id: "activity1",
    type: "nudge",
    icon: "Lightbulb",
    title: "You spent 22% more on food. Try a no-spend weekend?",
    actions: ["Adjust Budget", "Dismiss"],
  },
  {
    id: "activity2",
    type: "achievement",
    icon: "ShieldCheck",
    title: "Achievement Unlocked: Savings Starter!",
    actions: ["View", "Dismiss"],
  },
  {
    id: "activity3",
    type: "nudge",
    icon: "TrendingUp",
    title: "You're close to your 'New Laptop' goal. Keep it up!",
    actions: ["Deposit", "Dismiss"],
  },
   {
    id: "activity4",
    type: "achievement",
    icon: "Award",
    title: "Level 4 reached! New themes unlocked.",
    actions: ["Claim", "Dismiss"],
  },
];
