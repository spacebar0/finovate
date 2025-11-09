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
import type { BudgetState } from '@/app/(main)/page';

const formSchema = z.object({
  budget: z.coerce.number().positive('Budget must be a positive number.'),
  spending: z.coerce.number().min(0, 'Spending cannot be negative.'),
  savingsGoal: z.coerce.number().positive('Savings goal must be a positive number.'),
  currentSavings: z.coerce.number().min(0, 'Current savings cannot be negative.'),
});

type AdjustBudgetFormValues = z.infer<typeof formSchema>;

interface AdjustBudgetDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  budgetState: BudgetState;
  setBudgetState: React.Dispatch<React.SetStateAction<BudgetState>>;
}

export function AdjustBudgetDialog({
  isOpen,
  setIsOpen,
  budgetState,
  setBudgetState,
}: AdjustBudgetDialogProps) {
  const { toast } = useToast();

  const form = useForm<AdjustBudgetFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: budgetState,
  });

  React.useEffect(() => {
    form.reset(budgetState);
  }, [budgetState, form]);

  const onSubmit = (values: AdjustBudgetFormValues) => {
    setBudgetState(values);
    setIsOpen(false);
    toast({
      title: 'Budget Updated',
      description: 'Your budget health has been successfully updated.',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-card/80 backdrop-blur-lg border-border">
        <DialogHeader>
          <DialogTitle className="font-headline">Adjust Your Budget</DialogTitle>
          <DialogDescription>
            Update your monthly budget and current spending to see your real-time
            financial health.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Monthly Budget ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="spending"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Spending ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="savingsGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Savings Goal ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentSavings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Savings ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
