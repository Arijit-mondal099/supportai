import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";

interface DocItem {
  _id: string;
  title: string;
  sourceType: "file" | "url" | "text" | "notion";
  status: "processing" | "ready" | "error";
  chunkCount: number;
  notionResourceId?: string;
  notionResourceType?: "page" | "database";
  createdAt: string | null;
}

type JsonPayload =
  | { sourceType: "url"; title: string; url: string }
  | { sourceType: "text"; title: string; content: string }
  | { sourceType: "notion"; title: string; resourceId: string; resourceType: "page" | "database" };

export function useDocuments(botId: string) {
  return useQuery({
    queryKey: queryKeys.documents.all(botId),
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/chatbots/${botId}/documents`);
      if (!data.success) throw new Error(data.message || "Failed to load documents");
      return data.documents as DocItem[];
    },
  });
}

export function useAddDocument(botId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: JsonPayload | FormData) => {
      if (payload instanceof FormData) {
        const res = await fetch(`/api/chatbots/${botId}/documents`, {
          method: "POST",
          body: payload,
          credentials: "include",
        });
        return res.json() as Promise<{ success?: boolean; message?: string }>;
      }
      const { data } = await apiClient.post(`/api/chatbots/${botId}/documents`, payload);
      return data as { success?: boolean; message?: string };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.documents.all(botId),
      });
    },
  });
}

export function useDeleteDocument(botId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId: string) => {
      await apiClient.delete(`/api/chatbots/${botId}/documents/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.documents.all(botId),
      });
    },
  });
}
