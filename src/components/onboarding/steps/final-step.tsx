'use client';

import { StepLayout } from './base-step';
import { OnboardingNavigation } from '../navigation';

interface FinalStepProps {
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function FinalStep({ onSubmit, isSubmitting }: FinalStepProps) {
  return (
    <>
      <StepLayout
        title="You're All Set!"
        description="Welcome to Finnovate. We're excited to help you on your financial journey. Let's get started!"
      >
        <div />
      </StepLayout>
      <OnboardingNavigation onNext={onSubmit} isSubmitting={isSubmitting} isFinalStep />
    </>
  );
}
