"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ApplicationData, PrepChecklistItem, InterviewLogItem } from "@/types";
import PrepChecklistView from "@/components/planner/PrepChecklistView";
import InterviewLogView from "@/components/logs/InterviewLogView";
import {
  ArrowLeft,
  Building2,
  Calendar,
  ExternalLink,
  BookOpen,
  MessageSquareText,
  Layout,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  const [activeTab, setActiveTab] = useState<"overview" | "checklist" | "logs">("checklist");
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [checklist, setChecklist] = useState<PrepChecklistItem[]>([]);
  const [logs, setLogs] = useState<InterviewLogItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplicationDetails = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch application details
      const appRes = await fetch(`/api/applications`);
      const appData = await appRes.json();
      if (!appRes.ok) throw new Error(appData.error || "Failed to load application.");

      const currentApp = (appData.applications || []).find(
        (a: ApplicationData) => a._id === applicationId
      );

      if (!currentApp) {
        throw new Error("Application not found or unauthorized.");
      }

      setApplication(currentApp);

      // Fetch prep checklist
      const chkRes = await fetch(`/api/applications/${applicationId}/checklist`);
      const chkData = await chkRes.json();
      if (chkRes.ok) setChecklist(chkData.checklist || []);

      // Fetch interview logs
      const logRes = await fetch(`/api/applications/${applicationId}/logs`);
      const logData = await logRes.json();
      if (logRes.ok) setLogs(logData.logs || []);
    } catch (err: any) {
      setError(err.message || "Failed to load details.");
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    fetchApplicationDetails();
  }, [fetchApplicationDetails]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="h-8 bg-slate-200 rounded-lg w-48 animate-pulse" />
        <div className="bg-slate-100 rounded-2xl h-48 animate-pulse" />
        <div className="bg-slate-100 rounded-2xl h-64 animate-pulse" />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-center">
        <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
        <h3 className="font-bold text-base">Error Loading Application</h3>
        <p className="text-sm mt-1 mb-4">{error || "Application not found."}</p>
        <Link
          href="/dashboard/applications"
          className="px-4 py-2 bg-red-600 text-white font-semibold text-xs rounded-xl hover:bg-red-700 transition"
        >
          Back to Kanban Tracker
        </Link>
      </div>
    );
  }

  const formattedDeadline = application.deadline
    ? new Date(application.deadline).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back Link */}
      <Link
        href="/dashboard/applications"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Application Tracker</span>
      </Link>

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {application.company}
            </h1>
            <span className="px-3 py-0.5 text-xs font-extrabold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {application.stage}
            </span>
          </div>

          <p className="text-slate-600 text-sm font-medium">
            {application.role} {application.package ? `• ${application.package}` : ""}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {formattedDeadline && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Deadline: {formattedDeadline}</span>
            </div>
          )}

          {application.jobUrl && (
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl font-semibold transition"
            >
              <span>View Job Posting</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab("checklist")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "checklist"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Prep Checklist ({checklist.filter((i) => i.completed).length}/{checklist.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("logs")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "logs"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <MessageSquareText className="w-4 h-4" />
          <span>Interview Log ({logs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "overview"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>Overview</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === "checklist" && (
          <PrepChecklistView
            applicationId={applicationId}
            initialChecklist={checklist}
            onChecklistChange={fetchApplicationDetails}
          />
        )}

        {activeTab === "logs" && (
          <InterviewLogView
            applicationId={applicationId}
            initialLogs={logs}
            onLogsChange={fetchApplicationDetails}
          />
        )}

        {activeTab === "overview" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-lg">Application Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs font-semibold text-slate-400 block uppercase">Company</span>
                <span className="font-medium text-slate-800">{application.company}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 block uppercase">Role</span>
                <span className="font-medium text-slate-800">{application.role}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 block uppercase">Package (CTC)</span>
                <span className="font-medium text-slate-800">{application.package || "Not specified"}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 block uppercase">Current Stage</span>
                <span className="font-medium text-slate-800">{application.stage}</span>
              </div>
            </div>

            {application.notes && (
              <div className="pt-4 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-400 block uppercase mb-1">
                  Notes / Referral Information
                </span>
                <p className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {application.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

