"use client";

import { useState, useEffect } from "react";
import { ApplicationData } from "@/types";
import { ApplicationStage } from "@/models/Application";
import { X, AlertCircle } from "lucide-react";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appData: Partial<ApplicationData>) => Promise<void>;
  initialData?: ApplicationData | null;
  defaultStage?: ApplicationStage;
}

const STAGES: ApplicationStage[] = [
  "Wishlist",
  "Applied",
  "OA/Test",
  "Interview",
  "Offer",
  "Rejected",
];

export default function ApplicationModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultStage = "Wishlist",
}: ApplicationModalProps) {
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    package: "",
    stage: defaultStage as ApplicationStage,
    deadline: "",
    jobUrl: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company || "",
        role: initialData.role || "",
        package: initialData.package || "",
        stage: initialData.stage || "Wishlist",
        deadline: initialData.deadline
          ? new Date(initialData.deadline).toISOString().split("T")[0]
          : "",
        jobUrl: initialData.jobUrl || "",
        notes: initialData.notes || "",
      });
    } else {
      setFormData({
        company: "",
        role: "",
        package: "",
        stage: defaultStage,
        deadline: "",
        jobUrl: "",
        notes: "",
      });
    }
    setError("");
  }, [initialData, defaultStage, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.company.trim()) {
      setError("Company name is required.");
      return;
    }

    if (!formData.role.trim()) {
      setError("Role title is required.");
      return;
    }

    setLoading(true);

    try {
      await onSave({
        company: formData.company.trim(),
        role: formData.role.trim(),
        package: formData.package.trim(),
        stage: formData.stage,
        deadline: formData.deadline ? formData.deadline : undefined,
        jobUrl: formData.jobUrl.trim(),
        notes: formData.notes.trim(),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <h3 className="text-xl font-bold text-slate-800">
            {initialData ? "Edit Application" : "Add New Application"}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                placeholder="Google, Microsoft, Amazon..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Role Title *
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                placeholder="Software Engineer, SDE-1..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Package / Salary (CTC)
              </label>
              <input
                type="text"
                value={formData.package}
                onChange={(e) =>
                  setFormData({ ...formData, package: e.target.value })
                }
                placeholder="e.g. ₹18 LPA, $120k"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Stage
              </label>
              <select
                value={formData.stage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stage: e.target.value as ApplicationStage,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {STAGES.map((stg) => (
                  <option key={stg} value={stg}>
                    {stg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Deadline / Next Round Date
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job Posting URL
              </label>
              <input
                type="url"
                value={formData.jobUrl}
                onChange={(e) =>
                  setFormData({ ...formData, jobUrl: e.target.value })
                }
                placeholder="https://..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notes / Referral Info
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Referral code, interviewer names, key details..."
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
                ? "Update Application"
                : "Add Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

