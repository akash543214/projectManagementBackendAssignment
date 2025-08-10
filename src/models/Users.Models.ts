import mongoose, { Document, Model, Schema, Types } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export interface IUser extends Document {
    _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  refreshToken?: string;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
  isPasswordCorrect: (password: string) => Promise<boolean>;
}


const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
userSchema.methods.isPasswordCorrect = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Generate Access Token
userSchema.methods.generateAccessToken = function () {


   return jwt.sign(
    { _id: this._id, email: this.email },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: '120m' }
  );

};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: '7d' }
  );
};

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
