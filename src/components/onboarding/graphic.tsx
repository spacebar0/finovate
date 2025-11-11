'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BankGraphic } from './graphics/bank';
import { PersonGraphic } from './graphics/person';
import { ShieldGraphic } from './graphics/shield';
import { PiggyBankGraphic } from './graphics/piggy-bank';
import { RocketGraphic } from './graphics/rocket';
import { CheckGraphic } from './graphics/check';

interface OnboardingGraphicProps {
  step: number;
}

const graphics = [
  BankGraphic,
  PersonGraphic,
  ShieldGraphic,
  PiggyBankGraphic,
  RocketGraphic,
  CheckGraphic
];

export function OnboardingGraphic({ step }: OnboardingGraphicProps) {
  const CurrentGraphic = graphics[step] || BankGraphic;

  return (
    <div className="w-full h-full flex items-center justify-center pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
          className="w-full h-auto max-w-xs md:max-w-sm flex items-center justify-center"
        >
          <CurrentGraphic />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
