'use client';

import { StepLayout } from './base-step';
import { OnboardingNavigation } from '../navigation';

interface WelcomeStepProps {
  goNext: () => void;
}

export function WelcomeStep({ goNext }: WelcomeStepProps) {
  return (
    <>
      <StepLayout
        title="Easy banking."
        description="Forget everything you know about the chaotic world of finance. It can be easy."
      >
        {/* No form fields on the welcome step */}
        <div />
      </StepLayout>
      <OnboardingNavigation onNext={goNext} />
    </>
  );
}
