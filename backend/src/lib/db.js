import mongoose from "mongoose";

export const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log(`mongo db connected:${conn.connection.host}`);
    }
    catch(error){
        console.log("Error in connectiong MongoDb",error);
        process.exit(1);
    }
    
}