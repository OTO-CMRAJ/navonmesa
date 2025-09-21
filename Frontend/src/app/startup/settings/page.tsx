import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StartupSettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Startup Settings</CardTitle>
          <CardDescription>Manage your startup profile and account settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Settings form will be here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
