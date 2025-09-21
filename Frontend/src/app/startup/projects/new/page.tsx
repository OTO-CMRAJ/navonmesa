
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Loader2, Upload, File as FileIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  investment: z.coerce.number().min(1, "Investment must be a positive number."),
  pitchDeck: z.any().optional(),
});

export default function NewProjectPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [pitchDeckFile, setPitchDeckFile] = useState<File | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      investment: 0,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setPitchDeckFile(file);
    form.setValue("pitchDeck", file);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("New Project Data:", { ...values, pitchDeck: values.pitchDeck?.name });
    toast({
      title: "Project Created!",
      description: `Your project "${values.name}" has been successfully created.`,
    });
    setIsLoading(false);
    router.push("/startup/projects");
  }


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold">Create New Project</h1>
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>Fill out the form below to create a new funding project.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Project Phoenix" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your project in a few sentences." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="investment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investment Ask ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="500000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="pitchDeck"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pitch Deck</FormLabel>
                    <FormControl>
                        <div>
                            <label htmlFor="pitch-deck-upload" className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-8 text-center hover:bg-accent">
                            <Upload className="h-12 w-12 text-muted-foreground" />
                            <p className="mt-4 font-semibold text-foreground">
                                {pitchDeckFile ? `Selected: ${pitchDeckFile.name}` : "Click to upload your pitch deck"}
                            </p>
                            <p className="text-sm text-muted-foreground">PDF, PPT, or PPTX (Max 10MB)</p>
                            </label>
                            <input id="pitch-deck-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.ppt,.pptx" />
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                 <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Project
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
