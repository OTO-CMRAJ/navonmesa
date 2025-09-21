import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { projects } from "@/lib/mock-data";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function InvestorProjectsPage() {
  const publishedProjects = projects.filter(p => p.status === 'published');

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Investment Opportunities</h1>
          <p className="text-muted-foreground">Browse the latest projects seeking funding.</p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search projects..." className="pl-10" />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {publishedProjects.map(project => (
          <Card key={project.id} className="overflow-hidden flex flex-col transition-all hover:shadow-lg">
            <Link href={`/investor/projects/${project.id}`} className="block h-full">
              <div className="relative h-48 w-full">
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
                  <Button asChild size="sm" variant="outline" className="shrink-0">
                    <span className="flex items-center">View Details</span>
                  </Button>
                </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
