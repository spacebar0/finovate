'use client';

import { StepLayout } from './base-step';
import { OnboardingNavigation } from '../navigation';
import { OnboardingProgress } from '../progress';

interface WelcomeStepProps {
  goNext: () => void;
  currentStep: number;
  totalSteps: number;
}

export function WelcomeStep({ goNext, currentStep, totalSteps }: WelcomeStepProps) {
  return (
    <>
      <StepLayout
        title="Easy banking."
        description="Forget everything you know about the chaotic world of finance. It can be easy."
      >
        <div />
      </StepLayout>
      <OnboardingNavigation onNext={goNext}>
        <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
      </OnboardingNavigation>
    </>
  );
}
