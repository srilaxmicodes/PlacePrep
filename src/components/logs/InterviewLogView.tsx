"use client";

import { useState } from "react";
import { InterviewLogItem } from "@/types";
import { RoundOutcome, DifficultyLevel } from "@/models/InterviewLog";
import InterviewLogModal from "./InterviewLogModal";
import { Plus, Calendar, Edit2, Trash2, HelpCircle, Lightbulb, CheckCircle2, Clock, XCircle } from "lucide-react";

interface InterviewLogViewProps {
  applicationId: string;
  initialLogs: InterviewLogItem[];
  onLogsChange?: () => void;
}

const OUTCOME_CONFIG: Record<
  RoundOutcome,
  { label: string; bg: string; text: string; border: string; icon: any }
> = {
  Cleared: {
    label: "Cleared",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: CheckCircle2,
  },
  Pending: {
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    icon: Clock,
  },
  Rejected: {
    label: "Rejected",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    icon: XCircle,
  },
};

const DIFFICULTY_CONFIG: Record<DifficultyLevel, string> = {
  Easy: "bg-blue-50 text-blue-700 border-blue-200",
  Medium: "bg-purple-50 text-purple-700 border-purple-200",
  Hard: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function InterviewLogView({
  applicationId,
  initialLogs,
  onLogsChange,
}: InterviewLogViewProps) {
  const [logs, setLogs] = useState<InterviewLogItem[]>(initialLogs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<InterviewLogItem | null>(null);

  const handleSaveLog = async (logData: Partial<InterviewLogItem>) => {
    if (editingLog) {
      // Update
      const res = await fetch(`/api/logs/${editingLog._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update log.");

      setLogs((prev) =>
        prev.map((l) => (l._id === editingLog._id ? data.log : l))
      );
    } else {
      // Create
      const res = await fetch(`/api/applications/${applicationId}/logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save log.");

      setLogs((prev) => [data.log, ...prev]);
    }

    if (onLogsChange) onLogsChange();
  };

  const handleDeleteLog = async (logId: string) => {
    if (!confirm("Are you sure you want to delete this interview log?")) return;

    try {
      const res = await fetch(`/api/logs/${logId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete log.");

      setLogs((prev) => prev.filter((l) => l._id !== logId));
      if (onLogsChange) onLogsChange();
    } catch (err) {
      alert("Could not delete interview log.");
    }
  };

  const handleOpenAdd = () => {
    setEditingLog(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (log: InterviewLogItem) => {
    setEditingLog(log);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Interview Round Logs</h3>
          <p className="text-slate-500 text-xs mt-0.5">
            Record questions asked, difficulty level, and key learnings per round.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white font-medium text-xs rounded-xl hover:bg-indigo-700 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Log Interview Round</span>
        </button>
      </div>

      {/* Empty State */}
      {logs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center my-4">
          <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="font-bold text-slate-700">No Interview Rounds Logged Yet</h4>
          <p className="text-slate-500 text-xs mt-1 mb-4">
            Track your progress across technical, OA, and HR rounds.
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-1.5 bg-indigo-50 text-indigo-600 font-semibold text-xs rounded-lg hover:bg-indigo-100 transition"
          >
            Add First Interview Round Log
          </button>
        </div>
      ) : (
        /* Logs Timeline */
        <div className="space-y-4">
          {logs.map((log) => {
            const outcomeCfg = OUTCOME_CONFIG[log.outcome];
            const OutcomeIcon = outcomeCfg.icon;

            const formattedDate = new Date(log.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={log._id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition"
              >
                {/* Round Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-900 text-base">
                        {log.roundName}
                      </h4>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full border ${outcomeCfg.bg} ${outcomeCfg.text} ${outcomeCfg.border}`}
                      >
                        <OutcomeIcon className="w-3 h-3" />
                        <span>{outcomeCfg.label}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formattedDate}</span>
                      </span>

                      <span
                        className={`font-semibold px-2 py-0.5 rounded border text-[10px] ${
                          DIFFICULTY_CONFIG[log.difficulty]
                        }`}
                      >
                        {log.difficulty} Difficulty
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(log)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition"
                      title="Edit Log"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteLog(log._id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                      title="Delete Log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Questions Asked */}
                {log.questionsAsked && log.questionsAsked.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <h5 className="text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Questions Asked
                    </h5>
                    <ul className="space-y-1">
                      {log.questionsAsked.map((q, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-slate-600 flex items-start gap-2 bg-slate-50 p-2 rounded-lg"
                        >
                          <span className="text-indigo-500 font-bold shrink-0">
                            •
                          </span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Lessons Learned */}
                {log.lessonsLearned && (
                  <div className="mt-3 p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-800">
                        Lessons Learned:{" "}
                      </span>
                      <span>{log.lessonsLearned}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <InterviewLogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLog}
        initialData={editingLog}
      />
    </div>
  );
}

