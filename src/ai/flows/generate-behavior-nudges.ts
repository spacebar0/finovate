'use server';

/**
 * @fileOverview Generates personalized financial behavior nudges for users.
 *
 * This file defines a Genkit flow that analyzes user transaction data to identify
 * patterns and generate personalized nudges to encourage better financial habits.
 *
 * @function generateBehaviorNudges - The main function to generate behavior nudges.
 * @interface GenerateBehaviorNudgesInput - The input type for the generateBehaviorNudges function.
 * @interface GenerateBehaviorNudgesOutput - The output type for the generateBehaviorNudges function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBehaviorNudgesInputSchema = z.object({
  userId: z.string().describe('The ID of the user to generate nudges for.'),
  transactionData: z.string().describe('JSON string of the user transaction history for the last 30 days. It should include amount, category, merchant, and timestamp.'),
});
export type GenerateBehaviorNudgesInput = z.infer<
  typeof GenerateBehaviorNudgesInputSchema
>;

const GenerateBehaviorNudgesOutputSchema = z.object({
  nudge: z
    .string()
    .describe(
      'A personalized financial nudge based on the user transaction history.'
    ),
});

export type GenerateBehaviorNudgesOutput = z.infer<
  typeof GenerateBehaviorNudgesOutputSchema
>;

export async function generateBehaviorNudges(
  input: GenerateBehaviorNudgesInput
): Promise<GenerateBehaviorNudgesOutput> {
  return generateBehaviorNudgesFlow(input);
}

const generateBehaviorNudgesPrompt = ai.definePrompt({
  name: 'generateBehaviorNudgesPrompt',
  input: {schema: GenerateBehaviorNudgesInputSchema},
  output: {schema: GenerateBehaviorNudgesOutputSchema},
  prompt: `You are a personal finance advisor. You are analyzing the user's recent transaction history and generating a single, personalized nudge to help them improve their financial habits.

  Here is the transaction data in JSON format:
  {{transactionData}}

  Based on this data, what is one specific, actionable nudge you can provide to help them save money or improve their spending habits? Be direct and concise. The nudge should be no more than 20 words.
  `,
});

const generateBehaviorNudgesFlow = ai.defineFlow(
  {
    name: 'generateBehaviorNudgesFlow',
    inputSchema: GenerateBehaviorNudgesInputSchema,
    outputSchema: GenerateBehaviorNudgesOutputSchema,
  },
  async input => {
    const {output} = await generateBehaviorNudgesPrompt(input);
    return output!;
  }
);
