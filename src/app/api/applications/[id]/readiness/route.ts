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
import { calculateSkillGaps } from "@/lib/skillGap";
import { ApplicationData, PrepChecklistItem } from "@/types";

/**
 * GET /api/applications/[id]/readiness
 * Returns readiness score breakdown and skill gaps for a specific company.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized access. Please log in." },
        { status: 401 }
      );
    }

    const { id } = await params;

    await dbConnect();

    // Verify application ownership
    const rawApp = await Application.findOne({
      _id: id,
      userId: session.user.id,
    }).lean();

    if (!rawApp) {
      return NextResponse.json(
        { error: "Application not found or unauthorized." },
        { status: 404 }
      );
    }

    const application: ApplicationData = {
      ...(rawApp as any),
      _id: (rawApp as any)._id.toString(),
      userId: (rawApp as any).userId.toString(),
    };

    // Fetch checklist for this application
    const rawChecklist = await PrepChecklist.find({
      applicationId: id,
      userId: session.user.id,
    }).lean();

    const checklist: PrepChecklistItem[] = rawChecklist.map((c: any) => ({
      ...c,
      _id: c._id.toString(),
      userId: c.userId.toString(),
      applicationId: c.applicationId.toString(),
    }));

    // Fetch interview logs for this application
    const logs = await InterviewLog.find({
      applicationId: id,
      userId: session.user.id,
    }).lean();

    // Fetch activity dates
    const activities = await PrepActivity.find({ userId: session.user.id }).lean();
    const activityDates = activities.map((a: any) => a.date);
    const streaks = calculateStreaks(activityDates);

    const checklistCompleted = checklist.filter((c) => c.completed).length;
    const roundsCleared = logs.filter((l: any) => l.outcome === "Cleared").length;

    const readiness = calculateReadinessScore({
      checklistCompleted,
      checklistTotal: checklist.length,
      roundsCleared,
      roundsTotal: logs.length,
      activeDaysInLast14: streaks.activeDaysInLast14,
      applicationStage: application.stage,
    });

    const skillGapsResult = calculateSkillGaps([application], checklist);
    const companyGaps = skillGapsResult.companyGapMap[id] || [];

    return NextResponse.json(
      {
        company: application.company,
        role: application.role,
        stage: application.stage,
        readiness,
        skillGaps: companyGaps,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/applications/[id]/readiness error:", error);
    return NextResponse.json(
      { error: "Failed to compute company readiness." },
      { status: 500 }
    );
  }
}