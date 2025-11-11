'use client';

import { OnboardingProgress } from "./progress";

interface OnboardingHeaderProps {
  currentStep: number;
  totalSteps: number;
}

export function OnboardingHeader({ currentStep, totalSteps }: OnboardingHeaderProps) {
  return (
    <header className="flex-none flex items-center justify-between p-4 md:p-6 border-b border-white/10">
      <h2 className="text-lg font-bold font-headline">Sign Up</h2>
      <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
      <div className="w-16"></div>
    </header>
  );
}
