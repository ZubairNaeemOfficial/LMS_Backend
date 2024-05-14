require("dotenv").config();
import { IUSER } from "../models/user.model";
import jwt, { Secret } from "jsonwebtoken";

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
