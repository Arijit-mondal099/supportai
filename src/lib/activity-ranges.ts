/**
 * Client-safe activity range definitions.
 *
 * This module must stay free of Node-only imports (mongoose, Redis, …)
 * because the dashboard chart filter imports it from a Client Component.
 * All database access lives in `@/lib/analytics`, which re-exports these.
 */

export const ACTIVITY_RANGE_VALUES = ["today", "7d", "14d", "12m", "yearly"] as const;

export type ActivityRange = (typeof ACTIVITY_RANGE_VALUES)[number];

export interface ActivityPoint {
  label: string;
  messages: number;
}

export const ACTIVITY_RANGE_OPTIONS: { value: ActivityRange; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "14d", label: "Last 14 days" },
  { value: "12m", label: "Last 12 months" },
  { value: "yearly", label: "Yearly" },
];

export const isActivityRange = (value: unknown): value is ActivityRange =>
  typeof value === "string" && (ACTIVITY_RANGE_VALUES as readonly string[]).includes(value);
