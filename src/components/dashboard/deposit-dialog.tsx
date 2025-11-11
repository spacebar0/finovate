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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Goal } from '@/firebase/auth/types';
import { useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';

const formSchema = z.object({
  amount: z.coerce
    .number()
    .positive('Amount must be a positive number.'),
  goalId: z.string({ required_error: 'Please select a goal.' }),
});

type DepositFormValues = z.infer<typeof formSchema>;

interface DepositDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  goals: Goal[];
  userId: string;
  onGoalComplete: (goalId: string) => void;
  initialGoalId?: string | null;
  mode?: 'deposit' | 'withdraw';
}

export function DepositDialog({
  isOpen,
  setIsOpen,
  goals,
  userId,
  onGoalComplete,
  initialGoalId,
  mode = 'deposit',
}: DepositDialogProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<DepositFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 10,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        amount: 10,
        goalId: initialGoalId || undefined,
      });
    }
  }, [isOpen, initialGoalId, form]);

  const onSubmit = (values: DepositFormValues) => {
    const selectedGoal = goals.find(g => g.id === values.goalId);
    if (!selectedGoal) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Selected goal not found.',
      });
      return;
    }
    
    const amount = mode === 'deposit' ? values.amount : -values.amount;
    const newCurrentAmount = selectedGoal.currentAmount + amount;

    if (mode === 'withdraw' && newCurrentAmount < 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Amount',
        description: 'Withdrawal amount cannot be greater than the current balance.',
      });
      return;
    }

    const isCompleted = mode === 'deposit' && newCurrentAmount >= selectedGoal.targetAmount;
    const finalAmount = isCompleted ? selectedGoal.targetAmount : Math.max(0, newCurrentAmount);

    const goalDocRef = doc(firestore, `users/${userId}/goals`, selectedGoal.id);
    updateDocumentNonBlocking(goalDocRef, { currentAmount: finalAmount });

    setIsOpen(false);

    if (isCompleted) {
      onGoalComplete(selectedGoal.id);
    } else {
      toast({
        title: `${mode === 'deposit' ? 'Deposit' : 'Withdrawal'} Successful`,
        description: `$${values.amount.toFixed(
          2
        )} has been ${mode === 'deposit' ? 'added to' : 'withdrawn from'} your "${selectedGoal.title}" goal.`,
      });
    }
  };

  const title = mode === 'deposit' ? 'Make a Deposit' : 'Make a Withdrawal';
  const description = mode === 'deposit' ? 'Add funds to one of your savings goals.' : 'Withdraw funds from one of your savings goals.';
  const buttonText = mode === 'deposit' ? 'Confirm Deposit' : 'Confirm Withdrawal';
  const amountLabel = mode === 'deposit' ? 'Deposit Amount ($)' : 'Withdrawal Amount ($)';


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-card/80 backdrop-blur-lg border-border">
        <DialogHeader>
          <DialogTitle className="font-headline">{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="goalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Goal</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a goal..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {goals.map(goal => (
                        <SelectItem key={goal.id} value={goal.id}>
                          {goal.title} (${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{amountLabel}</FormLabel>
                  <FormControl>
                    <Input type="number" step="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">{buttonText}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
