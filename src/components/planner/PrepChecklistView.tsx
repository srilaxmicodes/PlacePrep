"use client";

import { useState } from "react";
import { PrepChecklistItem } from "@/types";
import { PrepCategory, PrepPriority } from "@/models/PrepChecklist";
import { CheckCircle2, Circle, Plus, Trash2, Tag, AlertCircle, BarChart3 } from "lucide-react";

interface PrepChecklistViewProps {
  applicationId: string;
  initialChecklist: PrepChecklistItem[];
  onChecklistChange?: () => void;
}

const CATEGORIES: PrepCategory[] = ["DSA", "Core CS", "Aptitude", "HR", "Custom"];

const PRIORITY_COLORS: Record<PrepPriority, string> = {
  High: "bg-red-50 text-red-700 border-red-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Low: "bg-slate-50 text-slate-600 border-slate-200",
};

export default function PrepChecklistView({
  applicationId,
  initialChecklist,
  onChecklistChange,
}: PrepChecklistViewProps) {
  const [checklist, setChecklist] = useState<PrepChecklistItem[]>(initialChecklist);
  const [newTopic, setNewTopic] = useState("");
  const [newCategory, setNewCategory] = useState<PrepCategory>("Custom");
  const [newPriority, setNewPriority] = useState<PrepPriority>("Medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Overall Statistics Calculation
  const totalTopics = checklist.length;
  const completedTopics = checklist.filter((item) => item.completed).length;
  const overallPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // Toggle item completion status
  const handleToggle = async (item: PrepChecklistItem) => {
    const updatedCompleted = !item.completed;

    // Optimistic UI update
    const previous = [...checklist];
    setChecklist((prev) =>
      prev.map((i) =>
        i._id === item._id
          ? {
              ...i,
              completed: updatedCompleted,
              completedAt: updatedCompleted ? new Date() : undefined,
            }
          : i
      )
    );

    try {
      const res = await fetch(`/api/checklists/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: updatedCompleted }),
      });

      if (!res.ok) throw new Error("Failed to update status.");
      if (onChecklistChange) onChecklistChange();
    } catch (err) {
      // Rollback on failure
      setChecklist(previous);
      setError("Could not update topic status. Changes reverted.");
    }
  };

  // Add new custom topic
  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/applications/${applicationId}/checklist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: newTopic.trim(),
          category: newCategory,
          priority: newPriority,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add topic.");

      setChecklist((prev) => [...prev, data.item]);
      setNewTopic("");
      if (onChecklistChange) onChecklistChange();
    } catch (err: any) {
      setError(err.message || "Failed to add topic.");
    } finally {
      setLoading(false);
    }
  };

  // Delete topic
  const handleDelete = async (itemId: string) => {
    const previous = [...checklist];
    setChecklist((prev) => prev.filter((i) => i._id !== itemId));

    try {
      const res = await fetch(`/api/checklists/${itemId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete topic.");
      if (onChecklistChange) onChecklistChange();
    } catch (err) {
      setChecklist(previous);
      setError("Failed to delete topic.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800">Overall Preparation Progress</h3>
          </div>
          <span className="text-lg font-extrabold text-indigo-600">
            {overallPercent}%
          </span>
        </div>

        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full transition-all duration-500 rounded-full"
            style={{ width: `${overallPercent}%` }}
          />
        </div>

        <p className="text-xs text-slate-500 mt-2">
          {completedTopics} of {totalTopics} required prep topics completed.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Categories Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {CATEGORIES.map((cat) => {
          const categoryItems = checklist.filter((item) => item.category === cat);
          if (categoryItems.length === 0) return null;

          const catCompleted = categoryItems.filter((i) => i.completed).length;
          const catPercent = Math.round((catCompleted / categoryItems.length) * 100);

          return (
            <div
              key={cat}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Category Header & Progress */}
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-800 text-base">{cat}</h4>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                    {catCompleted}/{categoryItems.length} ({catPercent}%)
                  </span>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${catPercent}%` }}
                  />
                </div>

                {/* Topics List */}
                <div className="space-y-2">
                  {categoryItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition group"
                    >
                      <button
                        onClick={() => handleToggle(item)}
                        className="flex items-center gap-3 text-left flex-1 min-w-0"
                      >
                        {item.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300 group-hover:text-slate-400 shrink-0" />
                        )}
                        <span
                          className={`text-sm ${
                            item.completed
                              ? "line-through text-slate-400"
                              : "text-slate-800 font-medium"
                          } truncate`}
                        >
                          {item.topic}
                        </span>
                      </button>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            PRIORITY_COLORS[item.priority]
                          }`}
                        >
                          {item.priority}
                        </span>

                        <button
                          onClick={() => handleDelete(item._id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 rounded transition"
                          title="Delete topic"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Topic Form */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
        <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-indigo-600" />
          <span>Add Custom Topic</span>
        </h4>

        <form onSubmit={handleAddTopic} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            placeholder="e.g. System Design Basics, Trie Data Structure..."
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            className="flex-1 px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
          />

          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as PrepCategory)}
            className="px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as PrepPriority)}
            className="px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition shrink-0"
          >
            {loading ? "Adding..." : "Add Topic"}
          </button>
        </form>
      </div>
    </div>
  );
}

