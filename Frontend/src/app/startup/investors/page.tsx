import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { users } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function StartupInvestorsPage() {
    const investors = users.filter(u => u.role === 'investor');
    
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold">Browse Investors</h1>
       <Card>
          <CardHeader>
            <CardTitle>Potential Investors</CardTitle>
            <CardDescription>Connect with investors who might be interested in your vision.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {investors.map(investor => (
              <Card key={investor.id}>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20 mb-4">
                        <AvatarImage src={investor.avatarUrl} />
                        <AvatarFallback>{getInitials(investor.name)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg">{investor.name}</h3>
                    <p className="text-sm text-muted-foreground">{investor.email}</p>
                    <Button className="mt-4" asChild>
                        <Link href={`/startup/investors/${investor.id}`}>View Profile</Link>
                    </Button>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
    </div>
  );
}
