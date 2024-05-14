import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import userModal from "../models/user.model";
import { createActivationToken } from "../helper/tokenActivation";
import ejs from "ejs"
import path from "path";
import sendmail from "../utils/sendMail";

interface IRegistrationbody{
name:string,
email:string,
password:String,
avator?:String,
}

export const userRegistration=CatchAsyncError(async (req:Request,res:Response,next:NextFunction)=>{
try {
        const {name,email, password, avator}=req.body as IRegistrationbody;
        const isEmailExisted=await userModal.findOne({email});
        if(!isEmailExisted){
            return next(new ErrorHandler("email already existed",400))
        }
        const user:IRegistrationbody={
            name,
            email,
            password
        }
        const activationToken =createActivationToken(user);
        const activationCode=activationToken.activationCode;
        const data={user:{name:user.name},activationCode}
        const html=ejs.renderFile(path.join(__dirname,"../mails"),data);
        try {
            await sendmail({
                email:user.email,
                subject:"Activate your account",
                template:"Activation.mail.ejs",
                data,

            })
            res.status(201).json({
                success:true,
                messsage:`Please check your email ${user.name} to verify your account  `,
                activationToken:activationToken.token
            })
        } catch (error:any) {
         return next(new ErrorHandler(error.message,400))
        }

} catch (error:any) {
    return next(new ErrorHandler(error.message,400))
}
})