"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Kanban, BookOpen, MessageSquareText, RefreshCw, AlertCircle, Sparkles } from "lucide-react";
import SummaryCards from "@/components/dashboard/SummaryCards";
import DeadlineAlerts from "@/components/dashboard/DeadlineAlerts";
import ApplicationsByStageChart from "@/components/charts/ApplicationsByStageChart";
import WeeklyActivityChart from "@/components/charts/WeeklyActivityChart";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/dashboard");
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to load dashboard data.");
      }

      setData(json);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="h-20 bg-slate-200 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-center">
        <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
        <h3 className="font-bold text-base">Failed to Load Dashboard</h3>
        <p className="text-sm mt-1 mb-4">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-red-600 text-white font-semibold text-xs rounded-xl hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-2xl p-6 shadow-md flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-100 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Placement Tracker & Prep Planner</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Placement Overview</h1>
          <p className="text-indigo-100 text-xs mt-0.5">
            Monitor your applications, upcoming deadlines, prep activity, and interview progress.
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary Cards */}
      <SummaryCards summary={data.summary} />

      {/* Grid: Deadline Alerts & Applications by Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeadlineAlerts deadlinesInfo={data.deadlinesInfo} />
        <ApplicationsByStageChart data={data.applicationsByStageData} />
      </div>

      {/* Grid: Weekly Prep Activity & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyActivityChart data={data.weeklyActivity} />

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-base">Quick Navigation</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/dashboard/applications"
              className="group bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition"
            >
              <Kanban className="w-5 h-5 text-indigo-600 mb-2 group-hover:scale-110 transition" />
              <h4 className="font-bold text-xs text-slate-800">Applications</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Kanban Board</p>
            </Link>

            <Link
              href="/dashboard/planner"
              className="group bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition"
            >
              <BookOpen className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition" />
              <h4 className="font-bold text-xs text-slate-800">Prep Planner</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Topic Checklists</p>
            </Link>

            <Link
              href="/dashboard/logs"
              className="group bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 transition"
            >
              <MessageSquareText className="w-5 h-5 text-purple-600 mb-2 group-hover:scale-110 transition" />
              <h4 className="font-bold text-xs text-slate-800">Interview Logs</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Round Questions</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}