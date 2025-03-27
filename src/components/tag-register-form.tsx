// src/components/tag-register-form.tsx
"use client";

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from "sonner";

const formSchema = z.object({
  tagUid: z.string().regex(/^[0-9A-Fa-f]+$/, {
    message: "Tag UID must be a valid hexadecimal string",
  }),
  tagType: z.enum(["DNA", "DNA_TAGTAMPER"], {
    required_error: "Please select a tag type",
  }),
  redirectUrl: z.string().url({ message: "Please enter a valid URL" }),
  accessRights: z.string().regex(/^[0-9A-Fa-f]{2}$/, {
    message: "Access rights must be a 2-character hex value (e.g., '0F')",
  }),
  derivationKey: z.string().regex(/^[0-9A-Fa-f]{2}$/, {
    message: "Derivation key must be a 2-character hex value (e.g., '0F')",
  }),
  ttStatusMirroring: z.boolean().default(false),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function TagRegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tagUid: "",
      tagType: "DNA",
      redirectUrl: "",
      accessRights: "0F",
      derivationKey: "0F",
      ttStatusMirroring: false,
      notes: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to register tag');
      }
      
      toast({
        title: "Success",
        description: "Tag registered successfully",
      });
      
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Register Programmed Tag</CardTitle>
          <CardDescription>
            Register a tag after programming it with the NXP TagWriter app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="tagUid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag UID</FormLabel>
                    <FormControl>
                      <Input placeholder="04A5B6C7D8E9F0" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the UID of the programmed tag (hexadecimal format).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tagType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="DNA" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            NTAG 424 DNA
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="DNA_TAGTAMPER" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            NTAG 424 DNA TagTamper
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="redirectUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Redirect URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the URL that the tag redirects to when scanned.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="accessRights"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Access Rights</FormLabel>
                    <FormControl>
                      <Input placeholder="0F" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the access rights used for programming (2-digit hex value).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="derivationKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Derivation Key</FormLabel>
                    <FormControl>
                      <Input placeholder="0F" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the derivation key used for programming (2-digit hex value).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="ttStatusMirroring"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">TT Status Mirroring</FormLabel>
                      <FormDescription>
                        Is TagTamper status mirroring enabled?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={form.watch('tagType') !== 'DNA_TAGTAMPER'}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional information about this tag..." 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Optional notes about this tag (e.g., location, purpose).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register Tag"}
              </Button>
            </form>
          </Form>
          
          {error && (
            <Alert variant="destructive" className="mt-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-xs text-gray-500">
            Register tags in the database after programming them with the NXP TagWriter app.
          </p>
        </CardFooter>
      </Card>
    </div>
  );