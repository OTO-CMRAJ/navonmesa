'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  computeAllCategoryScores,
  computeFinalWeightedScore,
  DEFAULT_WEIGHTS,
  InvestorWeights,
} from '@/lib/scoring';

// ---------- Schemas ----------
const TextInputSchema = z.object({
  documentText: z.string().describe('Raw text extracted from startup documents'),
});

const SectorTextInputSchema = TextInputSchema.extend({
  sector: z.string().default('General'),
});

const FileInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe("Data URI with MIME type and base64 payload: data:<mimetype>;base64,<data>")
});

const BenchmarkOutputSchema = z.object({
  benchmarkingAnalysis: z.string(),
});

const RiskOutputSchema = z.object({
  riskAnalysis: z.string(),
});

const GrowthOutputSchema = z.object({
  growthSummary: z.string(),
});

const ExtractOutputSchema = z.object({
  extractedText: z.string(),
});

const HybridInputSchema = z.object({
  structuredData: z.any().describe('Structured numeric data extracted from documents'),
  unstructuredText: z.string().describe('Raw document text used for memo'),
  weights: z
    .object({
      team: z.number(),
      market: z.number(),
      product: z.number(),
      economics: z.number(),
      traction: z.number(),
      financials: z.number(),
      risk: z.number(),
      growth_potential: z.number(),
    })
    .partial()
    .optional(),
});

const HybridOutputSchema = z.object({
  quantitativeSummary: z.object({
    finalWeightedScore: z.number(),
    categoryScores: z.record(z.number()),
  }),
  qualitativeInvestmentMemo: z.string(),
});

// ---------- Prompts ----------
const benchmarkPrompt = ai.definePrompt({
  name: 'benchmarkStartupPrompt',
  input: { schema: SectorTextInputSchema },
  output: { schema: BenchmarkOutputSchema },
  prompt: `You are a venture analyst. Analyze this startup document for the sector: {{sector}}.
Extract MRR, CAC, LTV, churn when present and compare against typical benchmarks
for this sector (e.g., LTV:CAC ~ 3:1). Provide a concise, structured narrative summary.

Document:\n---\n{{documentText}}\n---`,
});

const riskPrompt = ai.definePrompt({
  name: 'identifyRiskIndicatorsPrompt',
  input: { schema: TextInputSchema },
  output: { schema: RiskOutputSchema },
  prompt: `Identify potential early-stage investment risks in the text.
Focus on inconsistent metrics, inflated TAM, churn concerns, team gaps, and underplayed competition.
List each risk with a brief explanation. If none, state that.\n\nText:\n---\n{{documentText}}\n---`,
});

const growthPrompt = ai.definePrompt({
  name: 'assessGrowthPotentialPrompt',
  input: { schema: TextInputSchema },
  output: { schema: GrowthOutputSchema },
  prompt: `Evaluate growth potential across Team, Market Size, Product, and Traction.
Provide a short summary and cite the most compelling signals from the text.\n\nText:\n---\n{{documentText}}\n---`,
});

const extractPrompt = ai.definePrompt({
  name: 'extractTextFromFilePrompt',
  input: { schema: FileInputSchema },
  output: { schema: ExtractOutputSchema },
  prompt: `Read the following file and extract the plain text content for downstream analysis.
Return only the extracted text without commentary.\n\nFile: {{media url=fileDataUri}}`,
});

const hybridMemoPrompt = ai.definePrompt({
  name: 'hybridInvestmentMemoPrompt',
  input: {
    schema: z.object({
      unstructuredText: z.string(),
      finalScore: z.number(),
      scores: z.record(z.number()),
    }),
  },
  output: { schema: z.object({ memo: z.string() }) },
  prompt: `As a VC analyst, write a concise investment memo grounded in the provided scores.

Final Weighted Score: {{finalScore}}
Category Scores (0-10): {{scores}}

Use this raw text as evidence where helpful:
---
{{unstructuredText}}
---

Structure:
1) Executive summary & recommendation.
2) Strengths referencing highest scores.
3) Weaknesses/risks referencing lowest scores.
4) Verdict & specific next-step questions.`,
});

// ---------- Flows ----------
const benchmarkFlow = ai.defineFlow({
  name: 'benchmarkStartupFlow',
  inputSchema: SectorTextInputSchema,
  outputSchema: BenchmarkOutputSchema,
}, async (input) => {
  const { output } = await benchmarkPrompt(input);
  return output!;
});

const riskFlow = ai.defineFlow({
  name: 'identifyRiskIndicatorsFlow',
  inputSchema: TextInputSchema,
  outputSchema: RiskOutputSchema,
}, async (input) => {
  const { output } = await riskPrompt(input);
  return output!;
});

const growthFlow = ai.defineFlow({
  name: 'assessGrowthPotentialFlow',
  inputSchema: TextInputSchema,
  outputSchema: GrowthOutputSchema,
}, async (input) => {
  const { output } = await growthPrompt(input);
  return output!;
});

const extractFlow = ai.defineFlow({
  name: 'extractTextFromFileFlow',
  inputSchema: FileInputSchema,
  outputSchema: ExtractOutputSchema,
}, async (input) => {
  const { output } = await extractPrompt(input);
  return output!;
});

const hybridFlow = ai.defineFlow({
  name: 'hybridStartupAnalysisFlow',
  inputSchema: HybridInputSchema,
  outputSchema: HybridOutputSchema,
}, async (input) => {
  const weights: InvestorWeights = { ...DEFAULT_WEIGHTS, ...(input.weights ?? {}) } as InvestorWeights;
  const categoryScores = computeAllCategoryScores(input.structuredData);
  const finalScore = computeFinalWeightedScore(categoryScores, weights);
  const { output: memoOut } = await hybridMemoPrompt({
    unstructuredText: input.unstructuredText,
    finalScore,
    scores: categoryScores as unknown as Record<string, number>,
  });
  return {
    quantitativeSummary: {
      finalWeightedScore: finalScore,
      categoryScores: categoryScores as unknown as Record<string, number>,
    },
    qualitativeInvestmentMemo: memoOut!.memo,
  };
});

// ---------- Exported helpers for client calls ----------
export type BenchmarkStartupInput = z.infer<typeof SectorTextInputSchema>;
export type BenchmarkStartupOutput = z.infer<typeof BenchmarkOutputSchema>;
export async function benchmarkStartup(input: BenchmarkStartupInput): Promise<BenchmarkStartupOutput> {
  return benchmarkFlow(input);
}

export type IdentifyRiskIndicatorsInput = z.infer<typeof TextInputSchema>;
export type IdentifyRiskIndicatorsOutput = z.infer<typeof RiskOutputSchema>;
export async function identifyRiskIndicators(input: IdentifyRiskIndicatorsInput): Promise<IdentifyRiskIndicatorsOutput> {
  return riskFlow(input);
}

export type AssessGrowthPotentialInput = z.infer<typeof TextInputSchema>;
export type AssessGrowthPotentialOutput = z.infer<typeof GrowthOutputSchema>;
export async function assessGrowthPotential(input: AssessGrowthPotentialInput): Promise<AssessGrowthPotentialOutput> {
  return growthFlow(input);
}

export type ExtractTextFromFileInput = z.infer<typeof FileInputSchema>;
export type ExtractTextFromFileOutput = z.infer<typeof ExtractOutputSchema>;
export async function extractTextFromFile(input: ExtractTextFromFileInput): Promise<ExtractTextFromFileOutput> {
  return extractFlow(input);
}

export type HybridStartupAnalysisInput = z.infer<typeof HybridInputSchema>;
export type HybridStartupAnalysisOutput = z.infer<typeof HybridOutputSchema>;
export async function hybridStartupAnalysis(input: HybridStartupAnalysisInput): Promise<HybridStartupAnalysisOutput> {
  return hybridFlow(input);
}


