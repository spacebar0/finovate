import type { User as FirebaseUser } from 'firebase/auth';

export interface Budget {
  spending: number;
  budget: number;
  savingsGoal: number;
  currentSavings: number;
}
export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  avatarUrl?: string;
  xp?: number;
  level?: number;
  theme?: string;
  joinedAt?: string;
  parentConsent?: boolean;
  budget?: Budget;
  currency?: string;
}

export type Goal = {
  id: string;
  title: string;
  currentAmount: number;
  targetAmount: number;
  deadline: string;
};
