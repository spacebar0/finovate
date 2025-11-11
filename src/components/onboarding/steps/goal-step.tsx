'use client';

import { useFormContext } from 'react-hook-form';
import { StepLayout } from './base-step';
import { OnboardingNavigation } from '../navigation';
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { OnboardingData } from '@/app/signup/page';
import { OnboardingProgress } from '../progress';

interface GoalStepProps {
  goNext: () => void;
  goPrev: () => void;
  currentStep: number;
  totalSteps: number;
}

export function GoalStep({ goNext, goPrev, currentStep, totalSteps }: GoalStepProps) {
  const { control, formState: { errors } } = useFormContext<OnboardingData>();

  return (
    <>
      <StepLayout
        title="What's Your First Quest?"
        description="Every great journey starts with a single step. What's the first thing you want to save for?"
      >
        <div className="space-y-4">
          <FormField
            control={control}
            name="goalTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/80">Goal Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., New Gaming PC" {...field} className="bg-white/10 border-white/20 h-12 text-base md:text-lg" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="goalTarget"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/80">How much do you need to save?</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="$1,500" {...field} className="bg-white/10 border-white/20 h-12 text-base md:text-lg" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="goalDeadline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-white/80 text-left">When do you need it by?</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full h-12 pl-3 text-left font-normal text-base md:text-lg bg-white/10 border-white/20 hover:bg-white/20 hover:text-white",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </StepLayout>
      <OnboardingNavigation
        onNext={goNext}
        onPrev={goPrev}
        canGoNext={!errors.goalTitle && !errors.goalTarget && !errors.goalDeadline}
      >
        <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
      </OnboardingNavigation>
    </>
  );
}
