// src/components/tag-config-form.tsx
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TagConfigExport } from "@/components/tag-config-export";

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
  tagType: z.enum(["DNA", "DNA_TAGTAMPER"], {
    required_error: "Please select a tag type",
  }),
  accessRights: z.string().regex(/^[0-9A-Fa-f]{2}$/, {
    message: "Access rights must be a 2-character hex value (e.g., '0F')",
  }),
  enableTagTamper: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export function TagConfigForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [configParams, setConfigParams] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      tagType: "DNA",
      accessRights: "0F",
      enableTagTamper: false,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/tag-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: values.url,
          accessRights: values.accessRights,
          enableTagTamper: values.enableTagTamper,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate configuration");
      }

      setConfigParams(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>NFC Tag Configuration</CardTitle>
          <CardDescription>
            Generate parameters for the NXP TagWriter app to program NFC DNA
            tags.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Redirect URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the URL that the tag should redirect to when
                      scanned.
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
                    <FormDescription>
                      Select the type of NFC tag you are programming.
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
                      Enter the access rights as a 2-digit hex value (default:
                      0F).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enableTagTamper"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Enable TagTamper
                      </FormLabel>
                      <FormDescription>
                        Enable tamper detection for TagTamper tags.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={form.watch("tagType") !== "DNA_TAGTAMPER"}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? "Generating..." : "Generate Configuration"}
              </Button>
            </form>
          </Form>

          {error && (
            <Alert variant="destructive" className="mt-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {configParams && (
            <div className="mt-6 space-y-4">
              <Separator />
              <h3 className="text-lg font-medium">Configuration Parameters</h3>
              <p className="text-sm text-gray-500">
                Use these parameters in the NXP TagWriter app to program your
                NFC tag.
              </p>

              <TagConfigExport
                configParams={configParams}
                redirectUrl={form.getValues("url")}
                enableTagTamper={form.getValues("enableTagTamper")}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-xs text-gray-500">
            The MASTER_KEY used for encryption matches the one in the adaki-nfc
            verification backend.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
