import { AppLayout } from "@/components/layout/app-layout";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { BrainCircuit, Briefcase, LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";

const investorNav = (
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip="Dashboard">
        <Link href="/investor/dashboard"><LayoutDashboard /><span>Dashboard</span></Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip="Projects">
        <Link href="/investor/projects"><Briefcase /><span>Projects</span></Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip="AI Analysis">
        <Link href="/investor/analysis"><BrainCircuit /><span>AI Analysis</span></Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip="Settings">
        <Link href="/investor/settings"><Settings /><span>Settings</span></Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
);

export default function InvestorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout requiredRole="investor" sidebarNav={investorNav}>
      {children}
    </AppLayout>
  );
}
