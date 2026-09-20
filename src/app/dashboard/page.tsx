import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Kanban, BookOpen, MessageSquareText, Sparkles, UserCheck } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-100 text-xs font-medium mb-3">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Authenticated Session Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back, {session?.user?.name || "Student"}!
            </h1>
            <p className="text-indigo-100 text-sm mt-1">
              Logged in as <span className="font-semibold">{session?.user?.email}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Quick Access Modules */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link
            href="/dashboard/applications"
            className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-400 hover:shadow-md transition"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Kanban className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition">
              Application Tracker
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              Kanban board for tracking job stages (Wishlist, Applied, OA, Interview, Offer).
            </p>
          </Link>

          <Link
            href="/dashboard/planner"
            className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-400 hover:shadow-md transition"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition">
              Prep Planner
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              Company checklists for DSA, Aptitude, Core CS, and HR topics.
            </p>
          </Link>

          <Link
            href="/dashboard/logs"
            className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-400 hover:shadow-md transition"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <MessageSquareText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition">
              Interview Logs
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              Log interview round questions, difficulty levels, and key learnings.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

