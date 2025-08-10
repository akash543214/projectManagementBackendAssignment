// src/models/Projects.Models.ts
import mongoose, { Document, Schema, model, Types } from "mongoose";

export interface IProject extends Document {
  _id: string;
  title: string;
  description: string;
  status: "active" | "completed";
  tasks: Types.ObjectId[]; 
  user: Types.ObjectId;    
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
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Project = model<IProject>("Project", ProjectSchema);
