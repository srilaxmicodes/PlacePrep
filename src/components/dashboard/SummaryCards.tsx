"use client";

import { Kanban, MessageSquareText, Award, Flame, CheckCircle } from "lucide-react";

interface SummaryCardsProps {
  summary: {
    totalApplications: number;
    activeInterviews: number;
    offers: number;
    averageReadinessScore: number;
    currentStreak: number;
  };
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {/* Stat 1: Total Applications */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Apps
          </span>
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Kanban className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900">
          {summary.totalApplications}
        </div>
      </div>

      {/* Stat 2: Active Interviews */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Interviews
          </span>
          <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
            <MessageSquareText className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900">
          {summary.activeInterviews}
        </div>
      </div>

      {/* Stat 3: Offers Received */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Offers
          </span>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-emerald-600">
          {summary.offers}
        </div>
      </div>

      {/* Stat 4: Avg Readiness Score */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Avg Readiness
          </span>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-indigo-600">
          {summary.averageReadinessScore} <span className="text-xs text-slate-400 font-bold">/100</span>
        </div>
      </div>

      {/* Stat 5: Current Streak */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between col-span-2 md:col-span-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Prep Streak
          </span>
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-amber-600 flex items-baseline gap-1">
          {summary.currentStreak} <span className="text-xs font-bold text-slate-500">days 🔥</span>
        </div>
      </div>
    </div>
  );
}
