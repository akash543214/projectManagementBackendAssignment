import type { Request, Response } from "express";
import { Project } from "../models/Projects.Models.ts";
import type { IUser } from "../models/Users.Models.ts";


interface AuthRequest extends Request {
  user?: IUser;
}

type projectRequest = {
  title: string;
  description: string;
};

const createProject = async (req: AuthRequest, res: Response) => {
  const { title, description }: projectRequest = req.body;
    
             const user = req?.user?._id;

    if (!user) {

    return res.status(401).json({ error: "Unauthorized" });
  } 

  try {

    const project = await Project.create({ title, description, user });
    res.status(201).json(project);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json(err);
  }
};

const getAllProjects = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const projects = await Project.find({ user: userId });
    res.status(200).json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json(err);
  }
};

const getProjectById = async (req: AuthRequest, res: Response) => {

    
  const projectId = req.params.projectId;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const project = await Project.findOne({ _id: projectId, user: userId }).populate("tasks");
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json(project);
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).json(err);
  }
};


const updateProject = async (req: AuthRequest, res: Response) => {
  const projectId = req.params.projectId;
  const { title, description, status }: Partial<projectRequest & { status: "active" | "completed" }> = req.body;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const project = await Project.findOneAndUpdate(
      { _id: projectId, user: userId },
      { title, description, status },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json(project);
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json(err);
  }
};


export { createProject, getAllProjects, getProjectById, updateProject };