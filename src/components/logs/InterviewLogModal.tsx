"use client";

import { useState, useEffect } from "react";
import { InterviewLogItem } from "@/types";
import { DifficultyLevel, RoundOutcome } from "@/models/InterviewLog";
import { X, AlertCircle } from "lucide-react";

interface InterviewLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (logData: Partial<InterviewLogItem>) => Promise<void>;
  initialData?: InterviewLogItem | null;
}

const DIFFICULTIES: DifficultyLevel[] = ["Easy", "Medium", "Hard"];
const OUTCOMES: RoundOutcome[] = ["Pending", "Cleared", "Rejected"];

export default function InterviewLogModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: InterviewLogModalProps) {
  const [formData, setFormData] = useState({
    roundName: "",
    date: new Date().toISOString().split("T")[0],
    questionsAsked: "",
    difficulty: "Medium" as DifficultyLevel,
    outcome: "Pending" as RoundOutcome,
    lessonsLearned: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        roundName: initialData.roundName || "",
        date: initialData.date
          ? new Date(initialData.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        questionsAsked: Array.isArray(initialData.questionsAsked)
          ? initialData.questionsAsked.join("\n")
          : "",
        difficulty: initialData.difficulty || "Medium",
        outcome: initialData.outcome || "Pending",
        lessonsLearned: initialData.lessonsLearned || "",
      });
    } else {
      setFormData({
        roundName: "",
        date: new Date().toISOString().split("T")[0],
        questionsAsked: "",
        difficulty: "Medium",
        outcome: "Pending",
        lessonsLearned: "",
      });
    }
    setError("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.roundName.trim()) {
      setError("Round name is required.");
      return;
    }

    setLoading(true);

    try {
      await onSave({
        roundName: formData.roundName.trim(),
        date: formData.date ? new Date(formData.date) : new Date(),
        questionsAsked: formData.questionsAsked
          .split("\n")
          .map((q) => q.trim())
          .filter(Boolean),
        difficulty: formData.difficulty,
        outcome: formData.outcome,
        lessonsLearned: formData.lessonsLearned.trim(),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save interview log.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <h3 className="text-xl font-bold text-slate-800">
            {initialData ? "Edit Interview Round" : "Log Interview Round"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Round Name *
            </label>
            <input
              type="text"
              required
              value={formData.roundName}
              onChange={(e) =>
                setFormData({ ...formData, roundName: e.target.value })
              }
              placeholder="e.g. Round 1 - Technical DSA, HR Round, OA Test"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    difficulty: e.target.value as DifficultyLevel,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Outcome
              </label>
              <select
                value={formData.outcome}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    outcome: e.target.value as RoundOutcome,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {OUTCOMES.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Questions Asked (One question per line)
            </label>
            <textarea
              rows={4}
              value={formData.questionsAsked}
              onChange={(e) =>
                setFormData({ ...formData, questionsAsked: e.target.value })
              }
              placeholder="e.g.&#10;Implement LRU Cache using Doubly Linked List&#10;Explain SQL Indexing vs B-Trees&#10;System design for URL Shortener"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Lessons Learned / Key Takeaways
            </label>
            <textarea
              rows={3}
              value={formData.lessonsLearned}
              onChange={(e) =>
                setFormData({ ...formData, lessonsLearned: e.target.value })
              }
              placeholder="e.g. Need to revise Graph BFS edge cases; clear communication during problem solving was appreciated."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50 transition"
            >
              {loading
                ? "Saving..."
                : initialData
                ? "Update Log"
                : "Save Interview Log"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

