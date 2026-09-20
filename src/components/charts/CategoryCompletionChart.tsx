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
import { BookOpen } from "lucide-react";

interface CategoryCompletionChartProps {
  data: { category: string; completed: number; total: number; percentage: number }[];
}

const CATEGORY_COLORS: Record<string, string> = {
  DSA: "#6366f1",
  "Core CS": "#3b82f6",
  Aptitude: "#10b981",
  HR: "#f59e0b",
  Custom: "#a855f7",
};

export default function CategoryCompletionChart({
  data,
}: CategoryCompletionChartProps) {
  const hasTopics = data && data.some((item) => item.total > 0);

  if (!hasTopics) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs h-[300px] flex flex-col items-center justify-center text-center">
        <BookOpen className="w-10 h-10 text-slate-300 mb-2" />
        <h4 className="font-bold text-slate-700 text-sm">No Prep Checklists Found</h4>
        <p className="text-slate-400 text-xs mt-1">
          Open a company application's prep planner to auto-generate category checklists.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800 text-base">
          Topic Completion by Category (%)
        </h3>
        <span className="text-xs font-semibold text-slate-500">Subject Progress</span>
      </div>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="category"
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: any) => [`${value}% completed`, "Completion"]}
              contentStyle={{
                backgroundColor: "#0f172a",
                borderRadius: "8px",
                border: "none",
                color: "#fff",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CATEGORY_COLORS[entry.category] || "#6366f1"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

