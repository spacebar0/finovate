'use client';

import * as React from 'react';
import ReactConfetti from 'react-confetti';

interface ConfettiProps {
  active: boolean;
  setActive: (active: boolean) => void;
}

export function Confetti({ active, setActive }: ConfettiProps) {
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    const { innerWidth: width, innerHeight: height } = window;
    setDimensions({
      width,
      height,
    });
  }, []);

  React.useEffect(() => {
    if (active) {
      const timer = setTimeout(() => {
        setActive(false);
      }, 5000); // Confetti lasts for 5 seconds
      return () => clearTimeout(timer);
    }
  }, [active, setActive]);

  if (!active) {
    return null;
  }

  return (
    <ReactConfetti
      width={dimensions.width}
      height={dimensions.height}
      recycle={false}
      numberOfPieces={400}
      gravity={0.15}
      initialVelocityY={-20}
      initialVelocityX={5}
    />
  );
}
