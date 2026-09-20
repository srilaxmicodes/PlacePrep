"use client";

import { useState, useEffect } from "react";
import { ApplicationData, InterviewLogItem } from "@/types";
import InterviewLogView from "@/components/logs/InterviewLogView";
import { MessageSquareText, Building2 } from "lucide-react";

export default function LogsPage() {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string>("");
  const [logs, setLogs] = useState<InterviewLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);

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
      } catch (err) {
        console.error("Applications fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadApplications();
  }, []);

  useEffect(() => {
    if (!selectedAppId) return;

    async function loadLogs() {
      setLogsLoading(true);
      try {
        const res = await fetch(`/api/applications/${selectedAppId}/logs`);
        const data = await res.json();
        if (res.ok) {
          setLogs(data.logs || []);
        }
      } catch (err) {
        console.error("Logs fetch error:", err);
      } finally {
        setLogsLoading(false);
      }
    }

    loadLogs();
  }, [selectedAppId]);

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
          <MessageSquareText className="w-6 h-6 text-indigo-600" />
          <span>Interview Round Logs</span>
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Record questions, difficulty, outcomes, and lessons learned after each interview round.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800">No Applications Found</h3>
          <p className="text-slate-500 text-sm mt-1 mb-4">
            Add an application in the tracker first to log interview rounds.
          </p>
        </div>
      ) : (
        <>
          {/* Select Application */}
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

          {/* Interview Log View */}
          {selectedAppId && !logsLoading && (
            <InterviewLogView
              applicationId={selectedAppId}
              initialLogs={logs}
            />
          )}
        </>
      )}
    </div>
  );
}

