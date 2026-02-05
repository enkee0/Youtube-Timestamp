"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Copy, Check, Video } from "lucide-react";

export default function TimestampPage() {
  const [videoId, setVideoId] = useState("");
  const [chapters, setChapters] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("generate");

  const postTimestamp = async () => {
    const accessToken =
      typeof window !== "undefined"
        ? localStorage.getItem("yt_access_token")
        : null;
    const refreshToken =
      typeof window !== "undefined"
        ? localStorage.getItem("yt_refresh_token")
        : null;
    if (!accessToken && !refreshToken) {
      window.location.href = "http://localhost:4000/auth/login";
      return;
    }
    setLoading(true);
    setError(null);
    setChapters(null);
    try {
      const res = await fetch("http://localhost:4000/timestamp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, accessToken, refreshToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      if (data?.accessToken && typeof window !== "undefined") {
        localStorage.setItem("yt_access_token", data.accessToken);
      }
      const result = data.chapters ?? null;
      setChapters(result);
      if (result) setActiveTab("result");
    } catch {
      setError("Failed to fetch chapters");
    } finally {
      setLoading(false);
    }
  };

  const copyChapters = async () => {
    if (!chapters) return;
    await navigator.clipboard.writeText(chapters);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="page-container py-8 sm:py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1.5 font-medium">
              <Video className="size-3.5" aria-hidden />
              YouTube
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Chapter generator
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
            Generate timestamp chapters from any YouTube video using its
            captions. Paste the video ID, then copy the result into your
            description.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 w-full justify-start rounded-xl border border-border/60 bg-card/80 p-1 shadow-sm sm:w-auto">
            <TabsTrigger value="generate" className="rounded-lg px-4">
              Generate
            </TabsTrigger>
            <TabsTrigger
              value="result"
              disabled={!chapters}
              className="rounded-lg px-4 data-[state=inactive]:opacity-70"
            >
              Result
              {chapters && (
                <Badge
                  variant="default"
                  className="ml-2 size-5 rounded-full p-0 text-[10px]"
                >
                  1
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="mt-0">
            <Card className="overflow-hidden border border-border/60 bg-card/95 shadow-md ring-1 ring-border/20 backdrop-blur-sm">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-lg font-semibold">
                  Video ID
                </CardTitle>
                <CardDescription>
                  From a YouTube URL like{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                    youtube.com/watch?v=<strong>dQw4w9WgXcQ</strong>
                  </code>
                  , use the part in bold.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="videoId"
                    className="text-sm font-medium leading-none text-foreground"
                  >
                    Video ID
                  </label>
                  <Input
                    id="videoId"
                    value={videoId}
                    onChange={(e) => setVideoId(e.target.value)}
                    placeholder="e.g. dQw4w9WgXcQ"
                    disabled={loading}
                    onKeyDown={(e) => e.key === "Enter" && postTimestamp()}
                    className="h-10 rounded-lg border-border/80 bg-background/50 transition-colors focus-visible:ring-2 focus-visible:ring-primary/20"
                    aria-invalid={!!error}
                    aria-describedby={error ? "videoId-error" : undefined}
                  />
                  {error && (
                    <p
                      id="videoId-error"
                      className="text-sm text-destructive"
                      role="alert"
                    >
                      {error}
                    </p>
                  )}
                </div>
              </CardContent>
              <Separator className="bg-border/60" />
              <CardFooter className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  Requires a signed-in YouTube account with access to the
                  video&apos;s captions.
                </p>
                <Button
                  onClick={postTimestamp}
                  disabled={loading || !videoId.trim()}
                  className="min-w-[140px] shrink-0"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                      Generating…
                    </>
                  ) : (
                    "Get chapters"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="result" className="mt-0">
            {chapters ? (
              <Card className="overflow-hidden border border-border/60 bg-card/95 shadow-md ring-1 ring-border/20 backdrop-blur-sm">
                <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 space-y-0 pb-4">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold">
                      Chapters
                    </CardTitle>
                    <CardDescription>
                      Copy and paste into your video description.
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyChapters}
                    className="gap-2 border-border/60"
                  >
                    {copied ? (
                      <>
                        <Check className="size-4" aria-hidden />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="size-4" aria-hidden />
                        Copy
                      </>
                    )}
                  </Button>
                </CardHeader>
                <Separator className="bg-border/60" />
                <CardContent className="pt-4">
                  <pre
                    className="max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-lg border border-border/60 bg-muted/30 p-4 font-mono text-sm leading-relaxed text-foreground"
                    role="region"
                    aria-label="Generated chapters"
                  >
                    {chapters}
                  </pre>
                </CardContent>
              </Card>
            ) : (
              <Card className="border border-dashed border-border/60 bg-card/50">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-sm text-muted-foreground">
                    Generate chapters first to see the result here.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 border-border/60"
                    onClick={() => setActiveTab("generate")}
                  >
                    Go to Generate
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
