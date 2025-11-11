'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth, setDocumentNonBlocking } from '@/firebase';
import { doc, getFirestore } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { OnboardingGraphic } from '@/components/onboarding/graphic';
import { WelcomeStep } from '@/components/onboarding/steps/welcome-step';
import { NameStep } from '@/components/onboarding/steps/name-step';
import { EmailStep } from '@/components/onboarding/steps/email-step';
import { BudgetStep } from '@/components/onboarding/steps/budget-step';
import { GoalStep } from '@/components/onboarding/steps/goal-step';
import { FinalStep } from '@/components/onboarding/steps/final-step';

import { useToast } from '@/hooks/use-toast';
import type { User } from '@/firebase/auth/types';

const onboardingSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  budget: z.coerce.number().positive('Budget must be a positive number.'),
  spending: z.coerce.number().min(0, 'Spending cannot be negative.'),
  goalTitle: z.string().min(3, 'Goal title must be at least 3 characters.'),
  goalTarget: z.coerce.number().positive('Target must be a positive number.'),
  goalDeadline: z.date({ required_error: 'Please select a deadline.' }),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;

const steps = [
  { id: 'welcome', component: WelcomeStep },
  { id: 'name', component: NameStep },
  { id: 'email', component: EmailStep },
  { id: 'budget', component: BudgetStep },
  { id: 'goal', component: GoalStep },
  { id: 'final', component: FinalStep },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = getFirestore(auth.app);

  const methods = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      budget: 1000,
      spending: 500,
      goalTitle: '',
      goalTarget: 1000,
    },
  });

  const goNext = async () => {
    const fieldsToValidate: (keyof OnboardingData)[][] = [
      [], // Welcome
      ['displayName'], // Name
      ['email', 'password'], // Email
      ['budget', 'spending'], // Budget
      ['goalTitle', 'goalTarget', 'goalDeadline'], // Goal
    ];

    const isValid = await methods.trigger(fieldsToValidate[currentStep]);
    if (isValid) {
      setCurrentStep(s => Math.min(s + 1, steps.length - 1));
    }
  };

  const goPrev = () => {
    setCurrentStep(s => Math.max(s - 1, 0));
  };
  
  const onSubmit = async (data: OnboardingData) => {
    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const newUser = userCredential.user;

      const userProfile: User = {
        uid: newUser.uid,
        displayName: data.displayName,
        email: newUser.email,
        avatarUrl: 'user-avatar',
        xp: 0,
        level: 1,
        theme: 'dark',
        joinedAt: new Date().toISOString(),
        parentConsent: false,
        budget: {
          budget: data.budget,
          spending: data.spending,
          savingsGoal: 200, // Default for now
          currentSavings: 0, // Starts at 0
        },
      };

      const userDocRef = doc(firestore, 'users', newUser.uid);
      setDocumentNonBlocking(userDocRef, userProfile, { merge: true });

      const goal = {
        id: 'initial-goal',
        title: data.goalTitle,
        currentAmount: 0,
        targetAmount: data.goalTarget,
        deadline: data.goalDeadline.toISOString(),
      };

      const goalDocRef = doc(firestore, `users/${newUser.uid}/goals`, goal.id);
      setDocumentNonBlocking(goalDocRef, goal, { merge: false });

      toast({
        title: 'Welcome to Finnovate!',
        description: "You're all set. Redirecting you to the dashboard...",
      });

      // Redirect will be handled by the auth state listener
    } catch (error: any) {
      console.error('Onboarding Error:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'Could not create your account.',
      });
      setIsSubmitting(false);
      setCurrentStep(steps.findIndex(s => s.id === 'email')); // Go back to email step
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col min-h-screen bg-black text-white">
        <div className="relative flex-1 flex items-center justify-center p-4 md:p-8 min-h-[40vh] md:min-h-[50vh]">
          <OnboardingGraphic step={currentStep} />
        </div>
        
        <motion.div 
          className="flex flex-col justify-center p-6 bg-background rounded-t-3xl border-t border-white/10"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
        >
          <div className="w-full max-w-md mx-auto flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col"
              >
                <CurrentStepComponent
                  goNext={goNext}
                  goPrev={goPrev}
                  onSubmit={methods.handleSubmit(onSubmit)}
                  isSubmitting={isSubmitting}
                  currentStep={currentStep}
                  totalSteps={steps.length}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </FormProvider>
  );
}
