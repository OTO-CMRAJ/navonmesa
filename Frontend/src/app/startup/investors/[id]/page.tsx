
import { notFound } from 'next/navigation';
import { users } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, Briefcase, DollarSign } from 'lucide-react';
import React from 'react';

function InvestorProfileClient({ investor }: { investor: any }) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Mock data for profile
  const investmentFocus = ['SaaS', 'FinTech', 'AI/ML'];
  const investmentCount = Math.floor(Math.random() * 10);
  const totalInvested = Math.floor(Math.random() * 5000000);
  
  if (!investor) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <Avatar className="h-32 w-32 border-4 border-primary">
          <AvatarImage src={investor.avatarUrl} alt={investor.name} />
          <AvatarFallback className="text-4xl">{getInitials(investor.name)}</AvatarFallback>
        </Avatar>
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-headline font-bold">{investor.name}</h1>
          <p className="text-lg text-muted-foreground flex items-center justify-center md:justify-start gap-2 mt-2">
            <Mail className="h-5 w-5" />
            {investor.email}
          </p>
          <div className="mt-4 flex justify-center md:justify-start gap-2">
            <Button>Send Message</Button>
            <Button variant="outline">Connect</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
            <CardHeader className="flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Projects Invested</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{investmentCount}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Invested (Est.)</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">${totalInvested.toLocaleString()}</div>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Investment Focus</CardTitle>
          <CardDescription>Primary areas of interest for new investments.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {investmentFocus.map(area => (
            <div key={area} className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
              {area}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}


export default function InvestorProfilePage({ params }: { params: { id: string } }) {
  const investor = users.find(u => u.id === params.id && u.role === 'investor');

  if (!investor) {
    notFound();
  }

  return <InvestorProfileClient investor={investor} />;
}
