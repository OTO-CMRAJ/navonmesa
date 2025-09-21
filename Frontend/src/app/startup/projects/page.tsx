import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { projects } from "@/lib/mock-data";
import { PlusCircle, MoreHorizontal, Edit, Eye, Archive } from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function StartupProjectsPage() {
  const startupId = "user-demo"; // Mock: get from auth
  const myProjects = projects.filter(p => p.startupId === startupId);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold">My Projects</h1>
        <Button asChild>
          <Link href="/startup/projects/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Project
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
          <CardDescription>Manage your funding proposals here.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Project Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Interested Investors</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myProjects.map(project => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={project.status === 'published' ? 'default' : (project.status === 'closed' ? 'destructive' : 'secondary')} 
                      className="capitalize"
                    >
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{project.interestedInvestors.length}</TableCell>
                  <TableCell>{new Date(project.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                           <Link href={`/startup/projects/${project.id}`}><Eye className="mr-2 h-4 w-4" /> View</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                           <Link href={`/startup/projects/${project.id}/edit`}><Edit className="mr-2 h-4 w-4" /> Edit</Link>
                        </DropdownMenuItem>
                        {project.status !== 'closed' && (
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <Archive className="mr-2 h-4 w-4" /> Close Project
                            </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
