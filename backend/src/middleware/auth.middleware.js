import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function protectRoute(req, res, next) {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - no token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    // ✅ FIX: pass filter object to findOne
    const user = await User.findOne({ _id: decoded.userId }).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protect Route", error);
    return res.status(401).json({ message: "Unauthorized - Token error" });
  }
}
