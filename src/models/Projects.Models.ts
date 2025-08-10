import mongoose, { Document, Schema, model, Types } from "mongoose";

export interface IProject extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  status: "active" | "completed";
  tasks: Types.ObjectId[]; 
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task", 
      },
    ],
  },
  { timestamps: true }
);

export const Project = model<IProject>("Project", ProjectSchema);
