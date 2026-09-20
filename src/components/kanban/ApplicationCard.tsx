"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ApplicationData } from "@/types";
import { ApplicationStage } from "@/models/Application";
import { ExternalLink, Calendar, Edit2, Trash2, GripVertical, FileText } from "lucide-react";

interface ApplicationCardProps {
  application: ApplicationData;
  onEdit: (app: ApplicationData) => void;
  onDelete: (app: ApplicationData) => void;
  isOverlay?: boolean;
}

export default function ApplicationCard({
  application,
  onEdit,
  onDelete,
  isOverlay = false,
}: ApplicationCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: application._id,
    data: {
      type: "Application",
      application,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-indigo-50/50 border-2 border-dashed border-indigo-300 rounded-xl h-28 opacity-60 my-2"
      />
    );
  }

  // Formatting deadline date
  const formattedDeadline = application.deadline
    ? new Date(application.deadline).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition relative my-2 ${
        isOverlay ? "shadow-xl border-indigo-500 ring-2 ring-indigo-400 rotate-1 cursor-grabbing" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <button
              {...attributes}
              {...listeners}
              className="text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing p-0.5 rounded touch-none"
              title="Drag card"
            >
              <GripVertical className="w-4 h-4" />
            </button>
            <h4 className="font-bold text-slate-800 text-base truncate">
              {application.company}
            </h4>
          </div>
          <p className="text-sm text-slate-600 font-medium pl-6 truncate">
            {application.role}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(application)}
            className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition"
            title="Edit Application"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(application)}
            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
            title="Delete Application"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Details Row: Package & Deadline */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
          {application.package || "N/A"}
        </div>

        <div className="flex items-center gap-2">
          {formattedDeadline && (
            <span className="flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{formattedDeadline}</span>
            </span>
          )}

          {application.jobUrl && (
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 p-0.5"
              title="Open Job Link"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Notes Indicator */}
      {application.notes && (
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100 line-clamp-1">
          <FileText className="w-3 h-3 shrink-0 text-slate-400" />
          <span className="truncate">{application.notes}</span>
        </div>
      )}
    </div>
  );
}

