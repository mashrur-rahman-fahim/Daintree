import User from "../models/user.js";
import { sendOtp } from "./emailVerficationController.js";
import bcrypt from "bcrypt";
export const forgotPassword=async(req,res)=>{
    try {
        const email = req.body.email;
        const userExist = await User.findOne({ email });
        if (!userExist) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        // Generate OTP and send email
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
        const user = await User.findOneAndUpdate(
            { email },
            { otp, otpExpiresAt },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await sendOtp(email, otp);
        res.status(200).json({ message: "OTP sent to email" });
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const verifyResetCode = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }
    
        const user = await User.findOne({email});
        if(!user || user.otp !== otp || user.otpExpiresAt < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }
    
       
     
    
        // Proceed to reset password or verify signup
        res.status(200).json({ message: "Code verified successfully" });
    } catch (error) {
        console.error("Error verifying reset code:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            return res.status(400).json({ message: "Email and new password are required" });
        }
    
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!user.otp || user.otpExpiresAt < Date.now()) {
            user.otp = null; // Clear OTP if it is invalid or expired
            user.otpExpiresAt = null;
            return res.status(400).json({ message: "OTP is invalid or expired." });
        }
       const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword; // Assuming password is hashed before saving
        user.otp = null; // Clear OTP after successful password reset
        user.otpExpiresAt = null; // Clear OTP expiration time
        await user.save();
       
        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}