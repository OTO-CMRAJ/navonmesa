// src/ai/flows/analyze-investor-files.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing investor project files.
 *
 * It allows investors to upload project files and receive an AI-generated analysis report.
 * - analyzeInvestorFiles - A function that handles the analysis of investor files.
 * - AnalyzeInvestorFilesInput - The input type for the analyzeInvestorFiles function.
 * - AnalyzeInvestorFilesOutput - The return type for the analyzeInvestorFiles function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeInvestorFilesInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "The investor's project file as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeInvestorFilesInput = z.infer<typeof AnalyzeInvestorFilesInputSchema>;

const AnalyzeInvestorFilesOutputSchema = z.object({
  analysisReport: z
    .string()
    .describe('The AI-generated analysis report of the project file.'),
});
export type AnalyzeInvestorFilesOutput = z.infer<typeof AnalyzeInvestorFilesOutputSchema>;

export async function analyzeInvestorFiles(
  input: AnalyzeInvestorFilesInput
): Promise<AnalyzeInvestorFilesOutput> {
  return analyzeInvestorFilesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeInvestorFilesPrompt',
  input: { schema: AnalyzeInvestorFilesInputSchema },
  output: { schema: AnalyzeInvestorFilesOutputSchema },
  prompt: `You are an expert financial analyst. Analyze the provided project file and generate a comprehensive report highlighting key findings, potential risks, and investment opportunities.

  Project File: {{media url=fileDataUri}}`,
});

const analyzeInvestorFilesFlow = ai.defineFlow(
  {
    name: 'analyzeInvestorFilesFlow',
    inputSchema: AnalyzeInvestorFilesInputSchema,
    outputSchema: AnalyzeInvestorFilesOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
