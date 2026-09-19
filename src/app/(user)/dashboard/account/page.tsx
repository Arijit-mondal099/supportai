import { redirect } from "next/navigation";
import { ArrowUpRight, KeyRound, LogOut } from "lucide-react";
import Link from "next/link";
import { requireOwner } from "@/lib/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const initials = (email: string) => {
  const name = email.split("@")[0] ?? "";
  const parts = name.split(/[._-]+/).filter(Boolean);
  const letters =
    parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : (name.slice(0, 2) || "··").toUpperCase();
  return letters.toUpperCase();
};

export default async function SettingsPage() {
  const owner = await requireOwner();
  if (!owner) redirect("/api/auth/login");

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">Settings</h1>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          Your account and how signing in works.
        </p>
      </div>

      {/* Profile */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
          <Avatar className="size-11 rounded-2xl">
            <AvatarFallback className="rounded-2xl bg-secondary font-title text-sm font-bold">
              <span className="inline-block scale-[0.85] leading-none">
                {initials(owner.email)}
              </span>
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-lg">{owner.email || "—"}</CardTitle>
            <CardDescription>Signed in</CardDescription>
          </div>
          <Badge variant="secondary" className="shrink-0">
            Owner
          </Badge>
        </CardHeader>
        <CardFooter className="flex items-center justify-between gap-2">
          <span className="text-[13px] text-muted-foreground">
            Signing out ends this session on this device.
          </span>
          <Button variant="outline" render={<a href="/api/auth/logout" />} nativeButton={false}>
            <LogOut className="h-4 w-4" /> Log out
          </Button>
        </CardFooter>
      </Card>

      {/* API keys */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-foreground">
            <KeyRound className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <CardTitle className="text-lg">API keys</CardTitle>
            <CardDescription>
              Each agent carries its own provider key — there&apos;s nothing to configure here.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
            Keys live on the agent, not the account. To add or rotate one, open the agent and go to
            its <span className="font-medium text-foreground">Model &amp; key</span> tab.
          </p>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            size="sm"
            render={<Link href="/dashboard/agents" />}
            nativeButton={false}
          >
            Open agents <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
