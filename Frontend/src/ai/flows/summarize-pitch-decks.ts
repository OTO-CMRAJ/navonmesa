// SummarizePitchDecks
'use server';
/**
 * @fileOverview A flow to summarize pitch decks using Genkit.
 *
 * - summarizePitchDeck - A function that handles the pitch deck summarization process.
 * - SummarizePitchDeckInput - The input type for the summarizePitchDeck function.
 * - SummarizePitchDeckOutput - The return type for the summarizePitchDeck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePitchDeckInputSchema = z.object({
  pitchDeckDataUri: z
    .string()
    .describe(
      "The pitch deck file as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SummarizePitchDeckInput = z.infer<typeof SummarizePitchDeckInputSchema>;

const SummarizePitchDeckOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the pitch deck.'),
});
export type SummarizePitchDeckOutput = z.infer<typeof SummarizePitchDeckOutputSchema>;

export async function summarizePitchDeck(input: SummarizePitchDeckInput): Promise<SummarizePitchDeckOutput> {
  return summarizePitchDeckFlow(input);
}

const summarizePitchDeckPrompt = ai.definePrompt({
  name: 'summarizePitchDeckPrompt',
  input: {schema: SummarizePitchDeckInputSchema},
  output: {schema: SummarizePitchDeckOutputSchema},
  prompt: `You are an expert at summarizing pitch decks. Please provide a concise summary of the key information from the following pitch deck:

{{media url=pitchDeckDataUri}}`,
});

const summarizePitchDeckFlow = ai.defineFlow(
  {
    name: 'summarizePitchDeckFlow',
    inputSchema: SummarizePitchDeckInputSchema,
    outputSchema: SummarizePitchDeckOutputSchema,
  },
  async input => {
    const {output} = await summarizePitchDeckPrompt(input);
    return output!;
  }
);
