'use client';

import { useFormContext } from 'react-hook-form';
import { StepLayout } from './base-step';
import { OnboardingNavigation } from '../navigation';
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { OnboardingData } from '@/app/signup/page';
import { OnboardingProgress } from '../progress';


interface NameStepProps {
  goNext: () => void;
  goPrev: () => void;
  currentStep: number;
  totalSteps: number;
}

export function NameStep({ goNext, goPrev, currentStep, totalSteps }: NameStepProps) {
  const { control, formState: { errors } } = useFormContext<OnboardingData>();

  return (
    <>
      <StepLayout
        title="What should we call you?"
        description="This is the name other players will see on leaderboards and challenges."
      >
        <FormField
          control={control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Display Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your display name..." {...field} className="bg-white/10 border-white/20 h-14 text-center text-2xl font-bold" />
              </FormControl>
              <FormMessage className="text-center pt-2"/>
            </FormItem>
          )}
        />
      </StepLayout>
      <OnboardingNavigation
        onNext={goNext}
        onPrev={goPrev}
        canGoNext={!errors.displayName}
      >
        <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
      </OnboardingNavigation>
    </>
  );
}
