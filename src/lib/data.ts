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


export type Quest = {
  id: string;
  title: string;
  description: string;
  category: 'Savings' | 'Budgeting' | 'Learning' | 'Investment' | 'Community';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xp: number;
  icon: string;
  status: 'available' | 'active' | 'completed';
  progress?: number;
  goal?: number;
};

export const quests: Quest[] = [
  {
    id: 'q1',
    title: 'Daily Savings Streak',
    description: 'Save at least $10 every day for 5 days in a row.',
    category: 'Savings',
    difficulty: 'Easy',
    xp: 50,
    icon: 'PiggyBank',
    status: 'active',
    progress: 3,
    goal: 5,
  },
  {
    id: 'q2',
    title: 'Budgeting Beginner',
    description: 'Categorize 10 transactions using the Smart Budget Tracker.',
    category: 'Budgeting',
    difficulty: 'Easy',
    xp: 75,
    icon: 'ListChecks',
    status: 'active',
    progress: 4,
    goal: 10,
  },
  {
    id: 'q3',
    title: 'Investment Explorer',
    description: 'Simulate your first investment in the Investment Simulator.',
    category: 'Investment',
    difficulty: 'Medium',
    xp: 150,
    icon: 'TrendingUp',
    status: 'available',
  },
  {
    id: 'q4',
    title: 'Learn About Compounding',
    description: 'Complete the micro-lesson on how compound interest works.',
    category: 'Learning',
    difficulty: 'Easy',
    xp: 50,
    icon: 'BrainCircuit',
    status: 'available',
  },
  {
    id: 'q5',
    title: 'No-Spend Challenge',
    description: 'Go 3 consecutive days without any non-essential spending.',
    category: 'Budgeting',
    difficulty: 'Hard',
    xp: 250,
    icon: 'Lock',
    status: 'available',
  },
  {
    id: 'q6',
    title: 'Weekend Warrior Savings',
    description: 'Save $50 between Friday and Sunday.',
    category: 'Savings',
    difficulty: 'Medium',
    xp: 100,
    icon: 'Calendar',
    status: 'available',
  },
  {
    id: 'q7',
    title: 'Group Savings Goal',
    description: "Join a community challenge to save for a common goal.",
    category: 'Community',
    difficulty: 'Medium',
    xp: 120,
    icon: 'Users',
    status: 'available',
  },
  {
    id: 'q8',
    title: 'Budget Master',
    description: 'Stick to your monthly budget for 30 days straight.',
    category: 'Budgeting',
    difficulty: 'Hard',
    xp: 500,
    icon: 'Trophy',
    status: 'completed',
    progress: 30,
    goal: 30
  },
  {
    id: 'q9',
    title: 'First Deposit',
    description: 'Make your first deposit into a savings goal.',
    category: 'Savings',
    difficulty: 'Easy',
    xp: 25,
    icon: 'Landmark',
    status: 'completed',
    progress: 1,
    goal: 1
  },
];
