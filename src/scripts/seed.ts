
import bcrypt from "bcrypt";
import { User } from "../models/Users.Models.ts";
import { Project } from "../models/Projects.Models.ts";
import { Task } from "../models/Tasks.Models.ts";
import connectDB from "../db/index.ts";
import dotenv from "dotenv";
dotenv.config();


async function createUser(name: string, email: string, password: string) {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();

  return User.findById(user._id).select("-password -refreshToken");
}

async function createProject(title: string, description: string, userId: string) {
  const project = new Project({ title, description, user: userId });
  await project.save();
  return project;
}

async function createTask(
  title: string,
  description: string,
  status: "todo" | "in-progress" | "done",
  dueDate: Date,
  projectId: string,
  userId: string
) {
  const task = new Task({ title, description, status, dueDate, project: projectId, user: userId });
  await task.save();

  await Project.findByIdAndUpdate(projectId, { $push: { tasks: task._id } });

  return task;
}

async function seed() {
  try {
    await connectDB();


    const user = await createUser("Seed User", "test@example.com", "Test@123");
    if (!user) throw new Error("User creation failed");

    console.log(user);
    
    const project1 = await createProject("Project One", "First seeded project", user._id.toString());
    const project2 = await createProject("Project Two", "Second seeded project", user._id.toString());

    console.log(project1,project2);

  const task=  await createTask("Task 1 for Project One", "First task description", "todo", new Date(), project1._id.toString(), user._id.toString());
    await createTask("Task 2 for Project One", "Second task description", "in-progress", new Date(), project1._id.toString(), user._id.toString());
    await createTask("Task 3 for Project One", "Third task description", "done", new Date(), project1._id.toString(), user._id.toString());

    await createTask("Task 1 for Project Two", "First task description", "todo", new Date(), project2._id.toString(), user._id.toString());
    await createTask("Task 2 for Project Two", "Second task description", "in-progress", new Date(), project2._id.toString(), user._id.toString());
    await createTask("Task 3 for Project Two", "Third task description", "done", new Date(), project2._id.toString(), user._id.toString());

    console.log(task);
    console.log("Seed data created successfully");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seed();
