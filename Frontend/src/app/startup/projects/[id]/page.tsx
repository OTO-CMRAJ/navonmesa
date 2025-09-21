
import { projects } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { ProjectDetailsClient } from "@/components/startup/project-details";

export default function StartupProjectDetailsPage({ params }: { params: { id: string } }) {
  const project = projects.find(p => p.id === params.id);

  if (!project) {
    notFound();
  }

  return <ProjectDetailsClient project={project} />;
}
