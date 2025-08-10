import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  dueDate: Date;
  user: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
}

const TaskSchema: Schema<ITask> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    dueDate: { type: Date, required: false },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  },
  { timestamps: true }
);

export const Task: Model<ITask> = mongoose.model<ITask>("Task", TaskSchema);
