'use client';

import { StepLayout } from './base-step';
import { OnboardingNavigation } from '../navigation';
import { OnboardingProgress } from '../progress';

interface FinalStepProps {
  onSubmit: () => void;
  isSubmitting: boolean;
  currentStep: number;
  totalSteps: number;
}

export function FinalStep({ onSubmit, isSubmitting, currentStep, totalSteps }: FinalStepProps) {
  return (
    <>
      <StepLayout
        title="You're All Set!"
        description="Welcome to Finnovate. We're excited to help you on your financial journey. Let's get started!"
      >
        <div />
      </StepLayout>
      <OnboardingNavigation onNext={onSubmit} isSubmitting={isSubmitting} isFinalStep>
         <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
      </OnboardingNavigation>
    </>
  );
}
