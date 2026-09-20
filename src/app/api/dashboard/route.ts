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
import { getDeadlineAlerts } from "@/lib/deadlines";
import { ApplicationData, PrepChecklistItem } from "@/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/dashboard
 * Aggregates all dashboard metrics, chart datasets, and deadline alerts for the logged-in user.
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

    // 1. Fetch User Data with lean()
    const rawApps = await Application.find({ userId: session.user.id }).lean();
    const applications: ApplicationData[] = rawApps.map((a: any) => ({
      ...a,
      _id: a._id.toString(),
      userId: a.userId.toString(),
    }));

    const rawChecklists = await PrepChecklist.find({ userId: session.user.id }).lean();
    const checklists: PrepChecklistItem[] = rawChecklists.map((c: any) => ({
      ...c,
      _id: c._id.toString(),
      userId: c.userId.toString(),
      applicationId: c.applicationId.toString(),
    }));

    const interviewLogs = await InterviewLog.find({ userId: session.user.id }).lean();
    const prepActivities = await PrepActivity.find({ userId: session.user.id }).lean();
    const activityDates = prepActivities.map((a: any) => a.date);

    // 2. Streaks & Funnel
    const streaks = calculateStreaks(activityDates);
    const funnel = calculateFunnelAnalytics(applications);

    // 3. Deadline Alerts
    const deadlinesInfo = getDeadlineAlerts(applications);

    // 4. Per-Company Readiness & Average Score
    const companyReadiness = applications.map((app) => {
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
        company: app.company,
        role: app.role,
        score: scoreResult.score,
        stage: app.stage,
      };
    });

    const averageReadinessScore =
      companyReadiness.length > 0
        ? Math.round(
            companyReadiness.reduce((sum, item) => sum + item.score, 0) /
              companyReadiness.length
          )
        : 0;

    // 5. Topic-Wise Completion by Category
    const categories = ["DSA", "Core CS", "Aptitude", "HR"];
    const categoryStats = categories.map((cat) => {
      const catTopics = checklists.filter((c) => c.category === cat);
      const completed = catTopics.filter((c) => c.completed).length;
      const total = catTopics.length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        category: cat,
        completed,
        total,
        percentage: percent,
      };
    });

    // 6. Weekly Prep Activity (Last 8 Weeks)
    const now = new Date();
    const weeklyActivity: { weekLabel: string; topicsCompleted: number }[] = [];

    for (let w = 7; w >= 0; w--) {
      const startOfWeek = new Date(now.getTime() - (w * 7 + 6) * 24 * 60 * 60 * 1000);
      const endOfWeek = new Date(now.getTime() - w * 7 * 24 * 60 * 60 * 1000);

      const startStr = startOfWeek.toISOString().split("T")[0];
      const endStr = endOfWeek.toISOString().split("T")[0];

      // Sum prep activities falling within this 7-day window
      const weekCount = prepActivities
        .filter((a: any) => a.date >= startStr && a.date <= endStr)
        .reduce((sum: number, a: any) => sum + (a.count || 1), 0);

      const label = w === 0 ? "This Wk" : `Wk ${8 - w}`;
      weeklyActivity.push({ weekLabel: label, topicsCompleted: weekCount });
    }

    // 7. Applications by Stage Chart Dataset
    const applicationsByStageData = Object.entries(funnel.stageCounts).map(
      ([stage, count]) => ({ stage, count })
    );

    return NextResponse.json(
      {
        summary: {
          totalApplications: applications.length,
          activeInterviews: funnel.stageCounts.Interview,
          offers: funnel.stageCounts.Offer,
          averageReadinessScore,
          currentStreak: streaks.currentStreak,
        },
        deadlinesInfo,
        weeklyActivity,
        categoryStats,
        applicationsByStageData,
        companyReadiness,
        funnel,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard metrics." },
      { status: 500 }
    );
  }
}
