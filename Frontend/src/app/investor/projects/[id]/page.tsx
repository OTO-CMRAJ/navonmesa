

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { projects } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { MessageSquare } from "lucide-react";

function InvestorProjectDetailsClient({ project }: { project: Project }) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isInterested, setIsInterested] = useState(user ? project.interestedInvestors.includes(user.id) : false);
    const [interestedCount, setInterestedCount] = useState(project.interestedInvestors.length);

    const handleInterestClick = () => {
        if (!user) return;
        
        let updatedProject;
        // In a real app, this would be an API call to update the database.
        if (isInterested) {
            updatedProject = {
                ...project,
                interestedInvestors: project.interestedInvestors.filter(id => id !== user.id)
            };
             toast({
                title: "Interest Removed",
                description: "You are no longer marked as interested in this project.",
            });
        } else {
             updatedProject = {
                ...project,
                interestedInvestors: [...project.interestedInvestors, user.id]
            };
            toast({
                title: "Interest Registered!",
                description: "The startup has been notified of your interest.",
            });
        }
        
        // This is a mock update. In a real app, you would refetch or optimistically update.
        const projectIndex = projects.findIndex(p => p.id === project.id);
        if(projectIndex !== -1) {
            projects[projectIndex] = updatedProject;
        }

        setIsInterested(!isInterested);
        setInterestedCount(updatedProject.interestedInvestors.length);
    };

    const handleChatClick = () => {
        toast({
            title: "Coming Soon!",
            description: "The direct chat functionality is under development.",
        })
    }

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
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pitch Deck Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground whitespace-pre-wrap">{project.pitchDeckSummary || "No summary available."}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Financials</CardTitle>
                            <CardDescription>High-level financial overview.</CardDescription>
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
                                        <p className="text-sm text-muted-foreground">Year 1 Profit/Loss</p>
                                        <p className="text-2xl font-bold">${project.investmentDetails[0].profit > 0 ? project.investmentDetails[0].profit.toLocaleString() : `(${project.investmentDetails[0].loss.toLocaleString()})`}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Year 1 EBITA</p>
                                        <p className="text-2xl font-bold">${project.investmentDetails[0].ebita.toLocaleString()}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No financial details provided.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Investment</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="text-sm text-muted-foreground">Status</div>
                                <Badge variant={project.status === 'published' ? 'default' : 'secondary'} className="capitalize">{project.status}</Badge>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Interested Investors</div>
                                <div className="font-bold">{interestedCount}</div>
                            </div>
                            <Button className="w-full" size="lg" onClick={handleInterestClick} variant={isInterested ? "secondary" : "default"}>
                                {isInterested ? "I'm No Longer Interested" : "I'm Interested"}
                            </Button>
                            <Button className="w-full" variant="outline" onClick={handleChatClick}>
                               <MessageSquare className="mr-2 h-4 w-4" /> Chat with Founder
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}


export default function InvestorProjectDetailsPage({ params }: { params: { id: string } }) {
  const project = projects.find(p => p.id === params.id);

  if (!project) {
    notFound();
  }

  return <InvestorProjectDetailsClient project={project} />;
}
