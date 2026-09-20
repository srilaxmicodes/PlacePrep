import mongoose, { Schema, Document, Model } from "mongoose";

export type PrepCategory = "DSA" | "Aptitude" | "Core CS" | "HR" | "Custom";
export type PrepPriority = "Low" | "Medium" | "High";

export interface IPrepChecklist extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  applicationId: mongoose.Types.ObjectId;
  category: PrepCategory;
  topic: string;
  priority: PrepPriority;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PrepChecklistSchema: Schema<IPrepChecklist> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true, // Links topic directly to specific company application
    },
    category: {
      type: String,
      enum: ["DSA", "Aptitude", "Core CS", "HR", "Custom"],
      required: true,
    },
    topic: {
      type: String,
      required: [true, "Topic name is required"],
      trim: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient lookup of company-specific checklist items per user
PrepChecklistSchema.index({ userId: 1, applicationId: 1 });

const PrepChecklist: Model<IPrepChecklist> =
  mongoose.models.PrepChecklist ||
  mongoose.model<IPrepChecklist>("PrepChecklist", PrepChecklistSchema);

export default PrepChecklist;

