import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        unique:true,
        required:true,
        minlength:7
    },
    profilePic:{
        type:String,
        default:""
    },
    bio:{
        type:String,
        default:""
    },
    nativeLanguage:{
        type:String,
        default:""
    },
    learningLanguage:{
        type:String,
        default:""
    },
    location:{
        type:String,
        default:""
    },
    isonBoarded:{
        type:Boolean,
        default:false
    },friends:[ 
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
},{timestamps:true})



userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();
    try {
        const salt=await bcrypt.genSalt(10);
        this.password=await bcrypt.hash(this.password,salt);

        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.matchPassword=async function (enteredPassword) {
     const isPassswordCorrect=await bcrypt.compare(enteredPassword,this.password);
     return isPassswordCorrect;
}

const User=mongoose.model("User",userSchema);


export default User;