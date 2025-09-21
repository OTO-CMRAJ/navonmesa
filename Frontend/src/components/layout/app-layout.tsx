"use client";

import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/lib/types";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Logo } from "@/components/shared/logo";
import { UserNav } from "./user-nav";
import { SidebarContent, SidebarHeader } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  requiredRole: UserRole;
  sidebarNav: React.ReactNode;
}

export function AppLayout({ children, requiredRole, sidebarNav }: AppLayoutProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== requiredRole)) {
      router.push("/login");
    }
  }, [user, loading, isAuthenticated, requiredRole, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
        <Sidebar>
            <SidebarHeader className="border-b">
                <Logo />
            </SidebarHeader>
            <SidebarContent>
                {sidebarNav}
            </SidebarContent>
        </Sidebar>
        <SidebarInset>
            <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-card px-4 sm:px-6">
                <SidebarTrigger className="md:hidden" />
                <div className="flex-1">
                    {/* Page title could go here */}
                </div>
                <UserNav />
            </header>
            <main className="flex-1 p-4 sm:p-6">
                {children}
            </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
