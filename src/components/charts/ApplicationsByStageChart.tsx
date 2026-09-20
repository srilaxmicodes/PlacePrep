"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Kanban as KanbanIcon } from "lucide-react";

interface ApplicationsByStageChartProps {
  data: { stage: string; count: number }[];
}

const STAGE_COLORS: Record<string, string> = {
  Wishlist: "#94a3b8",
  Applied: "#3b82f6",
  "OA/Test": "#f59e0b",
  Interview: "#a855f7",
  Offer: "#10b981",
  Rejected: "#f43f5e",
};

export default function ApplicationsByStageChart({
  data,
}: ApplicationsByStageChartProps) {
  const hasData = data && data.some((item) => item.count > 0);

  if (!hasData) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs h-[300px] flex flex-col items-center justify-center text-center">
        <KanbanIcon className="w-10 h-10 text-slate-300 mb-2" />
        <h4 className="font-bold text-slate-700 text-sm">No Applications Tracked Yet</h4>
        <p className="text-slate-400 text-xs mt-1">
          Add applications on your Kanban board to see stage distribution charts.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800 text-base">Applications by Stage</h3>
        <span className="text-xs font-semibold text-slate-500">Kanban Breakdown</span>
      </div>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="stage"
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
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={STAGE_COLORS[entry.stage] || "#6366f1"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
