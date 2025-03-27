// src/app/configure/page.tsx
import { MainNav } from "@/components/main-nav";
import { TagConfigForm } from "@/components/tag-config-form";

export default function ConfigurePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center py-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Configure NFC Tags
            </h1>
            <p className="max-w-[700px] text-gray-500 dark:text-gray-400">
              Generate parameters for the NXP TagWriter app to program NTAG 424
              DNA tags.
            </p>
          </div>

          <div className="py-6">
            <TagConfigForm />
          </div>

          <div className="max-w-2xl mx-auto mt-12 p-6 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">
              How to Use These Parameters
            </h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                Install the{" "}
                <a
                  href="https://play.google.com/store/apps/details?id=com.nxp.nfc.tagwriter"
                  className="text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  NXP TagWriter
                </a>{" "}
                app on your mobile device.
              </li>
              <li>Open the app and select "Write" or "Create new dataset".</li>
              <li>Choose "Secure Dynamic Messaging (SDM)" from the options.</li>
              <li>
                Enter the parameters exactly as shown in the configuration
                output.
              </li>
              <li>Place your NTAG 424 DNA tag on the device to program it.</li>
              <li>
                After successful programming, return to this application to
                register the tag.
              </li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}
