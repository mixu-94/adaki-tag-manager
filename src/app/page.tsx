// src/app/page.tsx
import { MainNav } from "@/components/main-nav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center py-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              NFC DNA Tag Manager
            </h1>
            <p className="max-w-[700px] text-lg text-gray-500 dark:text-gray-400">
              Configure, register, and manage NFC DNA tags that work with the
              adaki-nfc verification backend.
            </p>
            <div className="flex gap-4">
              <Link href="/configure">
                <Button size="lg">Configure Tags</Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline">
                  Register Tags
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 py-12">
            <Card>
              <CardHeader>
                <CardTitle>Configure Tags</CardTitle>
                <CardDescription>
                  Generate parameters for the NXP TagWriter app
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Create the necessary configuration parameters to program NTAG
                  424 DNA and DNA TagTamper tags using the NXP TagWriter mobile
                  application.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/configure" className="w-full">
                  <Button className="w-full">Configure a Tag</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Register Tags</CardTitle>
                <CardDescription>
                  Record programmed tags in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  After programming a tag with NXP TagWriter, register it in the
                  system database to track and manage it throughout its
                  lifecycle.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/register" className="w-full">
                  <Button className="w-full" variant="outline">
                    Register a Tag
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dashboard</CardTitle>
                <CardDescription>
                  View registered tags and analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Access a comprehensive dashboard showing all registered tags,
                  scan history, and performance analytics.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard" className="w-full">
                  <Button className="w-full" variant="outline">
                    Go to Dashboard
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} adaki-tag-manager. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
