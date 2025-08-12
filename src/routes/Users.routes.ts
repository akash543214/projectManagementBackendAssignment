import { Router } from "express";
import {
  createUsers, loginUser, logoutUser,verifyLogin
} from '../controllers/Users.controller.ts'
import { verifyJWT } from "../middlewares/auth.middleware.ts";
import { RegisterUserSchema } from "../schemas/User.schema.ts";
import { LoginUserSchema } from "../schemas/User.schema.ts";
import { createValidationMiddleware } from "../utils/CreateValidationMiddleware.ts";

  const validateRegistration = createValidationMiddleware(RegisterUserSchema);
   const validateLogin = createValidationMiddleware(LoginUserSchema);
const router = Router();

router.route('/login-user').post(loginUser);
router.route('/register-user').post(validateRegistration,createUsers);
router.route('/logout-user').post(verifyJWT, logoutUser);
router.route('/verify-login').get(verifyJWT,verifyLogin);


export default router; 