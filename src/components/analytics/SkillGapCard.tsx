"use client";

import Link from "next/link";
import { SkillGapItem } from "@/lib/skillGap";
import { AlertCircle, Target, ArrowUpRight, Clock } from "lucide-react";

interface SkillGapCardProps {
  topGaps: SkillGapItem[];
}

export default function SkillGapCard({ topGaps }: SkillGapCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-rose-600" />
            <span>Skill-Gap View — Focus First</span>
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">
            Top incomplete topics prioritized by importance and deadline urgency.
          </p>
        </div>
      </div>

      {topGaps.length === 0 ? (
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
          <p className="text-emerald-700 text-sm font-bold">
            🎉 No critical skill gaps!
          </p>
          <p className="text-slate-500 text-xs mt-1">
            All high priority topics across your target companies are completed.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {topGaps.map((gap) => (
            <div
              key={gap._id}
              className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 transition"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-900 text-sm truncate">
                    {gap.topic}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {gap.category}
                  </span>

                  {gap.isUrgentDeadline && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">
                      <Clock className="w-3 h-3" />
                      Urgent Deadline
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500">
                  Company: <strong className="text-slate-700">{gap.companyName}</strong> ({gap.role})
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                    gap.priority === "High"
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : gap.priority === "Medium"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  {gap.priority} Priority
                </span>

                <Link
                  href={`/dashboard/applications/${gap.applicationId}`}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition"
                  title="Open Application Planner"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

