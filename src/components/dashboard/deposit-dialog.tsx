'use client';

import * as React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Goal } from '@/firebase/auth/types';
import { useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';

const formSchema = z.object({
  amount: z.coerce
    .number()
    .positive('Deposit amount must be a positive number.'),
});

type DepositFormValues = z.infer<typeof formSchema>;

interface DepositDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  goal: Goal;
  userId: string;
  onGoalComplete: (goalId: string) => void;
}

export function DepositDialog({
  isOpen,
  setIsOpen,
  goal,
  userId,
  onGoalComplete,
}: DepositDialogProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<DepositFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const onSubmit = (values: DepositFormValues) => {
    const newCurrentAmount = goal.currentAmount + values.amount;
    const isCompleted = newCurrentAmount >= goal.targetAmount;
    const finalAmount = Math.min(newCurrentAmount, goal.targetAmount);

    const goalDocRef = doc(firestore, `users/${userId}/goals`, goal.id);
    updateDocumentNonBlocking(goalDocRef, { currentAmount: finalAmount });

    setIsOpen(false);
    form.reset();

    if (isCompleted) {
      onGoalComplete(goal.id);
    } else {
      toast({
        title: 'Deposit Successful',
        description: `$${values.amount.toFixed(
          2
        )} has been added to your "${goal.title}" goal.`,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-card/80 backdrop-blur-lg border-border">
        <DialogHeader>
          <DialogTitle className="font-headline">
            Deposit to "{goal.title}"
          </DialogTitle>
          <DialogDescription>
            How much would you like to add to this goal?
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deposit Amount ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Confirm Deposit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
