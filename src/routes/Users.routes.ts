import { Router } from "express";
import {
  createUsers, loginUser, logoutUser,
} from '../controllers/Users.controller.ts'
import { verifyJWT } from "../middlewares/auth.middleware.ts";


const router = Router();

router.route('/login-user').post(loginUser);
router.route('/register-user').post(createUsers);
router.route('/logout-user').post(verifyJWT, logoutUser);


export default router; 