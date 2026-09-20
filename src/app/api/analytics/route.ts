import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Application from "@/models/Application";
import PrepChecklist from "@/models/PrepChecklist";
import InterviewLog from "@/models/InterviewLog";
import PrepActivity from "@/models/PrepActivity";
import { calculateReadinessScore } from "@/lib/readiness";
import { calculateStreaks } from "@/lib/streak";
import { calculateFunnelAnalytics } from "@/lib/analytics";
import { calculateSkillGaps } from "@/lib/skillGap";
import { ApplicationData, PrepChecklistItem } from "@/types";

/**
 * GET /api/analytics
 * Returns aggregated analytics metrics for the logged-in user:
 * - Recruitment Funnel Conversion Rates
 * - Prep Activity Streaks (Current & Longest)
 * - Global Top 5 Skill Gaps ("Focus First")
 * - Overall Average Readiness Score
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized access. Please log in." },
        { status: 401 }
      );
    }

    await dbConnect();

    // 1. Fetch user applications (lean for JSON serialization)
    const rawApps = await Application.find({ userId: session.user.id }).lean();
    const applications: ApplicationData[] = rawApps.map((a: any) => ({
      ...a,
      _id: a._id.toString(),
      userId: a.userId.toString(),
    }));

    // 2. Fetch user checklists
    const rawChecklists = await PrepChecklist.find({ userId: session.user.id }).lean();
    const checklists: PrepChecklistItem[] = rawChecklists.map((c: any) => ({
      ...c,
      _id: c._id.toString(),
      userId: c.userId.toString(),
      applicationId: c.applicationId.toString(),
    }));

    // 3. Fetch user interview logs
    const interviewLogs = await InterviewLog.find({ userId: session.user.id }).lean();

    // 4. Fetch user prep activity dates
    const prepActivities = await PrepActivity.find({ userId: session.user.id }).lean();
    const activityDates = prepActivities.map((a: any) => a.date);

    // Compute Funnel Analytics
    const funnel = calculateFunnelAnalytics(applications);

    // Compute Streaks
    const streaks = calculateStreaks(activityDates);

    // Compute Skill Gaps
    const skillGaps = calculateSkillGaps(applications, checklists);

    // Compute Per-Application & Average Readiness Scores
    const readinessScores = applications.map((app) => {
      const appChecklist = checklists.filter(
        (c) => c.applicationId === app._id
      );
      const appLogs = interviewLogs.filter(
        (l: any) => l.applicationId.toString() === app._id
      );

      const checklistCompleted = appChecklist.filter((c) => c.completed).length;
      const roundsCleared = appLogs.filter((l: any) => l.outcome === "Cleared").length;

      const scoreResult = calculateReadinessScore({
        checklistCompleted,
        checklistTotal: appChecklist.length,
        roundsCleared,
        roundsTotal: appLogs.length,
        activeDaysInLast14: streaks.activeDaysInLast14,
        applicationStage: app.stage,
      });

      return {
        applicationId: app._id,
        company: app.company,
        role: app.role,
        stage: app.stage,
        readiness: scoreResult,
      };
    });

    const averageScore =
      readinessScores.length > 0
        ? Math.round(
            readinessScores.reduce((sum, r) => sum + r.readiness.score, 0) /
              readinessScores.length
          )
        : 0;

    return NextResponse.json(
      {
        funnel,
        streaks,
        topGlobalGaps: skillGaps.topGlobalGaps,
        averageScore,
        readinessScores,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/analytics error:", error);
    return NextResponse.json(
      { error: "Failed to compute analytics metrics." },
      { status: 500 }
    );
  }
}

