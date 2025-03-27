"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatUID } from "@/lib/crypto/utils";

interface Tag {
  id: string;
  tag_uid: string;
  tag_type: string;
  redirect_url: string;
  programmed_at: string;
  tt_status_mirroring: boolean;
}

export function TagList() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await fetch("/api/tags");

        if (!response.ok) {
          throw new Error("Failed to fetch tags");
        }

        const data = await response.json();
        setTags(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchTags();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Registered Tags</CardTitle>
          <CardDescription>
            View all registered NFC tags in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <p>Loading tags...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-red-500">{error}</p>
            </div>
          ) : tags.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <p>No tags registered yet.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>UID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Redirect URL</TableHead>
                    <TableHead>Programmed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tags.map((tag) => (
                    <TableRow key={tag.id}>
                      <TableCell className="font-mono">
                        {formatUID(tag.tag_uid)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            tag.tag_type === "DNA_TAGTAMPER"
                              ? "outline"
                              : "secondary"
                          }
                        >
                          {tag.tag_type === "DNA_TAGTAMPER"
                            ? "DNA TagTamper"
                            : "DNA"}
                        </Badge>
                        {tag.tag_type === "DNA_TAGTAMPER" &&
                          tag.tt_status_mirroring && (
                            <Badge variant="outline" className="ml-2">
                              TT Enabled
                            </Badge>
                          )}
                      </TableCell>
                      <TableCell
                        className="max-w-xs truncate"
                        title={tag.redirect_url}
                      >
                        <a
                          href={tag.redirect_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {tag.redirect_url}
                        </a>
                      </TableCell>
                      <TableCell>
                        {new Date(tag.programmed_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
