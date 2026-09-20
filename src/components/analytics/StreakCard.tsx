"use client";

import { StreakResult } from "@/lib/streak";
import { Flame, Trophy, Calendar, Sparkles } from "lucide-react";

interface StreakCardProps {
  streaks: StreakResult;
}

export default function StreakCard({ streaks }: StreakCardProps) {
  return (
    <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-6 rounded-2xl shadow-md space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-6 h-6 text-yellow-200 animate-bounce" />
          <h3 className="font-bold text-lg tracking-tight">Prep Streak Tracker</h3>
        </div>
        <span className="bg-white/20 backdrop-blur-xs text-xs font-semibold px-3 py-1 rounded-full">
          Daily Consistency
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Current Streak */}
        <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/20">
          <div className="text-amber-200 text-xs font-semibold uppercase tracking-wider mb-1">
            Current Streak
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black">{streaks.currentStreak}</span>
            <span className="text-sm font-medium opacity-90">days 🔥</span>
          </div>
        </div>

        {/* Longest Streak */}
        <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/20">
          <div className="text-amber-200 text-xs font-semibold uppercase tracking-wider mb-1">
            Longest Streak
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black">{streaks.longestStreak}</span>
            <span className="text-sm font-medium opacity-90">days 🏆</span>
          </div>
        </div>
      </div>

      {/* 14-Day Activity Summary */}
      <div className="flex items-center justify-between text-xs pt-2 border-t border-white/20">
        <span className="flex items-center gap-1.5 opacity-90">
          <Calendar className="w-4 h-4 text-yellow-200" />
          Last 14 Days Activity:
        </span>
        <span className="font-bold text-yellow-200 bg-white/20 px-2.5 py-0.5 rounded-full">
          {streaks.activeDaysInLast14} / 14 Days Active
        </span>
      </div>
    </div>
  );
}

