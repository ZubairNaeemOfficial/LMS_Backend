import express from "express"
import { activateUser, userRegistration } from "../controllers/user.controller";
const userRouter=express.Router();

userRouter.post("/registeration" ,userRegistration)
userRouter.post("/activate-user",activateUser)
export default userRouter;