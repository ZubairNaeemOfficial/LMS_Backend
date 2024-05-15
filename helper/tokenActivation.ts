require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler";
import userModal, { IUSER } from "../models/user.model";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";

interface IActivationToken {
  token: string;
  activationCode: string;
}
export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 900).toString();
  const token = jwt.sign(
    { user, activationCode },
    process.env.ACCESS_TOKEN_PRIVATE_KEY as Secret,
    { expiresIn: "1hr" }
  );
  return { token, activationCode };
};
