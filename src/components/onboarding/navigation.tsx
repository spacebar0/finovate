'use client';

import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OnboardingNavigationProps {
  children: React.ReactNode;
  onNext?: () => void;
  onPrev?: () => void;
  isSubmitting?: boolean;
  canGoNext?: boolean;
  isFinalStep?: boolean;
}

export function OnboardingNavigation({
  children,
  onNext,
  onPrev,
  isSubmitting = false,
  canGoNext = true,
  isFinalStep = false,
}: OnboardingNavigationProps) {
  return (
    <div className="flex items-center justify-between w-full pt-4 md:pt-8">
      <div>
        {onPrev && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrev}
            className="rounded-full w-14 h-14"
            aria-label="Previous step"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        )}
      </div>

      <div className="flex-1 flex justify-center">
        {children}
      </div>

      <div>
        {onNext && (
          <Button
            variant="default"
            size="icon"
            onClick={onNext}
            className="rounded-full w-14 h-14 bg-white text-black hover:bg-gray-200"
            disabled={!canGoNext || isSubmitting}
            aria-label={isFinalStep ? 'Finish onboarding' : 'Next step'}
          >
            {isSubmitting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <ArrowRight className="w-6 h-6" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
