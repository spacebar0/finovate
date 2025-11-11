'use client';

import { useFormContext } from 'react-hook-form';
import { StepLayout } from './base-step';
import { OnboardingNavigation } from '../navigation';
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { OnboardingData } from '@/app/signup/page';
import { OnboardingProgress } from '../progress';

interface CurrencyStepProps {
  goNext: () => void;
  goPrev: () => void;
  currentStep: number;
  totalSteps: number;
}

const currencies = [
  { value: 'USD', label: '🇺🇸 USD - United States Dollar' },
  { value: 'EUR', label: '🇪🇺 EUR - Euro' },
  { value: 'INR', label: '🇮🇳 INR - Indian Rupee' },
];

export function CurrencyStep({ goNext, goPrev, currentStep, totalSteps }: CurrencyStepProps) {
  const { control } = useFormContext<OnboardingData>();

  return (
    <>
      <StepLayout
        title="Select Your Currency"
        description="Choose your preferred currency for budgeting and tracking."
      >
        <FormField
          control={control}
          name="currency"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-2"
                >
                  {currencies.map(currency => (
                    <FormItem key={currency.value} className="flex items-center space-x-3 space-y-0 p-4 rounded-lg bg-white/10 border border-white/20">
                      <FormControl>
                        <RadioGroupItem value={currency.value} />
                      </FormControl>
                      <Label htmlFor={currency.value} className="font-normal text-white/90 text-base">
                        {currency.label}
                      </Label>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </StepLayout>
      <OnboardingNavigation
        onNext={goNext}
        onPrev={goPrev}
      >
        <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
      </OnboardingNavigation>
    </>
  );
}
