import { ReadinessScoreResult } from "@/types";

export interface ReadinessInput {
  checklistCompleted: number;
  checklistTotal: number;
  roundsCleared: number;
  roundsTotal: number;
  activeDaysInLast14: number;
  applicationStage?: string;
}

/**
 * Calculates the 0-100 Readiness Score for a company application based on a 3-part formula:
 * 1. Checklist Completion (50% Weight): Percentage of required topics marked done.
 * 2. Interview Rounds Cleared (30% Weight): Percentage of interview rounds cleared.
 *    (If stage is 'Offer', defaults to 30% full score; if 0 rounds logged & not Offer, score 0).
 * 3. Recent Prep Activity (20% Weight): Active prep days in last 14 days (capped at 10 active days = 100%).
 */
export function calculateReadinessScore(input: ReadinessInput): ReadinessScoreResult {
  const {
    checklistCompleted,
    checklistTotal,
    roundsCleared,
    roundsTotal,
    activeDaysInLast14,
    applicationStage,
  } = input;

  // 1. Checklist Completion Score (50% Max Weight)
  const checklistRatio = checklistTotal > 0 ? Math.min(1, checklistCompleted / checklistTotal) : 0;
  const checklistCompletionPercent = Math.round(checklistRatio * 50);

  // 2. Interview Rounds Cleared Score (30% Max Weight)
  let roundsRatio = 0;
  if (applicationStage === "Offer") {
    roundsRatio = 1; // Full interview score if offer received
  } else if (roundsTotal > 0) {
    roundsRatio = Math.min(1, roundsCleared / roundsTotal);
  }
  const roundsClearedPercent = Math.round(roundsRatio * 30);

  // 3. Prep Activity in Last 14 Days Score (20% Max Weight)
  // 10 active days in last 14 days is considered 100% active consistency
  const activityRatio = Math.min(1, Math.max(0, activeDaysInLast14) / 10);
  const activityScorePercent = Math.round(activityRatio * 20);

  // Total Score (0 - 100)
  const rawScore = checklistCompletionPercent + roundsClearedPercent + activityScorePercent;
  const score = Math.min(100, Math.max(0, rawScore));

  return {
    score,
    checklistCompletionPercent,
    roundsClearedPercent,
    activityScorePercent,
    breakdown: {
      checklistCompleted,
      checklistTotal,
      roundsCleared,
      roundsTotal,
      activeDaysInLast14,
    },
  };
}

/**
 * Returns a human-readable readiness status label based on the 0-100 score.
 */
export function getReadinessLabel(score: number): {
  label: string;
  color: string;
  badgeBg: string;
} {
  if (score >= 70) {
    return {
      label: "Ready to Ace",
      color: "text-emerald-700",
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  }
  if (score >= 40) {
    return {
      label: "On Track",
      color: "text-amber-700",
      badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
    };
  }
  return {
    label: "Needs Work",
    color: "text-rose-700",
    badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
  };
}

