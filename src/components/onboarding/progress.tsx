'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            "h-2 w-2 rounded-full transition-colors",
            i <= currentStep ? "bg-white" : "bg-white/30"
          )}
          animate={{ scale: i === currentStep ? 1.5 : 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      ))}
    </div>
  );
}
