import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { User } from "../models/Users.Models.ts";
import type { IUser } from "../models/Users.Models.ts";

interface AuthenticatedRequest extends Request {
  user?: Omit<IUser, "password" | "refreshToken">;
}

interface TokenPayload extends JwtPayload {
  _id: string;
}

export const verifyJWT = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ error: "Unauthorized request" });
      return;
    }

    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as TokenPayload;

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      res.status(401).json({ error: "Invalid Access Token" });
      return;
    }

    req.user = user as AuthenticatedRequest["user"];
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid Access Token" });
  }
};