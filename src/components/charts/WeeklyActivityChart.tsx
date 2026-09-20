"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Flame } from "lucide-react";

interface WeeklyActivityChartProps {
  data: { weekLabel: string; topicsCompleted: number }[];
}

export default function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
  const hasData = data && data.some((item) => item.topicsCompleted > 0);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-amber-500" />
          <span>Weekly Prep Activity (Last 8 Weeks)</span>
        </h3>
        <span className="text-xs font-semibold text-slate-500">Topics Completed</span>
      </div>

      {!hasData ? (
        <div className="h-[220px] flex flex-col items-center justify-center text-center p-4 bg-slate-50 rounded-xl">
          <p className="text-slate-500 text-xs font-semibold">No activity recorded in the last 8 weeks.</p>
          <p className="text-slate-400 text-[11px] mt-1">Tick prep topics as done to start building your activity graph!</p>
        </div>
      ) : (
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="weekLabel"
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderRadius: "8px",
                  border: "none",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="topicsCompleted"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorActivity)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

