import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-4xl font-bold text-indigo-600 mb-4">PlacePrep</h1>
        <p className="text-slate-600 text-lg mb-6">
          Your all-in-one placement tracker and prep planner. Organize applications, track prep progress, log interview questions, and measure company readiness.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-6 py-2.5 bg-slate-100 text-slate-800 rounded-lg font-medium hover:bg-slate-200 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}

