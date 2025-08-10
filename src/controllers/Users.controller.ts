import type { Request, Response } from "express";
import { User } from "../models/Users.Models.ts";
import type { IUser } from "../models/Users.Models.ts";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: IUser;
}

const generateAccessAndRefreshTokens = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ login: false, error: "User does not exist" });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ login: false, error: "Invalid Password" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id.toString());
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const cookieOptions = { httpOnly: true, secure: true };

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({ login: true, user: loggedInUser, accessToken, refreshToken });
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const logoutUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );

    const cookieOptions = { httpOnly: true, secure: true };

    return res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json({ msg: "User logged out" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const refreshAccessToken = async (req: Request, res: Response) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!incomingRefreshToken) {
    return res.status(401).json({ msg: "Unauthorized request" });
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { _id: string };

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      return res.status(401).json({ msg: "Invalid refresh token" });
    }

    if (incomingRefreshToken !== user.refreshToken) {
      return res.status(401).json({ msg: "Refresh token is expired or used" });
    }

    const cookieOptions = { httpOnly: true, secure: true };
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id.toString());

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json({ data: { accessToken, refreshToken: newRefreshToken }, msg: "Access token refreshed" });
  } catch {
    res.status(401).json({ msg: "Invalid refresh token" });
  }
};

const createUsers = async (req: Request, res: Response) => {
  const { name, email, password }: { name: string; email: string; password: string } = req.body;
  try {
    const user = await User.create({ name, email, password });
    res.status(201).json(user);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json(err);
  }
};

export { createUsers, loginUser, logoutUser, refreshAccessToken };