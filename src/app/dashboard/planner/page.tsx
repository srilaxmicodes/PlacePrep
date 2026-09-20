"use client";

import { useState, useEffect } from "react";
import { ApplicationData, PrepChecklistItem } from "@/types";
import PrepChecklistView from "@/components/planner/PrepChecklistView";
import { BookOpen, Building2, AlertCircle } from "lucide-react";

export default function PlannerPage() {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string>("");
  const [checklist, setChecklist] = useState<PrepChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checklistLoading, setChecklistLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadApplications() {
      try {
        const res = await fetch("/api/applications");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load applications.");

        const apps = data.applications || [];
        setApplications(apps);
        if (apps.length > 0) {
          setSelectedAppId(apps[0]._id);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load applications.");
      } finally {
        setLoading(false);
      }
    }
    loadApplications();
  }, []);

  useEffect(() => {
    if (!selectedAppId) return;

    async function loadChecklist() {
      setChecklistLoading(true);
      try {
        const res = await fetch(`/api/applications/${selectedAppId}/checklist`);
        const data = await res.json();
        if (res.ok) {
          setChecklist(data.checklist || []);
        }
      } catch (err) {
        console.error("Checklist fetch error:", err);
      } finally {
        setChecklistLoading(false);
      }
    }

    loadChecklist();
  }, [selectedAppId]);

  const selectedApp = applications.find((a) => a._id === selectedAppId);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-200 rounded-lg w-48 animate-pulse" />
        <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          <span>Company Prep Planner</span>
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Track preparation progress per company across DSA, Core CS, Aptitude, and HR topics.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800">No Applications Found</h3>
          <p className="text-slate-500 text-sm mt-1 mb-4">
            Add an application in the tracker first to view or generate its prep checklist.
          </p>
        </div>
      ) : (
        <>
          {/* Application Selector */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider shrink-0">
              Select Company:
            </span>
            <select
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none flex-1 max-w-md"
            >
              {applications.map((app) => (
                <option key={app._id} value={app._id}>
                  {app.company} — {app.role} ({app.stage})
                </option>
              ))}
            </select>
          </div>

          {/* Checklist View */}
          {selectedAppId && !checklistLoading && (
            <PrepChecklistView
              applicationId={selectedAppId}
              initialChecklist={checklist}
            />
          )}
        </>
      )}
    </div>
  );
}

