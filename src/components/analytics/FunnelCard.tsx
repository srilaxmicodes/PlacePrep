"use client";

import { FunnelMetrics } from "@/lib/analytics";
import { Filter, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";

interface FunnelCardProps {
  funnel: FunnelMetrics;
}

export default function FunnelCard({ funnel }: FunnelCardProps) {
  const { conversionRates, stageCounts, totalApplications } = funnel;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <Filter className="w-5 h-5 text-indigo-600" />
            <span>Recruitment Funnel Analytics</span>
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">
            Stage conversion rates from Application to Offer.
          </p>
        </div>

        <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-200">
          {totalApplications} Total Applications
        </span>
      </div>

      {/* Stage Conversion Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Applied -> OA */}
        <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100 space-y-2">
          <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            Applied → OA / Test
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-blue-900">
              {conversionRates.appliedToOA}%
            </span>
            <span className="text-xs text-blue-600 font-semibold">
              Conversion
            </span>
          </div>
          <div className="w-full bg-blue-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full"
              style={{ width: `${conversionRates.appliedToOA}%` }}
            />
          </div>
        </div>

        {/* Metric 2: OA -> Interview */}
        <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-100 space-y-2">
          <div className="text-xs font-bold text-purple-700 uppercase tracking-wider">
            OA / Test → Interview
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-purple-900">
              {conversionRates.oaToInterview}%
            </span>
            <span className="text-xs text-purple-600 font-semibold">
              Conversion
            </span>
          </div>
          <div className="w-full bg-purple-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full"
              style={{ width: `${conversionRates.oaToInterview}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Interview -> Offer */}
        <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 space-y-2">
          <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Interview → Offer
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-900">
              {conversionRates.interviewToOffer}%
            </span>
            <span className="text-xs text-emerald-600 font-semibold">
              Conversion
            </span>
          </div>
          <div className="w-full bg-emerald-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full"
              style={{ width: `${conversionRates.interviewToOffer}%` }}
            />
          </div>
        </div>
      </div>

      {/* Breakdown count pills */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
        <span className="text-slate-500 font-semibold">Applications Stage Counts:</span>
        <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-medium">
          Wishlist: {stageCounts.Wishlist}
        </span>
        <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full font-medium">
          Applied: {stageCounts.Applied}
        </span>
        <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-medium">
          OA: {stageCounts["OA/Test"]}
        </span>
        <span className="bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full font-medium">
          Interview: {stageCounts.Interview}
        </span>
        <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-medium">
          Offer: {stageCounts.Offer}
        </span>
        <span className="bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full font-medium">
          Rejected: {stageCounts.Rejected}
        </span>
      </div>
    </div>
  );
}

