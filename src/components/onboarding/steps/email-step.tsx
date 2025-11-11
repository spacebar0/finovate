'use client';

import { useFormContext } from 'react-hook-form';
import { StepLayout } from './base-step';
import { OnboardingNavigation } from '../navigation';
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { OnboardingData } from '@/app/signup/page';
import { OnboardingProgress } from '../progress';

interface EmailStepProps {
  goNext: () => void;
  goPrev: () => void;
  currentStep: number;
  totalSteps: number;
}

export function EmailStep({ goNext, goPrev, currentStep, totalSteps }: EmailStepProps) {
  const { control, formState: { errors } } = useFormContext<OnboardingData>();

  return (
    <>
      <StepLayout
        title="Secure Your Account"
        description="Finally, let's set up your login details. This will keep your financial journey safe."
      >
        <div className="space-y-4">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/80">Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} className="bg-white/10 border-white/20 h-12 text-lg" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/80">Password (min. 6 characters)</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} className="bg-white/10 border-white/20 h-12 text-lg" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </StepLayout>
      <OnboardingNavigation
        onNext={goNext}
        onPrev={goPrev}
        canGoNext={!errors.email && !errors.password}
      >
        <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
      </OnboardingNavigation>
    </>
  );
}
