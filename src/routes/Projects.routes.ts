import { Router } from "express";
import {
createProject,
getAllProjects,
getProjectById,
updateProject,
} from '../controllers/Projects.controller.ts'
import { verifyJWT } from "../middlewares/auth.middleware.ts";

const router = Router();

router.route('/create-project').post(verifyJWT,createProject);
router.route('/projects').get(verifyJWT,getAllProjects);
router.route('/get-project/:projectId').get(verifyJWT,getProjectById);
router.route('/update-project/:projectId').patch(verifyJWT,updateProject);



export default router; 