"use client";

import { useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { FileText, Link2, Loader2, Plus, Trash2, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useDocuments, useAddDocument, useDeleteDocument } from "@/hooks/use-documents";

type SourceTab = "text" | "url" | "file";

const TABS: { id: SourceTab; icon: React.ReactNode; label: string }[] = [
  { id: "text", icon: <FileText size={13} />, label: "Text" },
  { id: "url", icon: <Link2 size={13} />, label: "URL" },
  { id: "file", icon: <Upload size={13} />, label: "File" },
];

const statusStyles: Record<string, string> = {
  ready: "border-emerald-300 bg-emerald-50 text-emerald-700",
  processing: "border-amber-300 bg-amber-50 text-amber-700",
  error: "border-destructive/30 bg-destructive/10 text-destructive",
};

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

  const add = async () => {
    try {
      let payload:
        | FormData
        | { sourceType: "url"; title: string; url: string }
        | { sourceType: "text"; title: string; content: string };
      if (tab === "file") {
        if (!file) return;
        const form = new FormData();
        form.append("file", file);
        if (title.trim()) form.append("title", title.trim());
        payload = form;
      } else if (tab === "url") {
        payload = { sourceType: "url", title, url };
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
    tab === "file" ? !!file : tab === "url" ? url.trim().length > 0 : content.trim().length > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Add knowledge</CardTitle>
          <CardDescription>
            Paste text, import a page, or upload a file (PDF, Word, TXT). It&apos;s embedded and
            used to ground answers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition",
                  tab === t.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
          />

          {tab === "url" && (
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://docs.example.com/faq"
            />
          )}

          {tab === "text" && (
            <Textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste FAQs, policies, product details…"
            />
          )}

          {tab === "file" && (
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-8 text-center transition hover:border-muted-foreground/40">
              <Upload size={20} className="text-muted-foreground" />
              <span className="text-sm font-medium">
                {file ? file.name : "Choose a file to upload"}
              </span>
              <span className="text-[11px] text-muted-foreground">PDF, DOCX, TXT, MD or CSV</span>
              <input
                key={fileKey}
                type="file"
                accept=".pdf,.docx,.txt,.md,.csv"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </label>
          )}

          <Button onClick={add} disabled={addMutation.isPending || !canSubmit}>
            {addMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {addMutation.isPending ? "Indexing…" : "Add to knowledge base"}
          </Button>
        </CardContent>
      </Card>

      <div>
        <span className="mb-3 block font-title text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Documents
        </span>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-5 w-14 rounded-full" />
                  <Skeleton className="h-8 w-8" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !documents || documents.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No documents yet.
            </CardContent>
          </Card>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            className="space-y-2"
          >
            {documents.map((d) => (
              <motion.div
                key={d._id}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
              >
                <Card>
                  <CardContent className="flex items-center gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{d.title}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {d.sourceType} · {d.chunkCount} chunks
                      </p>
                    </div>
                    <Badge variant="outline" className={cn("capitalize", statusStyles[d.status])}>
                      {d.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => remove(d._id)}
                      aria-label="Delete document"
                    >
                      <Trash2 size={15} />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};
