// src/app/register/page.tsx
import { MainNav } from "@/components/main-nav";
import { TagRegisterForm } from "@/components/tag-register-form";

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center py-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Register NFC Tags
            </h1>
            <p className="max-w-[700px] text-gray-500 dark:text-gray-400">
              Register tags after programming them with the NXP TagWriter app.
            </p>
          </div>

          <div className="py-6">
            <TagRegisterForm />
          </div>

          <div className="max-w-2xl mx-auto mt-12 p-6 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">How to Find the Tag UID</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                After programming your tag with the NXP TagWriter app, tap "Tag
                Info" or "Read Tag".
              </li>
              <li>Look for the "UID" or "Serial Number" field.</li>
              <li>
                Enter this value in the Tag UID field above (hexadecimal format,
                e.g., 04A5B6C7D8E9F0).
              </li>
              <li>
                Make sure to use the same values for other fields (redirect URL,
                access rights, etc.) that you used when programming the tag.
              </li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}
