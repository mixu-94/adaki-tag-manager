// src/app/dashboard/page.tsx
import { MainNav } from "@/components/main-nav";
import { TagList } from "@/components/tag-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center py-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="max-w-[700px] text-gray-500 dark:text-gray-400">
              View and manage all registered NFC tags in the system.
            </p>
          </div>

          <div className="py-6">
            <Tabs defaultValue="tags" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tags">Tags</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              <TabsContent value="tags">
                <div className="mt-6">
                  <TagList />
                </div>
              </TabsContent>
              <TabsContent value="analytics">
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tag Statistics</CardTitle>
                      <CardDescription>
                        Overview of registered tags by type and status.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-80 flex items-center justify-center">
                      <p className="text-gray-500">
                        Analytics will be available soon.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Scan Activity</CardTitle>
                      <CardDescription>
                        Recent tag scan activity and verification results.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-80 flex items-center justify-center">
                      <p className="text-gray-500">
                        Scan data will be available soon.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
