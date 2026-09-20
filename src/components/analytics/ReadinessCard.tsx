"use client";

import { ReadinessScoreResult } from "@/types";
import { getReadinessLabel } from "@/lib/readiness";
import { Award, CheckSquare, MessageSquare, Flame } from "lucide-react";

interface ReadinessCardProps {
  readiness: ReadinessScoreResult;
  companyName?: string;
}

export default function ReadinessCard({ readiness, companyName }: ReadinessCardProps) {
  const { label, badgeBg } = getReadinessLabel(readiness.score);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">
            {companyName ? `${companyName} Readiness Score` : "Readiness Score"}
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">
            Evaluates prep checklist completion, rounds cleared, and 14-day activity.
          </p>
        </div>

        <span className={`px-3 py-1 text-xs font-extrabold rounded-full border ${badgeBg}`}>
          {label}
        </span>
      </div>

      {/* Main Score Display */}
      <div className="flex items-center gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-100">
        <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-white border-4 border-indigo-600 shadow-sm shrink-0">
          <span className="text-3xl font-black text-indigo-600">
            {readiness.score}
          </span>
          <span className="text-[10px] text-slate-400 font-bold absolute bottom-2">
            /100
          </span>
        </div>

        <div className="space-y-1 flex-1">
          <h4 className="font-bold text-slate-800 text-base">
            {readiness.score >= 70
              ? "High Preparation Level!"
              : readiness.score >= 40
              ? "Good Progress - Keep Going!"
              : "Action Required - Increase Prep!"}
          </h4>
          <p className="text-slate-600 text-xs leading-relaxed">
            Formula: Checklist (50%) + Interview Rounds (30%) + Recent Activity (20%).
          </p>
        </div>
      </div>

      {/* 3-Part Breakdown Bars */}
      <div className="space-y-4 pt-2">
        {/* Component 1: Checklist Completion (50% max) */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="flex items-center gap-1.5 text-slate-700">
              <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
              Checklist Completion (50% weight)
            </span>
            <span className="text-slate-900 font-bold">
              {readiness.checklistCompletionPercent} / 50 pts
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${(readiness.checklistCompletionPercent / 50) * 100}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {readiness.breakdown.checklistCompleted} of {readiness.breakdown.checklistTotal} topics completed
          </span>
        </div>

        {/* Component 2: Rounds Cleared (30% max) */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="flex items-center gap-1.5 text-slate-700">
              <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
              Rounds Cleared (30% weight)
            </span>
            <span className="text-slate-900 font-bold">
              {readiness.roundsClearedPercent} / 30 pts
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${(readiness.roundsClearedPercent / 30) * 100}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {readiness.breakdown.roundsCleared} of {readiness.breakdown.roundsTotal} rounds cleared
          </span>
        </div>

        {/* Component 3: 14-Day Activity (20% max) */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="flex items-center gap-1.5 text-slate-700">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Recent 14-Day Activity (20% weight)
            </span>
            <span className="text-slate-900 font-bold">
              {readiness.activityScorePercent} / 20 pts
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(readiness.activityScorePercent / 20) * 100}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {readiness.breakdown.activeDaysInLast14} active days in last 14 days (10 days = max)
          </span>
        </div>
      </div>
    </div>
  );
}

