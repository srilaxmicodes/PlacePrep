import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Application from "@/models/Application";
import InterviewLog, { DifficultyLevel, RoundOutcome } from "@/models/InterviewLog";

const VALID_DIFFICULTIES: DifficultyLevel[] = ["Easy", "Medium", "Hard"];
const VALID_OUTCOMES: RoundOutcome[] = ["Pending", "Cleared", "Rejected"];

/**
 * GET /api/applications/[id]/logs
 * Returns interview logs for a specific application, sorted newest first.
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
    const application = await Application.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found or unauthorized." },
        { status: 404 }
      );
    }

    const logs = await InterviewLog.find({
      applicationId: id,
      userId: session.user.id,
    }).sort({ date: -1, createdAt: -1 });

    return NextResponse.json({ logs }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/applications/[id]/logs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch interview logs." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/applications/[id]/logs
 * Creates a new interview round log for an application.
 */
export async function POST(
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
    const body = await request.json();
    const { roundName, date, questionsAsked, difficulty, outcome, lessonsLearned } = body;

    // Server-side Input Validation
    if (!roundName || typeof roundName !== "string" || !roundName.trim()) {
      return NextResponse.json(
        { error: "Round name is required (e.g. Round 1 Technical)." },
        { status: 400 }
      );
    }

    const roundDiff: DifficultyLevel = VALID_DIFFICULTIES.includes(difficulty)
      ? difficulty
      : "Medium";

    const roundOut: RoundOutcome = VALID_OUTCOMES.includes(outcome)
      ? outcome
      : "Pending";

    const formattedQuestions = Array.isArray(questionsAsked)
      ? questionsAsked.map((q) => String(q).trim()).filter(Boolean)
      : typeof questionsAsked === "string"
      ? questionsAsked
          .split("\n")
          .map((q) => q.trim())
          .filter(Boolean)
      : [];

    await dbConnect();

    // Verify application ownership
    const application = await Application.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found or unauthorized." },
        { status: 404 }
      );
    }

    const newLog = await InterviewLog.create({
      userId: session.user.id,
      applicationId: id,
      roundName: roundName.trim(),
      date: date ? new Date(date) : new Date(),
      questionsAsked: formattedQuestions,
      difficulty: roundDiff,
      outcome: roundOut,
      lessonsLearned: lessonsLearned ? String(lessonsLearned).trim() : "",
    });

    return NextResponse.json(
      { message: "Interview log added successfully.", log: newLog },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/applications/[id]/logs error:", error);
    return NextResponse.json(
      { error: "Failed to add interview log." },
      { status: 500 }
    );
  }
}