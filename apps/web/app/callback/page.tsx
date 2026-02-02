"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, CheckCircle } from "lucide-react";
import { API_BASE, fetchUser, setStoredUser } from "@/lib/auth";

export default function CallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (!code) {
        setStatus("error");
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/auth/callback?code=${code}`);
        const tokens = await res.json();
        if (tokens?.access_token) {
          localStorage.setItem("yt_access_token", tokens.access_token);
          if (tokens.refresh_token)
            localStorage.setItem("yt_refresh_token", tokens.refresh_token);
          const user = await fetchUser(tokens.access_token);
          if (user) setStoredUser(user);
          setStatus("done");
          router.push("/timestamp");
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    };
    run();
  }, [router]);

  return (
    <div className="page-container flex min-h-[calc(100vh-3.5rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md border border-border/60 bg-card/95 shadow-md ring-1 ring-border/20 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-lg font-semibold">
            {status === "loading" && "Connecting your account…"}
            {status === "done" && "Connected"}
            {status === "error" && "Something went wrong"}
          </CardTitle>
          <CardDescription>
            {status === "loading" &&
              "Finishing sign-in with Google. You’ll be redirected shortly."}
            {status === "done" && "Redirecting to the chapter generator…"}
            {status === "error" &&
              "We couldn’t complete sign-in. Try again from the login page."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center pb-8">
          {status === "loading" && (
            <Loader2
              className="size-10 animate-spin text-primary"
              aria-hidden
            />
          )}
          {status === "done" && (
            <CheckCircle className="size-10 text-primary" aria-hidden />
          )}
          {status === "error" && (
            <a
              href="/login"
              className="text-sm font-medium text-primary hover:underline"
            >
              Back to sign in
            </a>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
