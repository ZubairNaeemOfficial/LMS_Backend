import mongoose , {Document, Model , Schema} from "mongoose";
import bcrypt from "bcryptjs";

const emailRegularPattern : RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export interface IUSER extends Document{
    email:string;
    password:string;
    name:string;
    avatar:{
        public_id:string;
        url:string;
    };
    role:string;
    isVerified:boolean;
    courses:Array<{course_is:string}>;
    comparePassword:(password:string)=>Promise<boolean>

}

const userSchema: Schema<IUSER>=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"]
    },
    email:{
        type:String,
        required:[true,"please enter your email"],
        validate:{
           validator:(value:string)=>{
                return emailRegularPattern.test(value)
            },
            message:"Please enter valid email",
        },
        unique:true,
    },
    password:{
        type:String,
        required:[true , "Please Enter password"],
        minlength:[8,"Password must be 8 character"],
        select:false,
    },
    avatar:{
        public_id:String,
        url:String,
    },
    role:{
        type:String,
        default:"user",
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    courses:[{
        courseId:String,

    }],
},{timestamps:true})

userSchema.pre<IUSER>("save", async function(next){
if(!this.isModified("password")){
    next()
}
this.password=await bcrypt.hash(this.password,10);
next()
})
userSchema.methods.comparePassword=async function(enteredPassword:string):Promise<boolean>{
return await bcrypt.compare(enteredPassword,this.password)
}

const userModal:Model<IUSER>=mongoose.model("User",userSchema);
export default userModal