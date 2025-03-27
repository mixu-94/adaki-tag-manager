// src/components/tag-config-export.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Share2, Smartphone } from "lucide-react";
import { useState } from "react";
import QRCode from "./qr-code";

interface TagConfigExportProps {
  configParams: {
    sdmEncFileData: string;
    accessRights: string;
    sdmMetaReadKey: string;
    ttStatusCtlKey: string;
  };
  redirectUrl: string;
  enableTagTamper: boolean;
}

export function TagConfigExport({
  configParams,
  redirectUrl,
  enableTagTamper,
}: TagConfigExportProps) {
  const [copied, setCopied] = useState(false);

  // Create NXP TagWriter compatible file content
  const generateNxpTagWriterConfig = () => {
    // Create a config object with the format expected by NXP TagWriter
    const config = {
      version: "1.0",
      dateCreated: new Date().toISOString(),
      tagType: "NTAG424DNA",
      sdmConfig: {
        enabled: true,
        sdmEncFileData: configParams.sdmEncFileData,
        accessRights: configParams.accessRights,
        sdmMetaReadKey: configParams.sdmMetaReadKey,
        ttStatusCtlKey: configParams.ttStatusCtlKey,
        enableTagTamper: enableTagTamper,
        redirectUrl: redirectUrl,
      },
    };

    return JSON.stringify(config, null, 2);
  };

  const downloadConfigFile = () => {
    const configData = generateNxpTagWriterConfig();
    const blob = new Blob([configData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    // Create a filename based on the redirect URL
    const urlObj = new URL(redirectUrl);
    const hostname = urlObj.hostname.replace(/\./g, "_");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    link.href = url;
    link.download = `nfc_config_${hostname}_${timestamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={downloadConfigFile}
          className="flex items-center gap-2"
        >
          <Download size={16} />
          Download Configuration
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 size={16} />
              View Full Configuration
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>NFC Tag Configuration</DialogTitle>
              <DialogDescription>
                Full configuration for NXP TagWriter application
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="json" className="mt-4">
              <TabsList>
                <TabsTrigger value="json">JSON Format</TabsTrigger>
                <TabsTrigger value="params">Individual Parameters</TabsTrigger>
                <TabsTrigger value="mobile" className="flex items-center gap-1">
                  <Smartphone size={14} />
                  <span>Mobile Transfer</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="json" className="mt-2">
                <div className="relative">
                  <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96 text-xs font-mono">
                    {generateNxpTagWriterConfig()}
                  </pre>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      copyToClipboard(generateNxpTagWriterConfig())
                    }
                  >
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="params" className="mt-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">SDM Enc File Data</h3>
                    <div className="bg-gray-50 p-2 rounded-md break-all font-mono text-xs">
                      {configParams.sdmEncFileData}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Access Rights</h3>
                    <div className="bg-gray-50 p-2 rounded-md font-mono text-xs">
                      {configParams.accessRights}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">SDM Meta Read Key</h3>
                    <div className="bg-gray-50 p-2 rounded-md font-mono text-xs">
                      {configParams.sdmMetaReadKey}
                    </div>
                  </div>
                  {enableTagTamper && (
                    <div>
                      <h3 className="font-medium mb-1">TT Status Ctl Key</h3>
                      <div className="bg-gray-50 p-2 rounded-md font-mono text-xs">
                        {configParams.ttStatusCtlKey}
                      </div>
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium mb-1">Redirect URL</h3>
                    <div className="bg-gray-50 p-2 rounded-md font-mono text-xs">
                      {redirectUrl}
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="mobile" className="mt-2">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-medium mb-3 text-center">
                      Direct Transfer to Mobile
                    </h3>

                    <div className="flex flex-col items-center">
                      {/* Create a temporary URL to store configuration and share via QR code */}
                      <div className="mb-4">
                        <QRCode
                          url={
                            window.location.origin +
                            "/shared-config?data=" +
                            encodeURIComponent(
                              btoa(generateNxpTagWriterConfig())
                            )
                          }
                          size={180}
                        />
                      </div>

                      <div className="text-center max-w-md space-y-2">
                        <p className="text-sm">
                          Scan this QR code with your mobile device to open a
                          page with this configuration. From there, you can
                          download the file to your device.
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                            onClick={() => {
                              const emailSubject = "NFC Tag Configuration";
                              const emailBody =
                                "Attached is the NFC tag configuration for NXP TagWriter.\n\n";
                              const mailtoLink = `mailto:?subject=${encodeURIComponent(
                                emailSubject
                              )}&body=${encodeURIComponent(emailBody)}`;
                              window.location.href = mailtoLink;
                            }}
                          >
                            Email to Yourself
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                            onClick={() => {
                              if (navigator.share) {
                                const configBlob = new Blob(
                                  [generateNxpTagWriterConfig()],
                                  { type: "application/json" }
                                );
                                const configFile = new File(
                                  [configBlob],
                                  "nfc-config.json",
                                  { type: "application/json" }
                                );

                                navigator
                                  .share({
                                    title: "NFC Tag Configuration",
                                    text: "Configuration for NXP TagWriter",
                                    files: [configFile],
                                  })
                                  .catch(console.error);
                              } else {
                                alert(
                                  "Web Share API not supported in your browser"
                                );
                              }
                            }}
                          >
                            Share Config File
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800">
                    <h4 className="font-medium mb-1">Direct Transfer Tips</h4>
                    <ul className="list-disc ml-5 space-y-1">
                      <li>
                        For iPhone/iPad: AirDrop the configuration file from
                        your computer
                      </li>
                      <li>
                        For Android: Use Nearby Share or email the file to
                        yourself
                      </li>
                      <li>
                        You can also use cloud storage like Google Drive or
                        Dropbox
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          How to use this configuration file
        </h3>
        <ol className="text-sm text-blue-700 space-y-1 pl-5 list-decimal">
          <li>Download the configuration file using the button above</li>
          <li>Transfer the file to your device with the NXP TagWriter app</li>
          <li>In the app, select "Import Configuration"</li>
          <li>Choose the downloaded file</li>
          <li>Place your NTAG 424 DNA tag on the device to program it</li>
          <li>
            After successful programming, return to register the tag in the
            system
          </li>
        </ol>
      </div>
    </div>
  );
}
