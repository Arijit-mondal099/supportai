import { Types } from "mongoose";
import { Cache } from "./cache";
import { db_connection } from "./db";
import { ChatbotModel } from "@/models/chatbot.model";
import { ConversationModel } from "@/models/conversation.model";
import { MessageModel } from "@/models/message.model";

export interface AccountAnalytics {
  totals: { agents: number; liveAgents: number; conversations: number; messages: number };
  daily: { label: string; messages: number }[];
  topAgents: { _id: string; name: string; status: "draft" | "live"; messages: number }[];
  recent: { _id: string; botName: string; messageCount: number; lastMessageAt: string | null }[];
}

import type { ActivityPoint, ActivityRange } from "./activity-ranges";

// Re-exported so existing `@/lib/analytics` imports keep working; the
// definitions themselves live in the client-safe `./activity-ranges` module.
export type { ActivityPoint, ActivityRange } from "./activity-ranges";
export { ACTIVITY_RANGE_OPTIONS, ACTIVITY_RANGE_VALUES, isActivityRange } from "./activity-ranges";

const startOfTodayUTC = (now: Date): Date =>
  new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

const hourLabel = (hour: number): string => {
  if (hour === 0) return "12a";
  if (hour < 12) return `${hour}a`;
  if (hour === 12) return "12p";
  return `${hour - 12}p`;
};

const monthLabel = (date: Date): string => {
  const month = date.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  return `${month} ’${String(date.getUTCFullYear()).slice(2)}`;
};

/** Pure bucket builders — shaped from a count map so they are unit-testable. */

export const buildTodayBuckets = (now: Date, counts: Map<number, number>): ActivityPoint[] =>
  Array.from({ length: 24 }, (_, hour) => ({
    label: hourLabel(hour),
    messages: counts.get(hour) ?? 0,
  }));

export const buildDailyBuckets = (
  now: Date,
  days: number,
  counts: Map<string, number>,
): ActivityPoint[] => {
  const start = startOfTodayUTC(now);
  start.setUTCDate(start.getUTCDate() - (days - 1));
  return Array.from({ length: days }, (_, i) => {
    const day = new Date(start);
    day.setUTCDate(start.getUTCDate() + i);
    const key = day.toISOString().slice(0, 10);
    return {
      label: `${day.getUTCMonth() + 1}/${day.getUTCDate()}`,
      messages: counts.get(key) ?? 0,
    };
  });
};

export const buildMonthlyBuckets = (
  now: Date,
  months: number,
  counts: Map<string, number>,
): ActivityPoint[] => {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (months - 1), 1));
  return Array.from({ length: months }, (_, i) => {
    const month = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + i, 1));
    const key = month.toISOString().slice(0, 7);
    return { label: monthLabel(month), messages: counts.get(key) ?? 0 };
  });
};

export const buildYearlyBuckets = (now: Date, counts: Map<number, number>): ActivityPoint[] => {
  const currentYear = now.getUTCFullYear();
  const years = [...counts.keys()];
  const firstYear = years.length ? Math.min(...years) : currentYear;
  const buckets: ActivityPoint[] = [];
  for (let year = firstYear; year <= currentYear; year++) {
    buckets.push({ label: String(year), messages: counts.get(year) ?? 0 });
  }
  return buckets;
};

/** Query Mongo for one range and shape it into chart points. */
const fetchSeries = async (
  ids: Types.ObjectId[],
  range: ActivityRange,
  now: Date,
): Promise<ActivityPoint[]> => {
  if (range === "today") {
    const start = startOfTodayUTC(now);
    const agg = (await MessageModel.aggregate([
      { $match: { botId: { $in: ids }, createdAt: { $gte: start } } },
      { $group: { _id: { $hour: { date: "$createdAt", timezone: "UTC" } }, count: { $sum: 1 } } },
    ])) as { _id: number; count: number }[];
    return buildTodayBuckets(now, new Map(agg.map((d) => [d._id, d.count])));
  }

  if (range === "7d" || range === "14d") {
    const days = range === "7d" ? 7 : 14;
    const start = startOfTodayUTC(now);
    start.setUTCDate(start.getUTCDate() - (days - 1));
    const agg = (await MessageModel.aggregate([
      { $match: { botId: { $in: ids }, createdAt: { $gte: start } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "UTC" } },
          count: { $sum: 1 },
        },
      },
    ])) as { _id: string; count: number }[];
    return buildDailyBuckets(now, days, new Map(agg.map((d) => [d._id, d.count])));
  }

  if (range === "12m") {
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11, 1));
    const agg = (await MessageModel.aggregate([
      { $match: { botId: { $in: ids }, createdAt: { $gte: start } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt", timezone: "UTC" } },
          count: { $sum: 1 },
        },
      },
    ])) as { _id: string; count: number }[];
    return buildMonthlyBuckets(now, 12, new Map(agg.map((d) => [d._id, d.count])));
  }

  const agg = (await MessageModel.aggregate([
    { $match: { botId: { $in: ids } } },
    { $group: { _id: { $year: { date: "$createdAt", timezone: "UTC" } }, count: { $sum: 1 } } },
  ])) as { _id: number; count: number }[];
  return buildYearlyBuckets(now, new Map(agg.map((d) => [d._id, d.count])));
};

/** Zero-filled points for owners with no agents — keeps the chart mounted. */
export const emptySeries = (range: ActivityRange, now: Date = new Date()): ActivityPoint[] => {
  switch (range) {
    case "today":
      return buildTodayBuckets(now, new Map());
    case "7d":
      return buildDailyBuckets(now, 7, new Map());
    case "12m":
      return buildMonthlyBuckets(now, 12, new Map());
    case "yearly":
      return buildYearlyBuckets(now, new Map());
    case "14d":
    default:
      return buildDailyBuckets(now, 14, new Map());
  }
};

export const getActivitySeries = async (
  ownerId: string,
  range: ActivityRange,
): Promise<ActivityPoint[]> => {
  return Cache.memoize(`cache:activity:${ownerId}:${range}`, 600, async () => {
    await db_connection();

    const bots = await ChatbotModel.find({ ownerId }).select("_id").lean();
    const ids = bots.map((b) => b._id as Types.ObjectId);
    if (!ids.length) return emptySeries(range);

    return fetchSeries(ids, range, new Date());
  });
};

const DAYS = 14;

export const getAccountAnalytics = async (
  ownerId: string,
  range: ActivityRange = "14d",
): Promise<AccountAnalytics> => {
  return Cache.memoize(`cache:analytics:${ownerId}:${range}`, 600, async () => {
    await db_connection();

    const bots = await ChatbotModel.find({ ownerId }).select("_id name status").lean();
    const ids = bots.map((b) => b._id as Types.ObjectId);
    const metaById = new Map(
      bots.map((b) => [
        String(b._id),
        { name: b.name as string, status: b.status as "draft" | "live" },
      ]),
    );

    // Window start only bounds the legacy 14-day aggregate; other ranges
    // go through fetchSeries instead — exactly one series query runs.
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    start.setUTCDate(start.getUTCDate() - (DAYS - 1));

    const legacyDailyAgg =
      range === "14d" && ids.length
        ? MessageModel.aggregate([
            { $match: { botId: { $in: ids }, createdAt: { $gte: start } } },
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "UTC" } },
                count: { $sum: 1 },
              },
            },
          ])
        : [];

    const [conversations, messages, ranged, topAgg, recentDocs] = await Promise.all([
      ConversationModel.countDocuments({ ownerId }),
      ids.length ? MessageModel.countDocuments({ botId: { $in: ids } }) : 0,
      range === "14d" ? legacyDailyAgg : ids.length ? fetchSeries(ids, range, now) : [],
      ids.length
        ? MessageModel.aggregate([
            { $match: { botId: { $in: ids } } },
            { $group: { _id: "$botId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
          ])
        : [],
      ConversationModel.find({ ownerId }).sort({ lastMessageAt: -1 }).limit(6).lean(),
    ]);

    let daily: { label: string; messages: number }[];
    if (range === "14d") {
      const dailyMap = new Map<string, number>();
      for (const d of ranged as { _id: string; count: number }[]) dailyMap.set(d._id, d.count);

      daily = [];
      for (let i = 0; i < DAYS; i++) {
        const day = new Date(start);
        day.setUTCDate(start.getUTCDate() + i);
        const key = day.toISOString().slice(0, 10);
        daily.push({
          label: `${day.getUTCMonth() + 1}/${day.getUTCDate()}`,
          messages: dailyMap.get(key) ?? 0,
        });
      }
    } else {
      daily = (ranged as { label: string; messages: number }[]).length
        ? (ranged as { label: string; messages: number }[])
        : emptySeries(range, now);
    }

    const topAgents = (topAgg as { _id: Types.ObjectId; count: number }[]).map((t) => {
      const meta = metaById.get(String(t._id));
      return {
        _id: String(t._id),
        name: meta?.name ?? "Untitled",
        status: meta?.status ?? "draft",
        messages: t.count,
      };
    });

    const recent = recentDocs.map((c) => ({
      _id: String(c._id),
      botName: metaById.get(String(c.botId))?.name ?? "Agent",
      messageCount: c.messageCount ?? 0,
      lastMessageAt: c.lastMessageAt ? new Date(c.lastMessageAt).toISOString() : null,
    }));

    return {
      totals: {
        agents: bots.length,
        liveAgents: bots.filter((b) => b.status === "live").length,
        conversations,
        messages,
      },
      daily,
      topAgents,
      recent,
    };
  });
};
