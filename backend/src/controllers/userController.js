import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import User from "../models/user.js";
import Order from "../models/order.js";
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword });

      const token = generateToken(newUser._id);
      res.cookie("access_token", token, { httpOnly: true });
      await newUser.save();
      return res.status(201).json({ message: "User created successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user" });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res.cookie("access_token", token, { httpOnly: true });

    return res.status(200).json({ message: "User logged in successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error logging in user" });
  }
};
export const profile = async (req, res) => {
  try {
    const user = req.user._id;

    res.status(200).json( user );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting user profile" });
  }
};
export const getProfile=async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "orderHistory.orderId",
        populate: {
          path: "items._id",
        }
      });
    
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting user profile" });
  }
}
export const logout = (req, res) => {
  try {
    res.clearCookie("access_token",{httpOnly:true});
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error logging out user" });
  }
};
