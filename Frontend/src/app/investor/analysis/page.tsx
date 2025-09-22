"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeInvestorFiles } from "@/ai/flows/analyze-investor-files";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  benchmarkStartup,
  identifyRiskIndicators,
  assessGrowthPotential,
  extractTextFromFile,
  hybridStartupAnalysis,
} from "@/ai/flows/startup-analysis";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { DEFAULT_WEIGHTS } from "@/lib/scoring";

export default function InvestorAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileDataUri, setFileDataUri] = useState<string>("");

  // Basic
  const [basicReport, setBasicReport] = useState("");

  // Parsing
  const [extractedText, setExtractedText] = useState("");

  // Advanced
  const [sector, setSector] = useState("SaaS");
  const [benchmark, setBenchmark] = useState("");
  const [risk, setRisk] = useState("");
  const [growth, setGrowth] = useState("");

  // Hybrid
  const [structuredJson, setStructuredJson] = useState<string>(JSON.stringify(sampleStructuredData, null, 2));
  const [weightsJson, setWeightsJson] = useState<string>(JSON.stringify(DEFAULT_WEIGHTS, null, 2));
  const [hybridMemo, setHybridMemo] = useState("");
  const [hybridScores, setHybridScores] = useState<Record<string, number> | null>(null);
  const [hybridFinal, setHybridFinal] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setBasicReport("");
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = () => setFileDataUri(reader.result as string);
      reader.onerror = (err) => toast({ title: "Failed to read file", description: String(err), variant: "destructive" });
    }
  };

  const chartData = useMemo(() => {
    if (!hybridScores) return [] as { key: string; score: number }[];
    return Object.entries(hybridScores).map(([k, v]) => ({ key: k.replace(/_/g, ' '), score: Number(v.toFixed(2)) }));
  }, [hybridScores]);

  // Actions
  const runBasic = async () => {
    if (!fileDataUri) {
      toast({ title: "No file", description: "Upload a document first.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const result = await analyzeInvestorFiles({ fileDataUri });
      setBasicReport(result.analysisReport);
    } catch (e) {
      toast({ title: "Basic analysis failed", description: String(e), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const runExtract = async () => {
    if (!fileDataUri) {
      toast({ title: "No file", description: "Upload a document first.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const { extractedText } = await extractTextFromFile({ fileDataUri });
      setExtractedText(extractedText);
    } catch (e) {
      toast({ title: "Parsing failed", description: String(e), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const runAdvanced = async () => {
    const documentText = extractedText || basicReport;
    if (!documentText) {
      toast({ title: "No text", description: "Paste or extract text first.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const [b, r, g] = await Promise.all([
        benchmarkStartup({ documentText, sector }),
        identifyRiskIndicators({ documentText }),
        assessGrowthPotential({ documentText }),
      ]);
      setBenchmark(b.benchmarkingAnalysis);
      setRisk(r.riskAnalysis);
      setGrowth(g.growthSummary);
    } catch (e) {
      toast({ title: "Advanced analysis failed", description: String(e), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const runHybrid = async () => {
    let structured: any; let weights: any;
    try { structured = JSON.parse(structuredJson || '{}'); } catch { toast({ title: "Invalid structured JSON", variant: "destructive" }); return; }
    try { weights = JSON.parse(weightsJson || '{}'); } catch { toast({ title: "Invalid weights JSON", variant: "destructive" }); return; }
    const unstructuredText = extractedText || basicReport;
    if (!unstructuredText) { toast({ title: "No text", description: "Provide or extract text for memo.", variant: "destructive" }); return; }
    setIsLoading(true);
    try {
      const res = await hybridStartupAnalysis({ structuredData: structured, unstructuredText, weights });
      setHybridFinal(res.quantitativeSummary.finalWeightedScore);
      setHybridScores(res.quantitativeSummary.categoryScores as Record<string, number>);
      setHybridMemo(res.qualitativeInvestmentMemo);
    } catch (e) {
      toast({ title: "Hybrid analysis failed", description: String(e), variant: "destructive" });
    } finally { setIsLoading(false); }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold">AI-Powered Analysis</h1>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="mb-2">
          <TabsTrigger value="parsing">Document Parsing</TabsTrigger>
          <TabsTrigger value="basic">Basic Analysis</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Analytics</TabsTrigger>
          <TabsTrigger value="hybrid">Hybrid Scoring</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Document Analysis</CardTitle>
              <CardDescription>Upload a project file to get a quick AI-generated report.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <UploadDrop file={file} onChange={handleFileChange} />
              <Button onClick={runBasic} disabled={isLoading || !fileDataUri} className="w-full sm:w-auto">
                {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Generating...</>) : 'Generate Basic Report'}
              </Button>
              {basicReport && (
                <Alert>
                  <AlertTitle className="font-bold">AI Analysis Report</AlertTitle>
                  <AlertDescription className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{basicReport}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>Benchmarking, risk indicators, and growth summary.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">Sector</label>
                  <Input value={sector} onChange={(e) => setSector(e.target.value)} placeholder="e.g. SaaS" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Document Text</label>
                <Textarea value={extractedText} onChange={(e) => setExtractedText(e.target.value)} rows={10} placeholder="Paste text here or use Document Parsing tab to extract from file" />
              </div>
              <Button onClick={runAdvanced} disabled={isLoading || !extractedText} className="w-full sm:w-auto">
                {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Analyzing...</>) : 'Run Advanced Analytics'}
              </Button>
              {benchmark && (
                <Alert>
                  <AlertTitle className="font-bold">Benchmarking</AlertTitle>
                  <AlertDescription className="whitespace-pre-wrap font-mono text-sm">{benchmark}</AlertDescription>
                </Alert>
              )}
              {risk && (
                <Alert>
                  <AlertTitle className="font-bold">Risk Indicators</AlertTitle>
                  <AlertDescription className="whitespace-pre-wrap font-mono text-sm">{risk}</AlertDescription>
                </Alert>
              )}
              {growth && (
                <Alert>
                  <AlertTitle className="font-bold">Growth Potential</AlertTitle>
                  <AlertDescription className="whitespace-pre-wrap font-mono text-sm">{growth}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hybrid">
          <Card>
            <CardHeader>
              <CardTitle>Hybrid Scoring</CardTitle>
              <CardDescription>Combine quantitative scores with a qualitative memo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Unstructured Text</label>
                <Textarea value={extractedText} onChange={(e) => setExtractedText(e.target.value)} rows={8} placeholder="Paste text or extract from file" />
              </div>
              <Button onClick={runHybrid} disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Scoring...</>) : 'Compute Hybrid Report'}
              </Button>

              {(hybridScores && hybridFinal !== null) && (
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Category Scores</CardTitle>
                      <CardDescription>Final Weighted Score: {hybridFinal?.toFixed(2)} / 10</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={{ score: { color: 'hsl(var(--primary))' } }}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="key" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={60} />
                          <YAxis domain={[0, 10]} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="score" fill="var(--color-score)" radius={[4,4,0,0]} />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Investment Memo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{hybridMemo}</div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parsing">
          <Card>
            <CardHeader>
              <CardTitle>Document Parsing</CardTitle>
              <CardDescription>Extract plain text from your uploaded file.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <UploadDrop file={file} onChange={handleFileChange} />
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={runExtract} disabled={isLoading || !fileDataUri}>
                  {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Parsing...</>) : 'Extract Text'}
                </Button>
                {extractedText && (
                  <Button variant="secondary" onClick={() => navigator.clipboard.writeText(extractedText)}>Copy Text</Button>
                )}
              </div>
              <Textarea value={extractedText} onChange={(e) => setExtractedText(e.target.value)} rows={14} className="font-mono" placeholder="Extracted text will appear here" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function UploadDrop({ file, onChange }: { file: File | null; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div>
      <label htmlFor="file-upload" className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-8 text-center hover:bg-accent">
        <Upload className="h-12 w-12 text-muted-foreground" />
        <p className="mt-4 font-semibold text-foreground">{file ? `Selected: ${file.name}` : "Click to upload a document"}</p>
        <p className="text-sm text-muted-foreground">PDF, DOCX, PPTX, or TXT</p>
      </label>
      <input id="file-upload" type="file" className="hidden" onChange={onChange} accept=".pdf,.docx,.pptx,.txt,.txt" />
    </div>
  );
}

const sampleStructuredData = {
  team: {
    relevant_experience_years: 12,
    prior_startup_outcomes: ["profitable"],
    founder_investment_percentage: 10.0,
    esop_pool_percentage: 12.0,
    key_roles_covered: ["tech", "ops", "sales", "vision"],
  },
  market: {
    som_usd_millions: 50.0,
    market_cagr_percentage: 18.0,
    funded_competitors: 2,
    moat_strength: "brand",
  },
  product: {
    problem_solution_fit: "painkiller",
    product_stage: "scaling",
    tech_defensibility: "unique_data",
    adoption_barrier_score: 3,
  },
  economics: {
    ltv_to_cac_ratio: 3.5,
    gross_margin_percentage: 65.0,
    cac_payback_months: 11,
    runway_months: 16,
  },
  traction: {
    mom_growth_rate_percentage: 15.0,
    net_revenue_retention: 105.0,
    has_marquee_partner: true,
  },
  financials: {
    projection_realism_score: 7,
    profitability_timeline_years: 3,
    debt_to_equity_ratio: 0.1,
  },
  risks: [
    { likelihood: 3, impact: 4 },
    { likelihood: 2, impact: 3 },
    { likelihood: 4, impact: 2 },
  ],
  growth: {
    scalability_type: "medium",
    expansion_paths: 3,
    potential_acquirers: 6,
  },
};

