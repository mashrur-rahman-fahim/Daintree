import express from "express";
import { verify } from "../middleware/authMiddleware.js";
import {registerUser,loginUser,profile,logout, getProfile} from '../controllers/userController.js';

const router=express.Router();
router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/profile',verify,profile);
router.get('/logout',verify,logout);
router.get('/getProfile',verify,getProfile);

export default router;