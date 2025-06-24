import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import {upsertStreamUser}  from '../lib/stream.js';
export async function signup(req,res){
    const{email,password,fullName} =req.body;

    try {
        if(!email || !password||!fullName){
            return res.status(400).json({message:"All fields are required"});
        }
        if(password.length<7){
            return res.status(400).json({message:"password must be atleast 7 characters"});
        }

        const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message:"invalid email format"});
        }

        const exsitingUser=await User.findOne({email});
        if(exsitingUser){
            return res.status(400).json({message:"email already exists,pleasee use differernt one"});
        }

        const idx=Math.floor(Math.random()*100)+1;
        const randomAvatar=`https://avatar.iran.liara.run/public/${idx}.png`;
        const newUser=await User.create(
            {
                email,
                fullName,
                password,
                profilePic:randomAvatar
            }
        )

        //create user for video call
        try {
            await upsertStreamUser({
            id: newUser._id.toString(),
            name: newUser.fullName,
            image: newUser.profilePic || "",
        });

        console.log(`Stream user created for ${newUser,fullName}`);
        } catch (error) {
            console.log("Stream user created for user",error);
        }


        const token=jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY,{
            expiresIn:"7d"
        })

        res.cookie("jwt",token,{
            maxAge:7*24*60*60*1000,
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV==="production"
        })

        res.status(201).json({success:true,user:newUser});
    } catch (error) {
        console.log("error in signup controller",error);
        res.status(500).json({message:"internal server error"});
    }
}
export async function login(req,res){
    try {
        const {email,password}=req.body;

        if(!email||!password){
            return res.status(400).json({message:"All fields are required"});
        }

        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({message:"Invalid email"});
        }

        const isPasssword=await user.matchPassword(password);
        if(!isPasssword){
            return res.status(401).json({message:"inavlid password"});
        }

         const token=jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{
            expiresIn:"7d"
        })

        res.cookie("jwt",token,{
            maxAge:7*24*60*60*1000,
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV==="production"
        })

        res.status(200).json({success:true,user});
    } catch (error) {
        console.log("error in login controller",error);
        res.status(500).json({message:"internal server error"});
    }
}
export function logout(req,res){
    res.clearCookie("jwt");
    res.status(200).json({success:true,message:"Logout successful"});
}
export async function onboard(req,res){
    try {
        const userId=req.user._id;

        const {fullName,bio,nativeLanguage,learningLanguage,location}=req.body;
        if(!fullName||!bio||!nativeLanguage||!learningLanguage||!location){
            return res.status(400).json({
                message:"All fields are required",
                missingFields:[ 
                    !fullName&&"fullName",
                    !bio&&"bio",
                    !nativeLanguage&&"nativeLanguage",
                    !learningLanguage&&"learningLanguage",
                    !location&&"location",
            ].filter(Boolean)
            })
        }
        const updateUser=await User.findByIdAndUpdate(userId,
            {
            ...req.body,
            isonBoarded:true,
            }
            ,{new:true})

        if(!updateUser) return res.status(401).json({message:"user Not found"});
       // update in stream
       try {
        await upsertStreamUser({
        id:updateUser._id.toString(),
        name:updateUser.fullName,
        image:updateUser.profilePic||"",
       });
       console.log(`Stream user updated after onboarding for ${updateUser.fullName}`);
       } catch (streamError) {
        console.log("Error updating Stream user during onboarding:",streamError.message);
       }
       
        res.status(200).json({success:true,user:updateUser});
    } catch (error) {
        console.error("onboarding error",error);
        res.status(500).json({message:"Intrenal Server Error"});
    }
}