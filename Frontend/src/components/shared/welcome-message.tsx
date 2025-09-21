
"use client";

import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/lib/types";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

interface WelcomeMessageProps {
    role: UserRole;
}

export function WelcomeMessage({ role }: WelcomeMessageProps) {
  const { user } = useAuth();

  return (
    <Card className="p-4 bg-secondary">
      <div className="flex items-start gap-4">
        <Info className="h-5 w-5 text-secondary-foreground mt-1" />
        <div>
          <CardTitle className="text-base font-semibold">
            Welcome, {user?.name}!
          </CardTitle>
          <CardDescription className="text-sm">
            You are logged in to the <strong>{role}</strong> dashboard. Here you can manage your projects and investments.
          </CardDescription>
        </div>
      </div>
    </Card>
  );
}
