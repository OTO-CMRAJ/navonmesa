import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { projects } from "@/lib/mock-data";
import { ArrowRight, BrainCircuit, DollarSign, Briefcase } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { WelcomeMessage } from "@/components/shared/welcome-message";

export default function InvestorDashboard() {
  const investorId = "user-investor-1"; // Mock
  const publishedProjects = projects.filter(p => p.status === 'published');
  const projectsInvestedIn = 0; // Mock
  const amountInvested = 0; // Mock

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold">Investor Dashboard</h1>
      </div>
      
      <WelcomeMessage role="investor" />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects Invested</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectsInvestedIn}</div>
            <p className="text-xs text-muted-foreground">Total projects you've invested in</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount Invested</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${amountInvested.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all your investments</p>
          </CardContent>
        </Card>
        <Card className="bg-primary text-primary-foreground border-primary">
          <CardHeader>
             <BrainCircuit className="h-6 w-6" />
            <CardTitle>AI-Powered Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Upload your own documents for an in-depth AI analysis report.</p>
            <Button variant="secondary" asChild className="mt-4">
              <Link href="/investor/analysis">Analyze Files <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>

       <Card>
          <CardHeader>
            <CardTitle>Investment Opportunities</CardTitle>
            <CardDescription>Browse the latest projects seeking funding.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {publishedProjects.map(project => (
              <Card key={project.id} className="overflow-hidden flex flex-col">
                <div className="relative h-40 w-full">
                  <Image 
                    src={`https://picsum.photos/seed/${project.id}/600/400`}
                    alt={project.name}
                    fill
                    className="object-cover"
                    data-ai-hint="technology abstract"
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-headline font-bold text-lg">{project.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2 flex-1">{project.description.substring(0, 100)}...</p>
                  <div className="mt-4 flex items-center justify-between">
                     <div className="text-sm">
                        <span className="font-bold text-primary">${project.investmentDetails[0]?.investment.toLocaleString()}</span>
                        <span className="text-muted-foreground"> ask</span>
                     </div>
                    <Button asChild size="sm">
                      <Link href={`/investor/projects/${project.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>
    </div>
  );
}
