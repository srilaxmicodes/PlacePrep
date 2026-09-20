"use client";

import { ApplicationData } from "@/types";
import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  application: ApplicationData | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  application,
  onClose,
  onConfirm,
  loading,
}: DeleteConfirmModalProps) {
  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 text-red-600 mb-3">
          <div className="p-2 bg-red-100 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Delete Application?
          </h3>
        </div>

        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          Are you sure you want to delete{" "}
          <strong className="text-slate-900">{application.company}</strong> (
          {application.role})? This will also permanently remove associated prep
          checklists and interview logs.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 transition"
          >
            {loading ? "Deleting..." : "Delete Permanently"}
          </button>
        </div>
      </div>
    </div>
  );
}

