"use client";

import { useState } from "react";

type ScanResult = {
  detectedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  matchScore: number;
};

export default function ResumeScannerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleScan = async () => {
    if (!file) {
      setError("Please choose a PDF resume first.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);

      const res = await fetch("/api/resume/scan", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Scan failed.");
      setResult(json);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Resume Scanner</h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload your resume (PDF, max 2 MB) and optionally paste a job description to see skill gaps.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <div>
          <label htmlFor="resume" className="block text-sm font-medium text-slate-700 mb-1">
            Resume (PDF)
          </label>
          <input
            id="resume"
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-slate-600"
          />
        </div>

        <div>
          <label htmlFor="jd" className="block text-sm font-medium text-slate-700 mb-1">
            Job description (optional)
          </label>
          <textarea
            id="jd"
            rows={5}
            maxLength={4000}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Paste the job description here..."
          />
        </div>

        <button
          onClick={handleScan}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Scanning..." : "Scan Resume"}
        </button>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>
        )}
      </div>

      {result && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-800">Results</h2>
            <span className="text-2xl font-bold text-indigo-600">{result.matchScore}/100</span>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Skills found</h3>
            <div className="flex flex-wrap gap-2">
              {result.detectedSkills.map((s) => (
                <span key={s} className="px-2.5 py-1 text-xs bg-emerald-50 text-emerald-700 rounded-full">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Missing skills</h3>
            <div className="flex flex-wrap gap-2">
              {result.missingSkills.map((s) => (
                <span key={s} className="px-2.5 py-1 text-xs bg-amber-50 text-amber-700 rounded-full">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Suggestions</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
              {result.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}