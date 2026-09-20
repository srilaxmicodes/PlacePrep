import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import PrepChecklist from "@/models/PrepChecklist";
import PrepActivity from "@/models/PrepActivity";

/**
 * PUT /api/checklists/[checklistId]
 * Updates checklist topic item (toggle completed, topic name, priority, category).
 * Increments daily PrepActivity counter when completing a topic.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ checklistId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized access. Please log in." },
        { status: 401 }
      );
    }

    const { checklistId } = await params;
    const body = await request.json();

    await dbConnect();

    // Verify item ownership
    const item = await PrepChecklist.findOne({
      _id: checklistId,
      userId: session.user.id,
    });

    if (!item) {
      return NextResponse.json(
        { error: "Checklist item not found or unauthorized." },
        { status: 404 }
      );
    }

    const previousCompleted = item.completed;

       if (typeof body.completed === "boolean") {
      item.completed = body.completed;
      if (body.completed) {
        // Only count activity when the topic goes from not done to done
        if (!previousCompleted) {
          item.completedAt = new Date();

          const todayStr = new Date().toISOString().split("T")[0];
          await PrepActivity.findOneAndUpdate(
            { userId: session.user.id, date: todayStr },
            { $inc: { count: 1 } },
            { upsert: true, new: true }
          );
        }
      } else {
        item.completedAt = undefined;
      }
    }

    if (body.topic !== undefined && body.topic.trim()) {
      item.topic = body.topic.trim();
    }
    if (body.priority !== undefined) {
      item.priority = body.priority;
    }
    if (body.category !== undefined) {
      item.category = body.category;
    }

    await item.save();

    return NextResponse.json(
      { message: "Checklist item updated successfully.", item },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PUT /api/checklists/[checklistId] error:", error);
    return NextResponse.json(
      { error: "Failed to update checklist item." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/checklists/[checklistId]
 * Deletes a topic item from prep checklist.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ checklistId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized access. Please log in." },
        { status: 401 }
      );
    }

    const { checklistId } = await params;

    await dbConnect();

    const deletedItem = await PrepChecklist.findOneAndDelete({
      _id: checklistId,
      userId: session.user.id,
    });

    if (!deletedItem) {
      return NextResponse.json(
        { error: "Checklist item not found or unauthorized." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Topic removed from checklist." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE /api/checklists/[checklistId] error:", error);
    return NextResponse.json(
      { error: "Failed to delete checklist item." },
      { status: 500 }
    );
  }
}