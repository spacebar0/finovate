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
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const formSchema = z.object({
  title: z.string().min(3, 'Goal title must be at least 3 characters.'),
  targetAmount: z.coerce.number().positive('Target must be a positive number.'),
  deadline: z.date({ required_error: 'Please select a deadline.' }),
});

type CreateWalletFormValues = z.infer<typeof formSchema>;

interface CreateWalletDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  userId: string;
}

export function CreateWalletDialog({ isOpen, setIsOpen, userId }: CreateWalletDialogProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<CreateWalletFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      targetAmount: 1000,
    },
  });

  const onSubmit = (values: CreateWalletFormValues) => {
    const goalsCollectionRef = collection(firestore, `users/${userId}/goals`);
    
    const newGoal = {
      title: values.title,
      targetAmount: values.targetAmount,
      deadline: values.deadline.toISOString(),
      currentAmount: 0,
      isLinked: false,
      createdAt: new Date().toISOString(),
      visualColor: '#FFFFFF' // Default color
    };

    addDocumentNonBlocking(goalsCollectionRef, newGoal);

    toast({
      title: 'Wallet Created!',
      description: `Your new savings goal "${values.title}" has been created.`,
    });
    setIsOpen(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-card/80 backdrop-blur-lg border-border">
        <DialogHeader>
          <DialogTitle className="font-headline">Create New Wallet</DialogTitle>
          <DialogDescription>
            Set up a new savings goal. What are you saving for?
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., New Gaming Console" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Amount ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Deadline</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Create Wallet</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
