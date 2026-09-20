"use client";

import Link from "next/link";
import { DeadlineAlertItem } from "@/lib/deadlines";
import { Calendar, AlertTriangle, ArrowRight, Clock } from "lucide-react";

interface DeadlineAlertsProps {
  deadlinesInfo: {
    upcomingAlerts: DeadlineAlertItem[];
    overdueAlerts: DeadlineAlertItem[];
    urgentCount: number;
  };
}

export default function DeadlineAlerts({ deadlinesInfo }: DeadlineAlertsProps) {
  const { upcomingAlerts, overdueAlerts } = deadlinesInfo;
  const allAlerts = [...overdueAlerts, ...upcomingAlerts];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          <span>Upcoming Deadlines (Next 3 Days)</span>
        </h3>

        {allAlerts.length > 0 && (
          <span className="px-2.5 py-0.5 text-xs font-extrabold rounded-full bg-rose-100 text-rose-700 border border-rose-200">
            {allAlerts.length} Action Needed
          </span>
        )}
      </div>

      {allAlerts.length === 0 ? (
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
          <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-600 text-xs font-semibold">
            No deadlines approaching in the next 3 days!
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {allAlerts.map((item) => (
            <div
              key={item.applicationId}
              className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition ${
                item.isOverdue
                  ? "bg-rose-50/80 border-rose-200"
                  : item.daysLeft === 0
                  ? "bg-amber-50/80 border-amber-200"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm truncate">
                    {item.company}
                  </span>
                  <span className="text-xs text-slate-500 font-medium truncate">
                    ({item.role})
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs mt-0.5">
                  <span className="text-slate-500">Stage: <strong>{item.stage}</strong></span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 font-medium">
                    {new Date(item.deadline).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    item.isOverdue
                      ? "bg-rose-600 text-white border-rose-600 animate-pulse"
                      : item.daysLeft === 0
                      ? "bg-amber-500 text-white border-amber-500"
                      : "bg-indigo-100 text-indigo-800 border-indigo-200"
                  }`}
                >
                  {item.label}
                </span>

                <Link
                  href={`/dashboard/applications/${item.applicationId}`}
                  className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

