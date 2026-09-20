import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Application, { ApplicationStage } from "@/models/Application";
import PrepChecklist from "@/models/PrepChecklist";
import InterviewLog from "@/models/InterviewLog";

const VALID_STAGES: ApplicationStage[] = [
  "Wishlist",
  "Applied",
  "OA/Test",
  "Interview",
  "Offer",
  "Rejected",
];

/**
 * PUT /api/applications/[id]
 * Updates an existing job application. Enforces ownership check.
 */
export async function PUT(
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

    await dbConnect();

    // Verify ownership of the application document
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

    // Update fields if provided
    if (body.company !== undefined) application.company = body.company.trim();
    if (body.role !== undefined) application.role = body.role.trim();
    if (body.package !== undefined) application.package = String(body.package).trim();
    if (body.stage !== undefined && VALID_STAGES.includes(body.stage)) {
      application.stage = body.stage;
    }
    if (body.deadline !== undefined) {
      application.deadline = body.deadline ? new Date(body.deadline) : undefined;
    }
    if (body.jobUrl !== undefined) application.jobUrl = String(body.jobUrl).trim();
    if (body.notes !== undefined) application.notes = String(body.notes).trim();
    if (typeof body.order === "number") application.order = body.order;

    await application.save();

    return NextResponse.json(
      { message: "Application updated successfully.", application },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PUT /api/applications/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update application." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/applications/[id]
 * Deletes an application and cascades deletion of its prep checklists & interview logs.
 */
export async function DELETE(
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

    // Enforce ownership check on delete
    const application = await Application.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found or unauthorized." },
        { status: 404 }
      );
    }

    // Cascade delete associated checklist items & interview logs for this application & user
    await PrepChecklist.deleteMany({ applicationId: id, userId: session.user.id });
    await InterviewLog.deleteMany({ applicationId: id, userId: session.user.id });

    return NextResponse.json(
      { message: "Application deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE /api/applications/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete application." },
      { status: 500 }
    );
  }
}