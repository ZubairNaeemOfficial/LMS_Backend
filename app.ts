require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.routes";

//body parser
app.use(express.json({ limit: "50mb" }));
// cookie parser
app.use(cookieParser());
// cors connection
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

app.use("/api/v1",userRouter)

app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    message: "you generated test api ",
    success: true,
  });
});
// unknown route
app.get("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} is not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleware)