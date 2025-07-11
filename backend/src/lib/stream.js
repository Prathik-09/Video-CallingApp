import dotenv from "dotenv";
dotenv.config();

import { StreamChat } from "stream-chat";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("❌ Stream API key or secret is missing");
}

export const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUser(userData);
    return userData;
  } catch (error) {
    console.error("❌ Error upserting user", error);
  }
};


export const generateStreamToken=(userId)=>{
  try{
    const userIdStr=userId.toString();
    return streamClient.createToken(userIdStr);
  }
  catch(error){
    console.log("Error genrating Stream Token",error);
  }
   
}