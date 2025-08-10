import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());  


import userRouter from './routes/Users.routes.ts';

app.use("/api", userRouter);

export default app;
