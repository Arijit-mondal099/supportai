import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";

interface ConversationItem {
  _id: string;
  sessionId: string;
  messageCount: number;
  startedAt: string | null;
  lastMessageAt: string | null;
}

interface MessageItem {
  _id: string;
  role: "user" | "model";
  text: string;
  createdAt: string | null;
}

export function useConversations(botId: string) {
  return useQuery({
    queryKey: queryKeys.conversations.all(botId),
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/chatbots/${botId}/conversations`);
      if (!data.success) throw new Error(data.message || "Failed to load conversations");
      return data.conversations as ConversationItem[];
    },
  });
}

export function useConversationThread(botId: string, conversationId: string | null) {
  return useQuery({
    queryKey: queryKeys.conversations.detail(botId, conversationId ?? ""),
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/api/chatbots/${botId}/conversations?conversationId=${conversationId}`,
      );
      if (!data.success) throw new Error(data.message || "Failed to load thread");
      return data.messages as MessageItem[];
    },
    enabled: !!conversationId,
  });
}
