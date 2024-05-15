import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import userModal, { IUSER } from "../models/user.model";
import { createActivationToken } from "../helper/tokenActivation";
import ejs from "ejs";
import path from "path";
import sendmail from "../utils/sendMail";
import jwt, { Secret } from "jsonwebtoken";

interface IRegistrationbody {
  name: string;
  email: string;
  password: String;
  avator?: String;
}
// Registration Api
export const userRegistration = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, avator } = req.body as IRegistrationbody;
      const isEmailExisted = await userModal.findOne({ email });
      if (isEmailExisted) {
        return next(new ErrorHandler("email already existed", 400));
      } else {
        const user: IRegistrationbody = {
          name,
          email,
          password,
        };
        const activationToken = createActivationToken(user);
        const activationCode = activationToken.activationCode;
        const data = { user: { name: user.name }, activationCode };
        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/activationMail.ejs"),
          data
        );
        try {
          await sendmail({
            email: user.email,
            subject: "Activate your account",
            template: "ActivationMail.ejs",
            data,
          });
          res.status(201).json({
            success: true,
            messsage: `Please check your email ${user.name} to verify your account  `,
            activationToken: activationToken.token,
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 400));
        }
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Activate user
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;
      //@ts-ignore
      const newUser: { user: IUSER; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACCESS_TOKEN_PRIVATE_KEY as string
      ) as { user: IUSER; ActivationCode: string };
      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid Activation token", 400));
      }
      const { name, email, password } = newUser.user;
      const userExists = await userModal.findOne({ email });
      if (userExists) {
        return next(new ErrorHandler("User Already existed", 400));
      }
      const user = await userModal.create({
        name,
        email,
        password,
      });
      res.status(200).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
