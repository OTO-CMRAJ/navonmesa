import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Rocket, Users, BrainCircuit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export default function Home() {
  const features = [
    {
      icon: <Rocket className="h-8 w-8 text-primary" />,
      title: "Launch Your Vision",
      description: "Startups can create detailed project profiles, upload pitch decks, and connect directly with interested investors.",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Discover Opportunities",
      description: "Investors get access to a curated list of innovative projects, complete with financial details and AI-powered analysis.",
    },
    {
      icon: <BrainCircuit className="h-8 w-8 text-primary" />,
      title: "AI-Powered Insights",
      description: "Leverage our GenAI tools to get instant summaries of pitch decks and in-depth analysis of financial documents.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Logo />
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <a href="https://lookerstudio.google.com/embed/reporting/1abfe335-5c91-4cb8-9aa1-ddd35f93149c/page/pTxYF">Company List</a>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative w-full py-20 md:py-32 lg:py-40">
           <div className="absolute inset-0 bg-black/50 z-10"></div>
            <Image
                src="https://picsum.photos/seed/hero/1200/800"
                alt="Hero background"
                fill
                className="object-cover"
                data-ai-hint="finance future"
            />
          <div className="container mx-auto px-4 md:px-6 text-center relative z-20">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-headline font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Connecting Startups and Investors
              </h1>
              <p className="mt-6 text-lg text-gray-200 md:text-xl">
                Navonmeṣa is the premier platform for discovering groundbreaking projects and securing the funding to make them a reality.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="/signup">Get Started</Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-20 md:py-28 lg:py-32 bg-card">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center">
              <h2 className="text-3xl font-headline font-bold sm:text-4xl md:text-5xl">Why Choose Navonmeṣa?</h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
                We provide the tools and connections you need to succeed, whether you're building the future or funding it.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="flex flex-col items-center text-center p-6">
                  <CardHeader>
                    {feature.icon}
                    <CardTitle className="mt-4 font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-20 md:py-28 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-3xl font-headline font-bold sm:text-4xl">For Startups</h2>
                <p className="mt-4 text-muted-foreground md:text-lg">
                  Bring your ideas to life. Create compelling project proposals and get in front of investors who believe in your vision.
                </p>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <span>Easily create and manage funding projects.</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <span>Receive AI-driven feedback on your pitch decks.</span>
                  </li>
                   <li className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <span>Securely chat with interested investors.</span>
                  </li>
                </ul>
              </div>
              <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-2xl">
                 <Image
                    src="https://picsum.photos/seed/project1/600/400"
                    alt="Startup working"
                    fill
                    className="object-cover"
                    data-ai-hint="technology abstract"
                />
              </div>
            </div>
            <div className="grid items-center gap-8 md:grid-cols-2 mt-20">
               <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-2xl md:order-2">
                 <Image
                    src="https://picsum.photos/seed/project2/600/400"
                    alt="Investor reviewing documents"
                    fill
                    className="object-cover"
                    data-ai-hint="business meeting"
                />
              </div>
              <div className="md:order-1">
                <h2 className="text-3xl font-headline font-bold sm:text-4xl">For Investors</h2>
                <p className="mt-4 text-muted-foreground md:text-lg">
                  Find your next great investment. We provide the data and insights you need to make informed decisions.
                </p>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <span>Browse a curated list of vetted startup projects.</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <span>Utilize AI analysis to quickly evaluate opportunities.</span>
                  </li>
                   <li className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <span>Connect directly with founders.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
       <footer className="border-t bg-card">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6">
          <Logo />
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Navonmeṣa. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
