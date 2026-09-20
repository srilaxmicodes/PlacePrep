"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ReadinessCard from "@/components/analytics/ReadinessCard";
import StreakCard from "@/components/analytics/StreakCard";
import FunnelCard from "@/components/analytics/FunnelCard";
import SkillGapCard from "@/components/analytics/SkillGapCard";
import CategoryCompletionChart from "@/components/charts/CategoryCompletionChart";
import CompanyReadinessChart from "@/components/charts/CompanyReadinessChart";
import { BarChart3, RefreshCw, AlertCircle, ArrowRight } from "lucide-react";

export default function AnalyticsDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/analytics");
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to load analytics data.");
      }

      setData(json);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="h-8 bg-slate-200 rounded-lg w-48 animate-pulse" />
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
        <h3 className="font-bold text-base">Failed to Load Analytics</h3>
        <p className="text-sm mt-1 mb-4">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-red-600 text-white font-semibold text-xs rounded-xl hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <span>Readiness & Funnel Analytics</span>
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Track preparation streaks, company readiness scores, and interview conversion rates.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-200 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Grid Row 1: Streaks & Overall Readiness Score */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StreakCard streaks={data.streaks} />

        <ReadinessCard
          readiness={{
            score: data.averageScore,
            checklistCompletionPercent: data.readinessScores.length > 0
              ? Math.round(
                  data.readinessScores.reduce(
                    (s: number, r: any) => s + r.readiness.checklistCompletionPercent,
                    0
                  ) / data.readinessScores.length
                )
              : 0,
            roundsClearedPercent: data.readinessScores.length > 0
              ? Math.round(
                  data.readinessScores.reduce(
                    (s: number, r: any) => s + r.readiness.roundsClearedPercent,
                    0
                  ) / data.readinessScores.length
                )
              : 0,
            activityScorePercent: data.readinessScores.length > 0
              ? Math.round(
                  data.readinessScores.reduce(
                    (s: number, r: any) => s + r.readiness.activityScorePercent,
                    0
                  ) / data.readinessScores.length
                )
              : 0,
            breakdown: {
              checklistCompleted: data.readinessScores.reduce(
                (s: number, r: any) => s + r.readiness.breakdown.checklistCompleted,
                0
              ),
              checklistTotal: data.readinessScores.reduce(
                (s: number, r: any) => s + r.readiness.breakdown.checklistTotal,
                0
              ),
              roundsCleared: data.readinessScores.reduce(
                (s: number, r: any) => s + r.readiness.breakdown.roundsCleared,
                0
              ),
              roundsTotal: data.readinessScores.reduce(
                (s: number, r: any) => s + r.readiness.breakdown.roundsTotal,
                0
              ),
              activeDaysInLast14: data.streaks.activeDaysInLast14,
            },
          }}
        />
      </div>

      {/* Grid Row 2: Funnel Analytics & Skill Gap View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FunnelCard funnel={data.funnel} />
        <SkillGapCard topGaps={data.topGlobalGaps} />
      </div>

      {/* Grid Row 3: Category Completion & Company Readiness Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryCompletionChart data={data.categoryStats || []} />
        <CompanyReadinessChart data={data.companyReadiness || []} />
      </div>

      {/* Company Readiness Table */}
      {data.readinessScores && data.readinessScores.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-lg">
            Company-wise Readiness Scores
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs uppercase text-slate-400 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Company & Role</th>
                  <th className="p-3">Stage</th>
                  <th className="p-3">Checklist (50%)</th>
                  <th className="p-3">Rounds Cleared (30%)</th>
                  <th className="p-3">Readiness Score</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.readinessScores.map((item: any) => (
                  <tr key={item.applicationId} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-semibold text-slate-900">
                      {item.company}
                      <span className="block text-xs font-normal text-slate-500">
                        {item.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-slate-100 text-slate-700">
                        {item.stage}
                      </span>
                    </td>
                    <td className="p-3">
                      {item.readiness.breakdown.checklistCompleted} / {item.readiness.breakdown.checklistTotal} topics
                    </td>
                    <td className="p-3">
                      {item.readiness.breakdown.roundsCleared} / {item.readiness.breakdown.roundsTotal} rounds
                    </td>
                    <td className="p-3">
                      <span className="font-extrabold text-indigo-600 text-base">
                        {item.readiness.score} / 100
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/dashboard/applications/${item.applicationId}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

