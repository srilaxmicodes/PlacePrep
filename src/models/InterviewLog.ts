import mongoose, { Schema, Document, Model } from "mongoose";

export type DifficultyLevel = "Easy" | "Medium" | "Hard";
export type RoundOutcome = "Pending" | "Cleared" | "Rejected";

export interface IInterviewLog extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  applicationId: mongoose.Types.ObjectId;
  roundName: string;
  date: Date;
  questionsAsked: string[];
  difficulty: DifficultyLevel;
  outcome: RoundOutcome;
  lessonsLearned: string;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewLogSchema: Schema<IInterviewLog> = new Schema(
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
      index: true,
    },
    roundName: {
      type: String,
      required: [true, "Round name is required"],
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    questionsAsked: {
      type: [String],
      default: [],
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    outcome: {
      type: String,
      enum: ["Pending", "Cleared", "Rejected"],
      default: "Pending",
    },
    lessonsLearned: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly retrieve interview logs for a specific application
InterviewLogSchema.index({ userId: 1, applicationId: 1 });

const InterviewLog: Model<IInterviewLog> =
  mongoose.models.InterviewLog ||
  mongoose.model<IInterviewLog>("InterviewLog", InterviewLogSchema);

export default InterviewLog;

