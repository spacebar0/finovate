'use client';

import { motion } from 'framer-motion';

interface StepLayoutProps {
  title: React.ReactNode;
  description: React.ReactNode;
  children: React.ReactNode;
}

export function StepLayout({ title, description, children }: StepLayoutProps) {
  return (
    <motion.div
      className="w-full max-w-md mx-auto text-center flex flex-col h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex-grow">
        <h1 className="text-3xl md:text-4xl font-bold font-headline mb-3">
          {title}
        </h1>
        <p className="text-base md:text-lg text-white/70 mb-6">
          {description}
        </p>
        <div className="text-left">{children}</div>
      </div>
    </motion.div>
  );
}
