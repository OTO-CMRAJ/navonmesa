import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { projects, users } from "@/lib/mock-data";
import { ArrowRight, DollarSign, PlusCircle, Rocket, Users } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WelcomeMessage } from "@/components/shared/welcome-message";

export default function StartupDashboard() {
  const startupId = "user-demo"; // In a real app, get this from auth context
  const myProjects = projects.filter(p => p.startupId === startupId);
  const investorCount = [...new Set(myProjects.flatMap(p => p.interestedInvestors))].length;
  const totalFunding = 0; // Mock data

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  const interestedInvestors = users.filter(u => u.role === 'investor' && myProjects.some(p => p.interestedInvestors.includes(u.id)));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/startup/projects/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Project
          </Link>
        </Button>
      </div>

      <WelcomeMessage role="startup" />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{investorCount}</div>
            <p className="text-xs text-muted-foreground">Investors interested in your projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects Created</CardTitle>
            <Rocket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myProjects.length}</div>
            <p className="text-xs text-muted-foreground">{myProjects.filter(p => p.status === 'published').length} currently published</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Funding Received</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalFunding.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all closed projects</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>An overview of your latest projects.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {myProjects.slice(0, 5).map(project => (
                        <TableRow key={project.id}>
                            <TableCell className="font-medium">{project.name}</TableCell>
                            <TableCell>
                              <Badge variant={project.status === 'published' ? 'default' : (project.status === 'closed' ? 'destructive' : 'secondary')} className="capitalize">{project.status}</Badge>
                            </TableCell>
                            <TableCell>{new Date(project.updatedAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/startup/projects/${project.id}`}>View</Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Interested Investors</CardTitle>
            <CardDescription>Investors who have shown interest in your projects.</CardDescription>
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
                    <p className="text-sm text-muted-foreground">{investor.email}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/startup/investors/${investor.id}`}>View Profile</Link>
                </Button>
              </div>
            )) : <p className="text-sm text-muted-foreground text-center py-8">No interested investors yet.</p>}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
