
"use client";

import { useForm, useFieldArray } from "react-hook-form";
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
import { Loader2, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter, notFound } from "next/navigation";
import { projects } from "@/lib/mock-data";

const investmentDetailSchema = z.object({
  year: z.coerce.number().min(2000),
  investment: z.coerce.number().min(0),
  profit: z.coerce.number().min(0),
  loss: z.coerce.number().min(0),
  moneyBurn: z.coerce.number().min(0),
  stockAvailable: z.coerce.number().min(0).max(100),
  ebita: z.coerce.number(),
});

const formSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  investmentDetails: z.array(investmentDetailSchema),
});

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const project = projects.find(p => p.id === params.id);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  if (!project) {
    notFound();
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: project.name,
      description: project.description,
      investmentDetails: project.investmentDetails,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "investmentDetails",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Updated Project Data:", values);
    toast({
      title: "Project Updated!",
      description: `Your project "${values.name}" has been successfully updated.`,
    });
    setIsLoading(false);
    router.push(`/startup/projects/${project?.id}`);
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold">Edit Project</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Details</CardTitle>
              <CardDescription>Provide financial details for each year.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 rounded-md border p-4 relative">
                  <h4 className="font-medium">Year {form.watch(`investmentDetails.${index}.year`) || ''}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <FormField control={form.control} name={`investmentDetails.${index}.year`} render={({ field }) => ( <FormItem><FormLabel>Year</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                     <FormField control={form.control} name={`investmentDetails.${index}.investment`} render={({ field }) => ( <FormItem><FormLabel>Investment</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                     <FormField control={form.control} name={`investmentDetails.${index}.profit`} render={({ field }) => ( <FormItem><FormLabel>Profit</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                     <FormField control={form.control} name={`investmentDetails.${index}.loss`} render={({ field }) => ( <FormItem><FormLabel>Loss</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                     <FormField control={form.control} name={`investmentDetails.${index}.moneyBurn`} render={({ field }) => ( <FormItem><FormLabel>Money Burn</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                     <FormField control={form.control} name={`investmentDetails.${index}.stockAvailable`} render={({ field }) => ( <FormItem><FormLabel>Stock (%)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                     <FormField control={form.control} name={`investmentDetails.${index}.ebita`} render={({ field }) => ( <FormItem><FormLabel>EBITA</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  </div>
                  <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ year: new Date().getFullYear(), investment: 0, profit: 0, loss: 0, moneyBurn: 0, stockAvailable: 0, ebita: 0 })}
              >
                Add Financial Year
              </Button>
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
