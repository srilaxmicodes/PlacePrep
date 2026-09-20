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
import { Award } from "lucide-react";

interface CompanyReadinessChartProps {
  data: { company: string; role: string; score: number; stage: string }[];
}

export default function CompanyReadinessChart({ data }: CompanyReadinessChartProps) {
  const hasData = data && data.length > 0;

  if (!hasData) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs h-[300px] flex flex-col items-center justify-center text-center">
        <Award className="w-10 h-10 text-slate-300 mb-2" />
        <h4 className="font-bold text-slate-700 text-sm">No Companies Tracked</h4>
        <p className="text-slate-400 text-xs mt-1">
          Add job applications to view company readiness scores.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800 text-base">
          Readiness Score per Company
        </h3>
        <span className="text-xs font-semibold text-slate-500">0 - 100 Scale</span>
      </div>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="company"
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
              formatter={(value: any) => [`${value} / 100`, "Readiness Score"]}
              contentStyle={{
                backgroundColor: "#0f172a",
                borderRadius: "8px",
                border: "none",
                color: "#fff",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.score >= 70
                      ? "#10b981"
                      : entry.score >= 40
                      ? "#f59e0b"
                      : "#f43f5e"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

