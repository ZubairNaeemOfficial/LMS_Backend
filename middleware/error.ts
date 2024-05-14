import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

export const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server Error";

  // Wrong mongodb id
  if (err.name === "CastError") {
    const message = `resource not found . Invalid :${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  // duplicate Key Error
  if (err.code === 11000) {
    const message = `Dublicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }
  // jsonwebtoken error
  if (err.name === "JsonWebTokenError") {
    const message = `Jsonwebtoken is invalid please use another token`;
    err = new ErrorHandler(message, 400);
  }

  // jwt expirs error

  if (err.name === "TokenExpiredError") {
    const message = `JsonWebToken is expired, try again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
