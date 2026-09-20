import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Application from "@/models/Application";
import PrepChecklist, { PrepCategory, PrepPriority } from "@/models/PrepChecklist";
import { DEFAULT_PREP_TOPICS } from "@/lib/defaultChecklists";

const VALID_CATEGORIES: PrepCategory[] = ["DSA", "Aptitude", "Core CS", "HR", "Custom"];
const VALID_PRIORITIES: PrepPriority[] = ["Low", "Medium", "High"];

/**
 * GET /api/applications/[id]/checklist
 * Returns prep checklist for a specific application.
 * Automatically seeds default topics if opening for the first time.
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

    // Retrieve existing topics
    let checklist = await PrepChecklist.find({
      applicationId: id,
      userId: session.user.id,
    }).sort({ createdAt: 1 });

    // Seed default topics if opening for the first time
    if (checklist.length === 0) {
      const defaultDocs = DEFAULT_PREP_TOPICS.map((topic) => ({
        userId: session.user.id,
        applicationId: id,
        category: topic.category,
        topic: topic.topic,
        priority: topic.priority,
        completed: false,
      }));

      await PrepChecklist.insertMany(defaultDocs);
      checklist = await PrepChecklist.find({
        applicationId: id,
        userId: session.user.id,
      }).sort({ createdAt: 1 });
    }

    return NextResponse.json({ checklist }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/applications/[id]/checklist error:", error);
    return NextResponse.json(
      { error: "Failed to fetch prep checklist." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/applications/[id]/checklist
 * Adds a custom topic to an application's prep checklist.
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
    const { category, topic, priority } = await request.json();

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return NextResponse.json(
        { error: "Topic name is required." },
        { status: 400 }
      );
    }

    const prepCategory: PrepCategory = VALID_CATEGORIES.includes(category)
      ? category
      : "Custom";

    const prepPriority: PrepPriority = VALID_PRIORITIES.includes(priority)
      ? priority
      : "Medium";

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

    const newItem = await PrepChecklist.create({
      userId: session.user.id,
      applicationId: id,
      category: prepCategory,
      topic: topic.trim(),
      priority: prepPriority,
      completed: false,
    });

    return NextResponse.json(
      { message: "Topic added successfully.", item: newItem },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/applications/[id]/checklist error:", error);
    return NextResponse.json(
      { error: "Failed to add topic to checklist." },
      { status: 500 }
    );
  }
}