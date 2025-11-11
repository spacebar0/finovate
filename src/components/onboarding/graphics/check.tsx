
'use client';
import { motion } from 'framer-motion';

export function CheckGraphic() {
  return (
    <svg
      width="160"
      height="160"
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-1/2 h-auto"
    >
      <circle cx="80" cy="80" r="78" stroke="white" strokeWidth="4" />
      <motion.path
        d="M52 82L72 102L112 62"
        stroke="#84CC16"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
      />
    </svg>
  );
}
// Note: This component uses framer-motion for the checkmark animation.
// Ensure you have `import { motion } from 'framer-motion'` in the parent component.
