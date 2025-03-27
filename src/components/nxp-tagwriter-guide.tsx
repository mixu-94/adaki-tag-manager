// src/components/nxp-tagwriter-guide.tsx
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export function NxpTagwriterGuide() {
  return (
    <div className="space-y-4">
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>NXP TagWriter App Guide</AlertTitle>
        <AlertDescription>
          Follow these steps to program your NFC tag with the configuration file.
        </AlertDescription>
      </Alert>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="installation">
          <AccordionTrigger>1. Install NXP TagWriter</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p className="text-sm">
                Download and install the NXP TagWriter app from the App Store or Google Play Store:
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://play.google.com/store/apps/details?id=com.nxp.nfc.tagwriter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-gray-100 hover:bg-gray-200 rounded-md px-3 py-2 text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  Google Play Store
                </a>
                <a
                  href="https://apps.apple.com/app/nxp-tagwriter/id1246143596"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-gray-100 hover:bg-gray-200 rounded-md px-3 py-2 text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2"
                  >
                    <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path>
                    <path d="M10 2c1 .5 2 2 2 5"></path>
                  </svg>
                  App Store
                </a>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="transfer">
          <AccordionTrigger>2. Transfer the Configuration File</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p className="text-sm">
                After downloading the configuration file, transfer it to your mobile device:
              </p>
              <ul className="list-disc ml-5 text-sm space-y-1">
                <li>Email the file to yourself and open it on your mobile device</li>
                <li>Use a cloud storage service like Google Drive or Dropbox</li>
                <li>Use AirDrop (iOS) or Nearby Share (Android) if you're generating the config on your computer</li>
                <li>Connect your device via USB and transfer the file directly</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="import">
          <AccordionTrigger>3. Import the Configuration in NXP TagWriter</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p className="text-sm">
                Open the NXP TagWriter app and import the configuration:
              </p>
              <ol className="list-decimal ml-5 text-sm space-y-1">
                <li>Launch the NXP TagWriter app</li>
                <li>Tap on the menu icon (three lines) in the top left</li>
                <li>Select "Import"</li>
                <li>Navigate to where you saved the configuration file</li>
                <li>Select the file and tap "Import"</li>
              </ol>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="program">
          <AccordionTrigger>4. Program the NFC Tag</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p className="text-sm">
                Now program your NTAG 424 DNA tag with the imported configuration:
              </p>
              <ol className="list-decimal ml-5 text-sm space-y-1">
                <li>From the main menu, select "Write" or "Create Dataset"</li>
                <li>Choose the imported configuration</li>
                <li>Tap "Write to Tag"</li>
                <li>Place your NTAG 424 DNA tag on the back of your device</li>
                <li>Hold it steady until the programming process completes</li>
                <li>When successful, you'll see a confirmation message</li>
              </ol>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-2">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Do not move the tag during programming. Interrupting the process may render the tag unusable.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="verify">
          <AccordionTrigger>5. Verify the Programming</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p className="text-sm">
                After programming, verify that your tag works correctly:
              </p>
              <ol className="list-decimal ml-5 text-sm space-y-1">
                <li>In the NXP TagWriter app, go to "Read Tags" option</li>
                <li>Place your programmed tag on the device</li>
                <li>Verify that the tag information appears correctly</li>
                <li>Tap on the "Test URL" option if available to check the redirection</li>
              </ol>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="register">
          <AccordionTrigger>6. Register the Tag in adaki-tag-manager</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p className="text-sm">
                Finally, register the tag in the adaki-tag-manager system:
              </p>
              <ol className="list-decimal ml-5 text-sm space-y-1">
                <li>In the NXP TagWriter app, note the tag's UID (serial number)</li>
                <li>Return to the adaki-tag-manager website</li>
                <li>Go to the "Register Tags" section</li>
                <li>Enter the tag UID and other required information</li>
                <li>Submit the form to register the tag in the system</li>
              </ol>
              <p className="text-sm mt-2">
                Once registered, your tag will be tracked in the system and can be managed through the dashboard.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );