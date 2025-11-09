'use client';

export function GoalCompletionTick() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <svg
        className="w-32 h-32 text-green-500 animate-bounce-in animate-fade-out"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  );
}
