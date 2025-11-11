'use client';

import { useFormContext } from 'react-hook-form';
import { StepLayout } from './base-step';
import { OnboardingNavigation } from '../navigation';
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { OnboardingData } from '@/app/signup/page';
import { OnboardingProgress } from '../progress';

interface BudgetStepProps {
  goNext: () => void;
  goPrev: () => void;
  currentStep: number;
  totalSteps: number;
}

export function BudgetStep({ goNext, goPrev, currentStep, totalSteps }: BudgetStepProps) {
  const { control, formState: { errors } } = useFormContext<OnboardingData>();

  return (
    <>
      <StepLayout
        title="Set Your Financial Baseline"
        description="Let's get a rough idea of your monthly finances. You can always adjust this later."
      >
        <div className="space-y-6">
          <FormField
            control={control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/80">What's your total monthly budget?</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="$1,000" {...field} className="bg-white/10 border-white/20 h-12 text-lg" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="spending"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/80">How much do you spend on average?</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="$500" {...field} className="bg-white/10 border-white/20 h-12 text-lg" />
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
        canGoNext={!errors.budget && !errors.spending}
      >
        <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
      </OnboardingNavigation>
    </>
  );
}
