import { Response } from "express";
import { IUSER } from "../models/user.model";
import { redis } from "./redis";

require("dotenv").config();


interface ITOKENOPTION{
    expires:Date;
    maxAge:number;
    httpOnly:boolean;
    sameSite:"lax"| "strict" | "none"| undefined;
    secure: boolean;
}

export const sendToken=(user:IUSER,statusCode:number,res:Response)=>{
const accessToken= user.SignAccessToken();
const refreshToken=user.SignRefreshToken();
// upload session to redis
 
redis.set(user._id,JSON.stringify(user) as any)

// parse enviroment variable to integarte with fallback values 

const accessTokenExpire=parseInt(process.env.ACCESS_TOKEN_EXPIRE || "300",10)
const refreshTokenExpire=parseInt(process.env.REFRESH_TOKEN_EXPIRE || "1200",10)

//option for cookies

const refreshTokenOptions : ITOKENOPTION ={
    expires: new Date(Date.now() + refreshTokenExpire * 1000 ),
    httpOnly:true,
    sameSite:"lax",
    maxAge:refreshTokenExpire *1000,
    secure:false
}
const accessTokenOptions : ITOKENOPTION ={
    expires: new Date(Date.now() + accessTokenExpire * 1000 ),
    httpOnly:true,
    sameSite:"lax",
    maxAge: accessTokenExpire * 1000  ,
    secure:false
}
// only set secure to true in production
if(process.env.NODE_ENV==="production"){
    accessTokenOptions.secure=true;
}
res.cookie("access_token",accessToken,accessTokenOptions);
res.cookie("refresh_token",refreshToken,refreshTokenOptions);
res.status(statusCode).json({
    success:true,
    user,
    accessToken
})
}