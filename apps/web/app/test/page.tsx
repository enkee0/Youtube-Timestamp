import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

export default function TestPage() {
  return (
    <div className="page-container py-12 sm:py-16">
      <div className="mx-auto max-w-2xl space-y-6">
        <Card className="border border-border/60 bg-card/95 shadow-md ring-1 ring-border/20 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <Badge variant="secondary" className="w-fit">
              Test
            </Badge>
            <CardTitle className="text-xl font-semibold">Test page</CardTitle>
            <CardDescription>
              This route uses the same layout, spacing, and design tokens as the
              rest of the app.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-border/60"
              asChild
            >
              <Link href="/">
                <ArrowLeft className="size-4" aria-hidden />
                Back to home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
