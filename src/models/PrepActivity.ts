import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPrepActivity extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  date: string; // ISO Date String format YYYY-MM-DD for simple streak counting & timezone normalization
  count: number; // Number of prep actions completed on this date
  createdAt: Date;
  updatedAt: Date;
}

const PrepActivitySchema: Schema<IPrepActivity> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
      // Format: YYYY-MM-DD
    },
    count: {
      type: Number,
      default: 1,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only have one activity document per date
PrepActivitySchema.index({ userId: 1, date: 1 }, { unique: true });

const PrepActivity: Model<IPrepActivity> =
  mongoose.models.PrepActivity ||
  mongoose.model<IPrepActivity>("PrepActivity", PrepActivitySchema);

export default PrepActivity;

