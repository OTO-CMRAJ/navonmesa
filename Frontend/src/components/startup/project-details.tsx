
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { users } from "@/lib/mock-data";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Edit, Upload, MessageSquare } from "lucide-react";
import { summarizePitchDeck } from "@/ai/flows/summarize-pitch-decks";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@/lib/types";


export function ProjectDetailsClient({ project }: { project: Project }) {
  const { toast } = useToast();
  const [summary, setSummary] = useState(project?.pitchDeckSummary || "");
  const [isSummarizing, setIsSummarizing] = useState(false);
  
  const interestedInvestors = users.filter(u => project.interestedInvestors.includes(u.id));

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

    const handleChatClick = () => {
        toast({
            title: "Coming Soon!",
            description: "The direct chat functionality is under development.",
        })
    }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsSummarizing(true);
      toast({
        title: "Analyzing Pitch Deck...",
        description: "This may take a moment. Please wait.",
      });
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const pitchDeckDataUri = reader.result as string;
          const result = await summarizePitchDeck({ pitchDeckDataUri });
          setSummary(result.summary);
          toast({
            title: "Analysis Complete",
            description: "Your pitch deck has been summarized.",
          });
        };
      } catch (error) {
        console.error("Error summarizing pitch deck:", error);
        toast({
          title: "Analysis Failed",
          description: "Could not summarize the pitch deck. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSummarizing(false);
      }
    }
  };


  return (
    <div className="space-y-8">
        <div className="relative h-64 w-full rounded-lg overflow-hidden">
            <Image 
                src={`https://picsum.photos/seed/${project.id}/1200/400`}
                alt={project.name}
                fill
                className="object-cover"
                data-ai-hint="technology abstract"
            />
            <div className="absolute inset-0 bg-black/50 flex items-end p-6">
                <div>
                    <h1 className="text-4xl font-headline font-bold text-white">{project.name}</h1>
                    <p className="text-lg text-gray-200 mt-1">{project.description}</p>
                </div>
                 <Button asChild className="absolute top-4 right-4">
                    <Link href={`/startup/projects/${project.id}/edit`}><Edit className="mr-2" /> Edit Project</Link>
                </Button>
            </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
             <Card>
                <CardHeader>
                    <CardTitle>AI Pitch Deck Summary</CardTitle>
                    <CardDescription>Upload your pitch deck to get an AI-generated summary and analysis.</CardDescription>
                </CardHeader>
                <CardContent>
                    {summary ? (
                        <div className="space-y-4">
                           <p className="text-muted-foreground whitespace-pre-wrap">{summary}</p>
                           <Button variant="outline" onClick={() => document.getElementById('pitch-deck-upload')?.click()}>
                                <Upload className="mr-2"/> Re-analyze
                           </Button>
                        </div>
                    ) : (
                        <Button onClick={() => document.getElementById('pitch-deck-upload')?.click()} disabled={isSummarizing}>
                           {isSummarizing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                           <Upload className="mr-2"/> Upload & Summarize
                        </Button>
                    )}
                    <input type="file" id="pitch-deck-upload" className="hidden" accept=".pdf,.ppt,.pptx" onChange={handleFileChange} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Financial Overview</CardTitle>
                     <CardDescription>Key financial metrics for your project.</CardDescription>
                </CardHeader>
                <CardContent>
                     {project.investmentDetails.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div>
                                <p className="text-sm text-muted-foreground">Investment Ask</p>
                                <p className="text-2xl font-bold text-primary">${project.investmentDetails[0].investment.toLocaleString()}</p>
                            </div>
                             <div>
                                <p className="text-sm text-muted-foreground">Stock Offered</p>
                                <p className="text-2xl font-bold">{project.investmentDetails[0].stockAvailable}%</p>
                            </div>
                             <div>
                                <p className="text-sm text-muted-foreground">Y1 P/L</p>
                                <p className="text-2xl font-bold">${project.investmentDetails[0].profit > 0 ? project.investmentDetails[0].profit.toLocaleString() : `(${project.investmentDetails[0].loss.toLocaleString()})`}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Y1 EBITA</p>
                                <p className="text-2xl font-bold">${project.investmentDetails[0].ebita.toLocaleString()}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-4">No financial details provided yet. <Link href={`/startup/projects/${project.id}/edit`} className="text-primary hover:underline font-medium">Add them now</Link></p>
                    )}
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Project Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div>
                        <div className="text-sm text-muted-foreground">Status</div>
                        <Badge variant={project.status === 'published' ? 'default' : (project.status === 'closed' ? 'destructive' : 'secondary')} className="capitalize">{project.status}</Badge>
                    </div>
                     <div>
                        <div className="text-sm text-muted-foreground">Created</div>
                        <div className="font-medium">{new Date(project.createdAt).toLocaleDateString()}</div>
                    </div>
                     <div>
                        <div className="text-sm text-muted-foreground">Last Updated</div>
                        <div className="font-medium">{new Date(project.updatedAt).toLocaleDateString()}</div>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Interested Investors</CardTitle>
                    <CardDescription>A list of investors who have shown interest in this project.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     {interestedInvestors.length > 0 ? interestedInvestors.map(investor => (
                      <div key={investor.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={investor.avatarUrl} />
                            <AvatarFallback>{getInitials(investor.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{investor.name}</p>
                             <Link href={`/startup/investors/${investor.id}`} className="text-xs text-primary hover:underline">View Profile</Link>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleChatClick}>
                            <MessageSquare className="mr-2 h-4 w-4"/> Chat
                        </Button>
                      </div>
                    )) : <p className="text-sm text-muted-foreground text-center py-4">No interested investors yet.</p>}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
