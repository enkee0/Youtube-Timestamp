"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Video, LogIn } from "lucide-react";

export default function LoginPage() {
  const login = () => {
    window.location.href = "http://localhost:4000/auth/login";
  };

  return (
    <div className="page-container flex min-h-[calc(100vh-3.5rem)] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <Card className="border border-border/60 bg-card/95 shadow-md ring-1 ring-border/20 backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Video className="size-6" aria-hidden />
            </div>
            <CardTitle className="text-xl font-semibold">
              Sign in with Google
            </CardTitle>
            <CardDescription>
              Connect your YouTube account to generate chapters from video
              captions. We only request read-only access to captions.
            </CardDescription>
          </CardHeader>
          <Separator className="bg-border/60" />
          <CardContent className="pt-6">
            <Button onClick={login} className="w-full gap-2" size="lg">
              <LogIn className="size-4" aria-hidden />
              Continue with Google
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">Back to home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
