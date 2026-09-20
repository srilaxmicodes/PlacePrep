import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Application, { ApplicationStage } from "@/models/Application";

const VALID_STAGES: ApplicationStage[] = [
  "Wishlist",
  "Applied",
  "OA/Test",
  "Interview",
  "Offer",
  "Rejected",
];

/**
 * GET /api/applications
 * Returns all job applications belonging strictly to the logged-in user.
 * Supports optional search by company/role and filtering by stage.
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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();
    const stage = searchParams.get("stage")?.trim();

    // Query filter anchored by userId for per-user data isolation
    const query: any = { userId: session.user.id };

    if (stage && VALID_STAGES.includes(stage as ApplicationStage)) {
      query.stage = stage;
    }

       if (search) {
      // Escape special regex characters so user input is treated as plain text
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { company: { $regex: escaped, $options: "i" } },
        { role: { $regex: escaped, $options: "i" } },
      ];
    }

    const applications = await Application.find(query).sort({
      order: 1,
      createdAt: -1,
    });

    return NextResponse.json({ applications }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/applications error:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/applications
 * Creates a new job application for the logged-in user.
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized access. Please log in." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { company, role, package: salaryPackage, stage, deadline, jobUrl, notes } = body;

    // Server-side Input Validations
    if (!company || typeof company !== "string" || !company.trim()) {
      return NextResponse.json(
        { error: "Company name is required." },
        { status: 400 }
      );
    }

    if (!role || typeof role !== "string" || !role.trim()) {
      return NextResponse.json(
        { error: "Role title is required." },
        { status: 400 }
      );
    }

    const appStage: ApplicationStage = VALID_STAGES.includes(stage)
      ? stage
      : "Wishlist";

    await dbConnect();

    // Calculate next order position within the selected stage
    const countInStage = await Application.countDocuments({
      userId: session.user.id,
      stage: appStage,
    });

    const newApplication = await Application.create({
      userId: session.user.id,
      company: company.trim(),
      role: role.trim(),
      package: salaryPackage ? String(salaryPackage).trim() : "",
      stage: appStage,
      deadline: deadline ? new Date(deadline) : undefined,
      jobUrl: jobUrl ? String(jobUrl).trim() : "",
      notes: notes ? String(notes).trim() : "",
      order: countInStage,
    });

    return NextResponse.json(
      { message: "Application created successfully.", application: newApplication },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/applications error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create application." },
      { status: 500 }
    );
  }
}

