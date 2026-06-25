"use client";

import { motion } from "motion/react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  messages: { label: "Messages", color: "var(--chart-5)" },
} satisfies ChartConfig;

export function OverviewChart({ data }: { data: { label: string; messages: number }[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
    >
      <ChartContainer id="overview-chart" config={chartConfig} className="h-[240px] w-full">
        <AreaChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
          <defs>
            <linearGradient id="fillMessages" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-messages)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-messages)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 4" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
          <Area
            dataKey="messages"
            type="natural"
            fill="url(#fillMessages)"
            stroke="var(--color-messages)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </motion.div>
  );
}
