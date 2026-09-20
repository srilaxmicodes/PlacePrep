import mongoose, { Schema, Document, Model } from "mongoose";

export type ApplicationStage =
  | "Wishlist"
  | "Applied"
  | "OA/Test"
  | "Interview"
  | "Offer"
  | "Rejected";

export interface IApplication extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  company: string;
  role: string;
  package?: string; // e.g. CTC / salary package details
  stage: ApplicationStage;
  deadline?: Date;
  jobUrl?: string;
  notes?: string;
  order: number; // Position index within stage column for dnd-kit ordering
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema: Schema<IApplication> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Strict per-user index for ownership checks & fast querying
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role title is required"],
      trim: true,
    },
    package: {
      type: String,
      default: "",
      trim: true,
    },
    stage: {
      type: String,
      enum: ["Wishlist", "Applied", "OA/Test", "Interview", "Offer", "Rejected"],
      default: "Wishlist",
      index: true,
    },
    deadline: {
      type: Date,
    },
    jobUrl: {
      type: String,
      default: "",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying user's applications by stage quickly
ApplicationSchema.index({ userId: 1, stage: 1 });

const Application: Model<IApplication> =
  mongoose.models.Application ||
  mongoose.model<IApplication>("Application", ApplicationSchema);

export default Application;

