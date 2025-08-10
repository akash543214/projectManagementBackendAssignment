import type { Request, Response } from "express";
import { Task } from "../models/Tasks.Models.ts";
import type { IUser } from "../models/Users.Models.ts";
import { Project } from "../models/Projects.Models.ts";


interface AuthRequest extends Request {
  user?: IUser;
}

type taskRequest = {
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  dueDate: Date;
};

const createTask = async (req: AuthRequest, res: Response) => {

  const { title, description,status,dueDate }: taskRequest = req.body;
    if(!req.params.projectId)
        {
             return res.status(400).json({ error: "Project ID is required" });   
        }

     const user = req?.user?._id;

    if (!user) {

    return res.status(401).json({ error: "Unauthorized" });
  } 

  try {

    const task = await Task.create({ 
       title: title, 
       description: description,
        status: status,
       dueDate: dueDate, 
       user: user,
       project: req.params.projectId });

         await Project.findByIdAndUpdate(req.params.projectId, {
      $push: { tasks: task._id },
    });
    
    res.status(201).json(task);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json(err);
  }
};

const getAllTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const projects = await Task.find({ project: req.params.projectId, user: userId });
    res.status(200).json(projects);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json(err);
  }
};



const updateTask = async (req: AuthRequest, res: Response) => {
  const projectId = req.params.projectId;
  const { title, description, status,dueDate }: Partial<taskRequest> = req.body;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const task = await Task.findOneAndUpdate(
      { _id: projectId, user: userId },
      { title, description, status,dueDate },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: "task not found" });
    }

    res.status(200).json(task);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json(err);
  }
};


export { createTask, getAllTasks, updateTask };