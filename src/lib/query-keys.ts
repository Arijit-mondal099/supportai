export const queryKeys = {
  conversations: {
    all: (botId: string) => ["conversations", botId] as const,
    detail: (botId: string, conversationId: string) =>
      ["conversations", botId, conversationId] as const,
  },
  documents: {
    all: (botId: string) => ["documents", botId] as const,
  },
};
