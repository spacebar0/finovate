'use server';

/**
 * @fileOverview Provides insights into spending habits based on mood entries.
 *
 * - getMoodBasedInsights - A function that retrieves insights based on mood and transaction data.
 * - MoodBasedInsightsInput - The input type for the getMoodBasedInsights function.
 * - MoodBasedInsightsOutput - The return type for the getMoodBasedInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MoodBasedInsightsInputSchema = z.object({
  moodEntries: z.array(
    z.object({
      entryId: z.string(),
      mood: z.string().describe('The mood of the user (e.g., happy, sad, angry)'),
      timestamp: z.string().describe('The timestamp of the mood entry'),
    })
  ).describe('An array of mood entries with moods and timestamps.'),
  transactions: z.array(
    z.object({
      txnId: z.string(),
      amount: z.number(),
      merchant: z.string().describe('The name of the merchant'),
      category: z.string().describe('The category of the transaction'),
      timestamp: z.string().describe('The timestamp of the transaction'),
    })
  ).describe('An array of transactions with amounts, merchants, categories, and timestamps.'),
});

export type MoodBasedInsightsInput = z.infer<typeof MoodBasedInsightsInputSchema>;

const MoodBasedInsightsOutputSchema = z.object({
  insights: z.array(
    z.string().describe('Insights correlating mood with spending habits.')
  ).describe('An array of insights.'),
});

export type MoodBasedInsightsOutput = z.infer<typeof MoodBasedInsightsOutputSchema>;

export async function getMoodBasedInsights(input: MoodBasedInsightsInput): Promise<MoodBasedInsightsOutput> {
  return moodBasedInsightsFlow(input);
}

const moodBasedInsightsPrompt = ai.definePrompt({
  name: 'moodBasedInsightsPrompt',
  input: {schema: MoodBasedInsightsInputSchema},
  output: {schema: MoodBasedInsightsOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user's mood entries and transactions to provide insights into their spending habits in relation to their moods.

Mood Entries:
{{#each moodEntries}}
- Mood: {{mood}}, Timestamp: {{timestamp}}
{{/each}}

Transactions:
{{#each transactions}}
- Amount: {{amount}}, Merchant: {{merchant}}, Category: {{category}}, Timestamp: {{timestamp}}
{{/each}}

Provide a few concise insights. Focus on identifying patterns where certain moods consistently lead to specific spending behaviors. For example, "You tend to spend more on food when you are feeling stressed."

Insights:
`,
});

const moodBasedInsightsFlow = ai.defineFlow(
  {
    name: 'moodBasedInsightsFlow',
    inputSchema: MoodBasedInsightsInputSchema,
    outputSchema: MoodBasedInsightsOutputSchema,
  },
  async input => {
    const {output} = await moodBasedInsightsPrompt(input);
    return output!;
  }
);
