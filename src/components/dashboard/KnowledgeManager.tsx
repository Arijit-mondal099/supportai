"use client";

import { useEffect, useState } from "react";
import { FileText, Link2, Loader2, Plus, Trash2 } from "lucide-react";
import { apiClient } from "@/lib/axios";

interface DocItem {
  _id: string;
  title: string;
  sourceType: "file" | "url" | "text";
  status: "processing" | "ready" | "error";
  chunkCount: number;
  createdAt: string | null;
}

type SourceTab = "text" | "url";

const statusStyles: Record<DocItem["status"], string> = {
  ready: "border-emerald-200 bg-emerald-50 text-emerald-600",
  processing: "border-amber-200 bg-amber-50 text-amber-600",
  error: "border-rose-200 bg-rose-50 text-rose-600",
};

export const KnowledgeManager = ({ botId }: { botId: string }) => {
  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<SourceTab>("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadDocs = async () => {
    try {
      const { data } = await apiClient.get(`/api/chatbots/${botId}/documents`);
      if (data.success) setDocuments(data.documents);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [botId]);

  const add = async () => {
    setError("");
    setSubmitting(true);
    try {
      const payload =
        tab === "url" ? { sourceType: "url", title, url } : { sourceType: "text", title, content };
      const { data } = await apiClient.post(`/api/chatbots/${botId}/documents`, payload);
      if (data.success) {
        setTitle("");
        setContent("");
        setUrl("");
        await loadDocs();
      } else {
        setError(data.message || "Failed to add document.");
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to add document.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await apiClient.delete(`/api/chatbots/${botId}/documents/${id}`);
      setDocuments((docs) => docs.filter((d) => d._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const canSubmit = tab === "url" ? url.trim().length > 0 : content.trim().length > 0;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Add form */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold tracking-tight text-slate-900">Add knowledge</h2>
        <p className="mt-1 text-sm text-slate-400">
          Paste text or import a page. It&apos;s embedded and used to ground answers.
        </p>

        <div className="mt-5 flex gap-2">
          {(["text", "url"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold capitalize transition ${
                tab === t
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              {t === "text" ? <FileText size={13} /> : <Link2 size={13} />}
              {t}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-slate-900/10"
          />

          {tab === "url" ? (
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://docs.example.com/faq"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-slate-900/10"
            />
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder="Paste FAQs, policies, product details…"
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-slate-900/10"
            />
          )}

          {error && <p className="text-xs text-rose-500">{error}</p>}

          <button
            onClick={add}
            disabled={submitting || !canSubmit}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50"
          >
            {submitting ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
            {submitting ? "Indexing…" : "Add to knowledge base"}
          </button>
        </div>
      </div>

      {/* Document list */}
      <div>
        <span className="mb-3 block text-xs font-semibold uppercase tracking-widest text-slate-400">
          Documents
        </span>
        {loading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : documents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
            No documents yet.
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((d) => (
              <div
                key={d._id}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{d.title}</p>
                  <p className="text-[11px] text-slate-400">
                    {d.sourceType} · {d.chunkCount} chunks
                  </p>
                </div>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${statusStyles[d.status]}`}
                >
                  {d.status}
                </span>
                <button
                  onClick={() => remove(d._id)}
                  className="cursor-pointer text-slate-300 transition hover:text-rose-500"
                  aria-label="Delete document"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
