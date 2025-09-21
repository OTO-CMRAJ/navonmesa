"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeInvestorFiles } from "@/ai/flows/analyze-investor-files";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function InvestorAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [analysisReport, setAnalysisReport] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAnalysisReport(""); // Clear previous report
    }
  };

  const handleAnalysis = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please upload a file to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    toast({
      title: "Analyzing Document...",
      description: "Your file is being processed by our AI. This may take a moment.",
    });

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const fileDataUri = reader.result as string;
        const result = await analyzeInvestorFiles({ fileDataUri });
        setAnalysisReport(result.analysisReport);
        toast({
          title: "Analysis Complete",
          description: "The AI report has been generated below.",
        });
      };
      reader.onerror = (error) => {
        throw new Error("Error reading file: " + error);
      }
    } catch (error) {
      console.error("Error analyzing file:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold">AI-Powered Analysis</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Analyze Project Documents</CardTitle>
          <CardDescription>
            Upload a project file (e.g., business plan, financial statements) to get an instant, AI-generated analysis report. 
            This can help you quickly identify key metrics, potential risks, and investment opportunities.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label htmlFor="file-upload" className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-8 text-center hover:bg-accent">
              <Upload className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 font-semibold text-foreground">
                {file ? `Selected: ${file.name}` : "Click to upload a document"}
              </p>
              <p className="text-sm text-muted-foreground">PDF, DOCX, PPTX, or TXT</p>
            </label>
            <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx,.pptx,.txt" />
          </div>
          
          <Button onClick={handleAnalysis} disabled={isLoading || !file} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Generate Report"
            )}
          </Button>

          {analysisReport && (
            <div className="space-y-4 pt-4">
                <Alert>
                  <AlertTitle className="font-bold">AI Analysis Report</AlertTitle>
                  <AlertDescription className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {analysisReport}
                  </AlertDescription>
                </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
