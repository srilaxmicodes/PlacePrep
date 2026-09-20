"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ApplicationData } from "@/types";
import { ApplicationStage } from "@/models/Application";
import ApplicationCard from "./ApplicationCard";
import { Plus } from "lucide-react";

interface KanbanColumnProps {
  stage: ApplicationStage;
  applications: ApplicationData[];
  onAddClick: (stage: ApplicationStage) => void;
  onEdit: (app: ApplicationData) => void;
  onDelete: (app: ApplicationData) => void;
}

const STAGE_CONFIG: Record<
  ApplicationStage,
  { label: string; bg: string; text: string; border: string }
> = {
  Wishlist: {
    label: "Wishlist",
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-300",
  },
  Applied: {
    label: "Applied",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  "OA/Test": {
    label: "OA / Test",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  Interview: {
    label: "Interview",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  Offer: {
    label: "Offer",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  Rejected: {
    label: "Rejected",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
  },
};

export default function KanbanColumn({
  stage,
  applications,
  onAddClick,
  onEdit,
  onDelete,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
    data: {
      type: "Column",
      stage,
    },
  });

  const config = STAGE_CONFIG[stage];
  const appIds = applications.map((a) => a._id);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-2xl bg-slate-100/70 border border-slate-200/80 p-3 min-w-[280px] w-full max-w-sm flex-1 transition ${
        isOver ? "ring-2 ring-indigo-500 bg-indigo-50/40" : ""
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold border ${config.bg} ${config.text} ${config.border}`}
          >
            {config.label}
          </span>
          <span className="text-xs font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
            {applications.length}
          </span>
        </div>

        <button
          onClick={() => onAddClick(stage)}
          className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition"
          title={`Add to ${config.label}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Column Content - Cards List */}
      <div className="flex-1 min-h-[150px] overflow-y-auto">
        <SortableContext items={appIds} strategy={verticalListSortingStrategy}>
          {applications.map((app) => (
            <ApplicationCard
              key={app._id}
              application={app}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>

        {/* Empty state for column */}
        {applications.length === 0 && (
          <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400 font-medium my-2">
            No applications
          </div>
        )}
      </div>
    </div>
  );
}

