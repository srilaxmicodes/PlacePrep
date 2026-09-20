"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { ApplicationData } from "@/types";
import { ApplicationStage } from "@/models/Application";
import KanbanColumn from "./KanbanColumn";
import ApplicationCard from "./ApplicationCard";
import { AlertCircle } from "lucide-react";

interface KanbanBoardProps {
  applications: ApplicationData[];
  onApplicationsChange: (apps: ApplicationData[]) => void;
  onEdit: (app: ApplicationData) => void;
  onDelete: (app: ApplicationData) => void;
  onAddClick: (stage: ApplicationStage) => void;
}

const STAGES: ApplicationStage[] = [
  "Wishlist",
  "Applied",
  "OA/Test",
  "Interview",
  "Offer",
  "Rejected",
];

export default function KanbanBoard({
  applications,
  onApplicationsChange,
  onEdit,
  onDelete,
  onAddClick,
}: KanbanBoardProps) {
  const [activeApp, setActiveApp] = useState<ApplicationData | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Requires dragging 5px before drag triggers, allowing normal clicks
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;
    if (activeData?.type === "Application") {
      setActiveApp(activeData.application);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeItem = applications.find((a) => a._id === activeId);
    if (!activeItem) return;

    // Check if over is a Column or an Application card in another column
    const isOverColumn = STAGES.includes(overId as ApplicationStage);
    const overItem = applications.find((a) => a._id === overId);

    const targetStage: ApplicationStage | null = isOverColumn
      ? (overId as ApplicationStage)
      : overItem
      ? overItem.stage
      : null;

    if (targetStage && activeItem.stage !== targetStage) {
      // Move card to new stage locally for smooth visual feedback
      const updated = applications.map((app) =>
        app._id === activeId ? { ...app, stage: targetStage } : app
      );
      onApplicationsChange(updated);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveApp(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeItem = applications.find((a) => a._id === activeId);
    if (!activeItem) return;

    const isOverColumn = STAGES.includes(overId as ApplicationStage);
    const overItem = applications.find((a) => a._id === overId);

    const destinationStage: ApplicationStage = isOverColumn
      ? (overId as ApplicationStage)
      : overItem
      ? overItem.stage
      : activeItem.stage;

    // Reorder items if in same column
    if (overItem && activeItem.stage === destinationStage) {
      const oldIndex = applications.findIndex((a) => a._id === activeId);
      const newIndex = applications.findIndex((a) => a._id === overId);
      if (oldIndex !== newIndex) {
        const reordered = arrayMove(applications, oldIndex, newIndex);
        onApplicationsChange(reordered);
      }
    }

    // Persist stage update to database with Optimistic Rollback logic
    const previousApplications = [...applications];

    try {
      setErrorNotice(null);
      const res = await fetch(`/api/applications/${activeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: destinationStage }),
      });

      if (!res.ok) {
        throw new Error("Failed to update application stage on server.");
      }
    } catch (err: any) {
      console.error("Drag & drop save error:", err);
      // Rollback optimistic state change
      onApplicationsChange(previousApplications);
      setErrorNotice(
        "Could not save stage change to server. Changes were rolled back."
      );
    }
  };

  return (
    <div className="space-y-4">
      {errorNotice && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{errorNotice}</span>
          </div>
          <button
            onClick={() => setErrorNotice(null)}
            className="text-xs font-semibold hover:underline text-amber-900"
          >
            Dismiss
          </button>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2 items-start scrollbar-thin">
          {STAGES.map((stage) => {
            const stageApps = applications.filter((app) => app.stage === stage);
            return (
              <KanbanColumn
                key={stage}
                stage={stage}
                applications={stageApps}
                onAddClick={onAddClick}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            );
          })}
        </div>

        <DragOverlay>
          {activeApp ? (
            <ApplicationCard
              application={activeApp}
              onEdit={() => {}}
              onDelete={() => {}}
              isOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

