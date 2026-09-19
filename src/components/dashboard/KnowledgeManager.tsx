"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";
import {
  BookOpen,
  Database,
  FileText,
  Link2,
  Loader2,
  Plus,
  TriangleAlert,
  Trash2,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useDocuments, useAddDocument, useDeleteDocument } from "@/hooks/use-documents";

type SourceTab = "text" | "url" | "file" | "notion";

const SOURCES: { id: SourceTab; icon: typeof FileText; label: string }[] = [
  { id: "text", icon: FileText, label: "Text" },
  { id: "url", icon: Link2, label: "URL" },
  { id: "file", icon: Upload, label: "File" },
  { id: "notion", icon: BookOpen, label: "Notion" },
];

const SOURCE_META: Record<SourceTab, { icon: typeof FileText; label: string }> = {
  text: { icon: FileText, label: "Text" },
  url: { icon: Link2, label: "URL" },
  file: { icon: Upload, label: "File" },
  notion: { icon: BookOpen, label: "Notion" },
};

const statusStyles: Record<string, string> = {
  ready: "border-emerald-300 bg-emerald-50 text-emerald-700",
  processing: "border-amber-300 bg-amber-50 text-amber-700",
  error: "border-destructive/30 bg-destructive/10 text-destructive",
};

const ease = { type: "spring", bounce: 0.22, duration: 0.45 } as const;

const formatSize = (bytes: number): string =>
  bytes < 1024
    ? `${bytes} B`
    : bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric" }) : null;

export const KnowledgeManager = ({ botId }: { botId: string }) => {
  const { data: documents, isLoading } = useDocuments(botId);
  const addMutation = useAddDocument(botId);
  const deleteMutation = useDeleteDocument(botId);

  const [tab, setTab] = useState<SourceTab>("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState(0);
  const [resourceId, setResourceId] = useState("");
  const [resourceType, setResourceType] = useState<"page" | "database">("page");
  const [notionConnected, setNotionConnected] = useState(false);
  const [notionLoading, setNotionLoading] = useState(true);

  useEffect(() => {
    fetch("/api/account")
      .then((r) => r.json())
      .then((data) => setNotionConnected(data.hasNotionIntegration ?? false))
      .catch(() => {})
      .finally(() => setNotionLoading(false));
  }, []);

  const add = async () => {
    try {
      let payload:
        | FormData
        | { sourceType: "url"; title: string; url: string }
        | { sourceType: "text"; title: string; content: string }
        | {
            sourceType: "notion";
            title: string;
            resourceId: string;
            resourceType: "page" | "database";
          };
      if (tab === "file") {
        if (!file) return;
        const form = new FormData();
        form.append("file", file);
        if (title.trim()) form.append("title", title.trim());
        payload = form;
      } else if (tab === "url") {
        payload = { sourceType: "url", title, url };
      } else if (tab === "notion") {
        payload = { sourceType: "notion", title, resourceId, resourceType };
      } else {
        payload = { sourceType: "text", title, content };
      }

      const data = await addMutation.mutateAsync(payload);
      if (!data.success) {
        toast.error(data.message || "Could not add document.");
        return;
      }
      setTitle("");
      setContent("");
      setUrl("");
      setFile(null);
      setFileKey((k) => k + 1);
      setResourceId("");
      setResourceType("page");
      toast.success("Added to knowledge base");
    } catch {
      toast.error("Could not add document.");
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Document removed");
    } catch {
      toast.error("Could not remove document.");
    }
  };

  const canSubmit =
    tab === "file"
      ? !!file
      : tab === "url"
        ? url.trim().length > 0
        : tab === "notion"
          ? notionConnected && resourceId.trim().length > 0
          : content.trim().length > 0;

  const totalChunks = (documents ?? []).reduce((sum, d) => sum + (d.chunkCount ?? 0), 0);

  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      {/* Add form */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={ease}>
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-foreground">
              <Database className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <CardTitle className="text-lg">Add knowledge</CardTitle>
              <CardDescription>It&apos;s embedded and used to ground answers.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={tab} onValueChange={(v) => setTab(v as SourceTab)}>
              <TabsList className="w-full">
                {SOURCES.map((s) => {
                  const Icon = s.icon;
                  return (
                    <TabsTrigger key={s.id} value={s.id} className="flex-1">
                      <Icon className="h-3.5 w-3.5" aria-hidden /> {s.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <div className="space-y-1.5 pt-1">
                <Label htmlFor="doc-title">
                  Title <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="doc-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Refund policy"
                  autoComplete="off"
                />
              </div>

              <TabsContent value="text" className="space-y-1.5">
                <Label htmlFor="doc-content">Content</Label>
                <Textarea
                  id="doc-content"
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste FAQs, policies, product details…"
                />
              </TabsContent>

              <TabsContent value="url" className="space-y-1.5">
                <Label htmlFor="doc-url">Page URL</Label>
                <Input
                  id="doc-url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://docs.example.com/faq"
                  inputMode="url"
                />
                <p className="text-xs text-muted-foreground">
                  Public pages work best — login walls can&apos;t be read.
                </p>
              </TabsContent>

              <TabsContent value="file">
                <Label
                  htmlFor="doc-file"
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-8 text-center transition hover:border-muted-foreground/40 hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
                    <Upload size={18} className="text-muted-foreground" aria-hidden />
                  </span>
                  {file ? (
                    <>
                      <span className="max-w-full truncate text-sm font-medium">{file.name}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {formatSize(file.size)} · click to replace
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-sm font-medium">Choose a file to upload</span>
                      <span className="text-xs text-muted-foreground">
                        PDF, DOCX, TXT, MD or CSV
                      </span>
                    </>
                  )}
                  <input
                    id="doc-file"
                    key={fileKey}
                    type="file"
                    accept=".pdf,.docx,.txt,.md,.csv"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="hidden"
                  />
                </Label>
              </TabsContent>

              <TabsContent value="notion" className="space-y-3">
                {notionLoading ? null : !notionConnected ? (
                  <p className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
                    <TriangleAlert size={14} className="mt-0.5 shrink-0" aria-hidden />
                    <span>
                      Notion is not connected. Go to{" "}
                      <a href="/dashboard/plugins" className="font-medium underline">
                        Plugins
                      </a>{" "}
                      to add an integration token.
                    </span>
                  </p>
                ) : null}
                <div className="space-y-1.5">
                  <Label htmlFor="doc-notion">Page or database URL or ID</Label>
                  <Input
                    id="doc-notion"
                    value={resourceId}
                    onChange={(e) => setResourceId(e.target.value)}
                    placeholder="Paste a Notion URL"
                    disabled={!notionConnected}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2" role="group" aria-label="Resource type">
                  {(["page", "database"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={resourceType === t}
                      onClick={() => setResourceType(t)}
                      disabled={!notionConnected}
                      className={cn(
                        "cursor-pointer rounded-xl border px-3 py-2 text-[13px] font-semibold capitalize transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                        resourceType === t
                          ? "border-border bg-card text-foreground shadow-sm ring-1 ring-border"
                          : "border-border bg-muted/40 text-muted-foreground hover:text-foreground",
                        !notionConnected && "cursor-not-allowed opacity-50",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <details className="group">
                  <summary className="cursor-pointer text-xs font-medium text-muted-foreground underline decoration-dotted underline-offset-2 marker:text-muted-foreground">
                    How to find the ID
                  </summary>
                  <div className="mt-2 space-y-1.5 rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
                    <p>
                      Copy the URL from your browser — the ID is the last 32-character hex segment.
                      Paste the full URL above.
                    </p>
                    <p>
                      Make sure your integration is invited to the page or database (share → invite
                      → your integration name).
                    </p>
                  </div>
                </details>
              </TabsContent>
            </Tabs>

            <Button
              onClick={add}
              disabled={addMutation.isPending || !canSubmit || (tab === "notion" && notionLoading)}
              className="w-full sm:w-auto"
            >
              {addMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Plus className="h-4 w-4" aria-hidden />
              )}
              {addMutation.isPending ? "Indexing…" : "Add to knowledge base"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Documents */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...ease, delay: 0.1 }}
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="font-title text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            Documents
          </span>
          {!isLoading && !!documents?.length && (
            <span className="text-[13px] text-muted-foreground tabular-nums">
              {documents.length} {documents.length === 1 ? "doc" : "docs"} ·{" "}
              {totalChunks.toLocaleString()} chunks
            </span>
          )}
        </div>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="flex items-center gap-3 py-3">
                  <Skeleton className="h-9 w-9 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <Skeleton className="h-5 w-16 shrink-0 rounded-full" />
                  <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !documents || documents.length === 0 ? (
          <Card className="border-dashed bg-transparent">
            <CardContent className="flex flex-col items-center px-4 py-10 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
                <BookOpen className="h-5 w-5 text-muted-foreground" aria-hidden />
              </span>
              <p className="mt-3 text-sm font-medium">No documents yet</p>
              <p className="mt-1 max-w-[30ch] text-[13px] text-muted-foreground">
                Add text, a page, a file, or a Notion doc — answers get grounded in it.
              </p>
            </CardContent>
          </Card>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            className="space-y-2"
          >
            {documents.map((d) => {
              const meta = SOURCE_META[d.sourceType] ?? SOURCE_META.text;
              const Icon = meta.icon;
              const added = formatDate(d.createdAt);
              return (
                <motion.div
                  key={d._id}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={ease}
                >
                  <Card className="transition-shadow hover:shadow-sm">
                    <CardContent className="flex items-center gap-3 py-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-foreground">
                        <Icon size={16} aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{d.title}</p>
                        <p className="truncate text-xs text-muted-foreground tabular-nums">
                          {meta.label} · {d.chunkCount} {d.chunkCount === 1 ? "chunk" : "chunks"}
                          {added ? ` · added ${added}` : ""}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn("shrink-0 capitalize", statusStyles[d.status])}
                      >
                        {d.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => remove(d._id)}
                        disabled={deleteMutation.isPending}
                        aria-label={`Delete ${d.title}`}
                      >
                        <Trash2 size={15} />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
