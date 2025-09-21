"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { users } from "@/lib/mock-data";
import { Separator } from "../ui/separator";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(3, { message: "Password is too short." }),
});

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const user = await login(values.email, values.password);
      if (!user) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "An Error Occurred",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
        setIsLoading(false);
    }
  }

  const handleDemoLogin = (role: 'startup' | 'investor') => {
    const user = role === 'startup' 
      ? users.find(u => u.email === 'demo@demo.com') 
      : users.find(u => u.role === 'investor');
    
    if (user) {
      form.setValue('email', user.email);
      form.setValue('password', '123'); // All demo users have this password
      onSubmit({ email: user.email, password: '123' });
    }
  }

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>
      </form>
    </Form>
     <div className="mt-4 relative">
        <div className="absolute inset-0 flex items-center">
            <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
            Or continue with
            </span>
        </div>
    </div>

    <div className="mt-4 grid grid-cols-2 gap-4">
        <Button variant="outline" onClick={() => handleDemoLogin('startup')} disabled={isLoading}>
        {isLoading ? <Loader2 className="animate-spin" /> : "Demo Startup"}
        </Button>
        <Button variant="outline" onClick={() => handleDemoLogin('investor')} disabled={isLoading}>
        {isLoading ? <Loader2 className="animate-spin" /> : "Demo Investor"}
        </Button>
    </div>
    </>
  );
}
