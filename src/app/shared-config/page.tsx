// src/app/shared-config/page.tsx
"use client";

import { MainNav } from "@/components/main-nav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Download, ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SharedConfigPage() {
  const [configData, setConfigData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    try {
      const data = searchParams.get("data");
      if (!data) {
        throw new Error("No configuration data provided");
      }

      // Decode base64 data
      const decodedData = atob(data);
      setConfigData(decodedData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to decode configuration data"
      );
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  const downloadConfig = () => {
    if (!configData) return;

    const blob = new Blob([configData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    link.href = url;
    link.download = `nfc_config_${timestamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-md">
          <Link
            href="/configure"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft size={16} />
            Back to Tag Configuration
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>NFC Tag Configuration</CardTitle>
              <CardDescription>
                Download the NFC tag configuration file for use with the NXP
                TagWriter app.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <p>Loading configuration data...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 text-red-700 p-4 rounded-md">
                  <h3 className="font-medium mb-1">Error</h3>
                  <p>{error}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-green-50 p-4 rounded-md">
                    <h3 className="text-green-800 font-medium mb-2">
                      Configuration Ready
                    </h3>
                    <p className="text-green-700 text-sm">
                      Your NFC tag configuration file is ready to download. Use
                      this file with the NXP TagWriter app to program your NTAG
                      424 DNA tag.
                    </p>
                  </div>

                  <Button
                    onClick={downloadConfig}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Download Configuration File
                  </Button>

                  <div className="text-sm text-gray-500 space-y-2">
                    <h4 className="font-medium">Next Steps:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Download the configuration file</li>
                      <li>Open the NXP TagWriter app</li>
                      <li>Import the configuration file</li>
                      <li>Program your NFC tag with the imported settings</li>
                      <li>Register the tag in the adaki-tag-manager system</li>
                    </ol>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
