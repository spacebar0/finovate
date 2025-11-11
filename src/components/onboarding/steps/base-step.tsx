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
      className="w-full max-w-md mx-auto text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
        {title}
      </h1>
      <p className="text-lg md:text-xl text-white/70 mb-8">
        {description}
      </p>
      <div className="text-left">{children}</div>
    </motion.div>
  );
}
