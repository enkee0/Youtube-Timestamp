"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Video, LayoutGrid, User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

const nav = [
  { href: "/", label: "Home", icon: LayoutGrid },
  { href: "/timestamp", label: "Chapter generator", icon: Video },
] as const;

function getInitial(name?: string | null): string {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2);
  }
  return name.slice(0, 2).toUpperCase();
}

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-card/80 shadow-sm backdrop-blur-md">
      <div className="page-container flex h-14 items-center gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-foreground transition-opacity hover:opacity-90"
        >
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
            <Video className="size-4" aria-hidden />
          </span>
          <span className="hidden text-sm sm:inline">YT Chapters</span>
        </Link>
        <nav className="flex flex-1 items-center gap-1" aria-label="Main">
          {nav.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "gap-2 font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          {loading ? (
            <div
              className="size-9 shrink-0 rounded-full bg-muted/80"
              aria-hidden
            />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Open account menu"
                >
                  <Avatar className="size-9 shrink-0 rounded-full border-2 border-border/80 shadow-sm ring-1 ring-border/40 transition-shadow hover:shadow-md">
                    <AvatarImage
                      src={user.picture}
                      alt={user.name ?? "Profile"}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-xs font-medium">
                      {getInitial(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown
                    className="size-4 text-muted-foreground"
                    aria-hidden
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-0.5">
                    {user.name && (
                      <p className="text-sm font-medium text-foreground">
                        {user.name}
                      </p>
                    )}
                    {user.email && (
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/timestamp" className="gap-2 cursor-pointer">
                    <User className="size-4" aria-hidden />
                    Chapter generator
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={handleSignOut}
                  className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="size-4" aria-hidden />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link href="/login">Sign in with Google</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
