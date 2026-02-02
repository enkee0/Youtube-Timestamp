import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="page-container py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-3xl space-y-10 text-center">
        <div className="space-y-4">
          <Badge variant="secondary" className="gap-1.5 font-medium">
            <Video className="size-3.5" aria-hidden />
            YouTube chapters
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Generate timestamp chapters from any video
          </h1>
          <p className="mx-auto max-w-xl text-base text-muted-foreground sm:text-lg">
            Use your video&apos;s captions to create clean chapter timestamps.
            Paste the video ID, get chapters—then copy into your description.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" className="gap-2" asChild>
            <Link href="/timestamp">
              Open chapter generator
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-border/60"
            asChild
          >
            <Link href="/login">Sign in with Google</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Sign in with YouTube to access captions. No video data is stored.
        </p>
      </div>
    </div>
  );
}
