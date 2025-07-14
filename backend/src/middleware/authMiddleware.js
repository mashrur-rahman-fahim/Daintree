import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const verify= async(req,res,next)=>{
    try {
      
        const token=req.cookies.access_token;
        if(!token){
            return res.status(401).json({message:"Unauthorized"});

        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=await User.findById(decoded.id).select("-password");
        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({message:"Unauthorized"});
        
    }
}
