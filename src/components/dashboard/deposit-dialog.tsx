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
    .positive('Deposit amount must be a positive number.'),
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
}

export function DepositDialog({
  isOpen,
  setIsOpen,
  goals,
  userId,
  onGoalComplete,
  initialGoalId,
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

    const newCurrentAmount = selectedGoal.currentAmount + values.amount;
    const isCompleted = newCurrentAmount >= selectedGoal.targetAmount;
    const finalAmount = isCompleted ? selectedGoal.targetAmount : newCurrentAmount;

    const goalDocRef = doc(firestore, `users/${userId}/goals`, selectedGoal.id);
    updateDocumentNonBlocking(goalDocRef, { currentAmount: finalAmount });

    setIsOpen(false);

    if (isCompleted) {
      onGoalComplete(selectedGoal.id);
    } else {
      toast({
        title: 'Deposit Successful',
        description: `$${values.amount.toFixed(
          2
        )} has been added to your "${selectedGoal.title}" goal.`,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-card/80 backdrop-blur-lg border-border">
        <DialogHeader>
          <DialogTitle className="font-headline">Make a Deposit</DialogTitle>
          <DialogDescription>
            Add funds to one of your savings goals.
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
                        <SelectValue placeholder="Choose a goal to deposit into..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {goals.map(goal => (
                        <SelectItem key={goal.id} value={goal.id}>
                          {goal.title}
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
                  <FormLabel>Deposit Amount ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="1" {...field} />
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
