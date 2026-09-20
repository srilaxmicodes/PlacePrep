import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import InterviewLog, { DifficultyLevel, RoundOutcome } from "@/models/InterviewLog";

const VALID_DIFFICULTIES: DifficultyLevel[] = ["Easy", "Medium", "Hard"];
const VALID_OUTCOMES: RoundOutcome[] = ["Pending", "Cleared", "Rejected"];

/**
 * PUT /api/logs/[logId]
 * Updates an existing interview round log with ownership check.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ logId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized access. Please log in." },
        { status: 401 }
      );
    }

    const { logId } = await params;
    const body = await request.json();

    await dbConnect();

    // Verify ownership
    const log = await InterviewLog.findOne({
      _id: logId,
      userId: session.user.id,
    });

    if (!log) {
      return NextResponse.json(
        { error: "Interview log not found or unauthorized." },
        { status: 404 }
      );
    }

    if (body.roundName !== undefined && body.roundName.trim()) {
      log.roundName = body.roundName.trim();
    }
    if (body.date !== undefined) {
      log.date = new Date(body.date);
    }
    if (body.questionsAsked !== undefined) {
      log.questionsAsked = Array.isArray(body.questionsAsked)
        ? body.questionsAsked.map((q: any) => String(q).trim()).filter(Boolean)
        : typeof body.questionsAsked === "string"
        ? body.questionsAsked
            .split("\n")
            .map((q: string) => q.trim())
            .filter(Boolean)
        : [];
    }
    if (body.difficulty !== undefined && VALID_DIFFICULTIES.includes(body.difficulty)) {
      log.difficulty = body.difficulty;
    }
    if (body.outcome !== undefined && VALID_OUTCOMES.includes(body.outcome)) {
      log.outcome = body.outcome;
    }
    if (body.lessonsLearned !== undefined) {
      log.lessonsLearned = String(body.lessonsLearned).trim();
    }

    await log.save();

    return NextResponse.json(
      { message: "Interview log updated successfully.", log },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PUT /api/logs/[logId] error:", error);
    return NextResponse.json(
      { error: "Failed to update interview log." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/logs/[logId]
 * Deletes an interview round log with ownership check.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ logId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized access. Please log in." },
        { status: 401 }
      );
    }

    const { logId } = await params;

    await dbConnect();

    const deletedLog = await InterviewLog.findOneAndDelete({
      _id: logId,
      userId: session.user.id,
    });

    if (!deletedLog) {
      return NextResponse.json(
        { error: "Interview log not found or unauthorized." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Interview log deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE /api/logs/[logId] error:", error);
    return NextResponse.json(
      { error: "Failed to delete interview log." },
      { status: 500 }
    );
  }
}