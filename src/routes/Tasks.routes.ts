import { Router } from "express";
import {
createTask, getAllTasks, updateTask,deleteTask 
} from '../controllers/Tasks.controller.ts'
import { verifyJWT } from "../middlewares/auth.middleware.ts";

const router = Router();

router.route('/create-task/:projectId').post(verifyJWT,createTask);
router.route('/tasks/:projectId').get(verifyJWT,getAllTasks);
router.route('/update-task/:projectId').patch(verifyJWT,updateTask);
router.route('/delete-task/:taskId').delete(verifyJWT,deleteTask);



export default router; 