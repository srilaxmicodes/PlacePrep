"use client";

import { useState, useEffect, useCallback } from "react";
import { ApplicationData } from "@/types";
import { ApplicationStage } from "@/models/Application";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import ApplicationModal from "@/components/kanban/ApplicationModal";
import DeleteConfirmModal from "@/components/kanban/DeleteConfirmModal";
import { Search, Plus, Kanban as KanbanIcon, RefreshCw, AlertCircle, Sparkles } from "lucide-react";

const STAGES: (ApplicationStage | "All")[] = [
  "All",
  "Wishlist",
  "Applied",
  "OA/Test",
  "Interview",
  "Offer",
  "Rejected",
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState<ApplicationStage | "All">("All");

  // Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<ApplicationData | null>(null);
  const [defaultStage, setDefaultStage] = useState<ApplicationStage>("Wishlist");

  // Delete modal controls
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingApp, setDeletingApp] = useState<ApplicationData | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch applications from API
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (selectedStage !== "All") params.set("stage", selectedStage);

      const res = await fetch(`/api/applications?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load applications.");
      }

      setApplications(data.applications || []);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedStage]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Handle Save (Create or Update)
  const handleSaveApplication = async (appData: Partial<ApplicationData>) => {
    if (editingApp) {
      // Update existing
      const res = await fetch(`/api/applications/${editingApp._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update application.");

      setApplications((prev) =>
        prev.map((a) => (a._id === editingApp._id ? data.application : a))
      );
    } else {
      // Create new
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create application.");

      setApplications((prev) => [data.application, ...prev]);
    }
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = async () => {
    if (!deletingApp) return;

    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/applications/${deletingApp._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete application.");

      setApplications((prev) => prev.filter((a) => a._id !== deletingApp._id));
      setIsDeleteModalOpen(false);
      setDeletingApp(null);
    } catch (err: any) {
      alert(err.message || "Could not delete application.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleOpenAddModal = (stage: ApplicationStage = "Wishlist") => {
    setEditingApp(null);
    setDefaultStage(stage);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (app: ApplicationData) => {
    setEditingApp(app);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (app: ApplicationData) => {
    setDeletingApp(app);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <KanbanIcon className="w-6 h-6 text-indigo-600" />
            <span>Application Tracker</span>
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Manage your job applications across recruitment stages with drag-and-drop.
          </p>
        </div>

        <button
          onClick={() => handleOpenAddModal("Wishlist")}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-medium text-sm rounded-xl hover:bg-indigo-700 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Application</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by company or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Stage Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {STAGES.map((stg) => (
            <button
              key={stg}
              onClick={() => setSelectedStage(stg)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedStage === stg
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {stg}
            </button>
          ))}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchApplications}
            className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-lg hover:bg-red-200"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-slate-100 rounded-2xl p-4 h-64 animate-pulse border border-slate-200"
            />
          ))}
        </div>
      )}

      {/* Main Kanban Board View */}
      {!loading && !error && (
        <>
          {applications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                {searchQuery || selectedStage !== "All"
                  ? "No matching applications"
                  : "No applications added yet"}
              </h3>
              <p className="text-slate-500 text-sm mt-1 mb-6">
                {searchQuery || selectedStage !== "All"
                  ? "Try adjusting your search terms or stage filters."
                  : "Start tracking your campus applications by creating your first application card."}
              </p>
              <button
                onClick={() => handleOpenAddModal("Wishlist")}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
              >
                Add Your First Application
              </button>
            </div>
          ) : (
            <KanbanBoard
              applications={applications}
              onApplicationsChange={setApplications}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
              onAddClick={handleOpenAddModal}
            />
          )}
        </>
      )}

      {/* Add / Edit Form Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveApplication}
        initialData={editingApp}
        defaultStage={defaultStage}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        application={deletingApp}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
