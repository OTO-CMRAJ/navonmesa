import { AppLayout } from "@/components/layout/app-layout";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Briefcase, LayoutDashboard, Rocket, Settings, Users } from "lucide-react";
import Link from "next/link";

const startupNav = (
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip="Dashboard">
        <Link href="/startup/dashboard"><LayoutDashboard /><span>Dashboard</span></Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip="My Projects">
        <Link href="/startup/projects"><Rocket /><span>My Projects</span></Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
     <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip="Investors">
        <Link href="/startup/investors"><Users /><span>Investors</span></Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip="Settings">
        <Link href="/startup/settings"><Settings /><span>Settings</span></Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
);


export default function StartupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout requiredRole="startup" sidebarNav={startupNav}>
      {children}
    </AppLayout>
  );
}
