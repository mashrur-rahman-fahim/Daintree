import express from "express";
import { verify } from "../middleware/authMiddleware.js";
import {registerUser,loginUser,profile,logout, getProfile, updateProfile, deleteProfile, totalUsers} from '../controllers/userController.js';
import { forgotPassword, resetPassword, verifyResetCode } from "../controllers/PasswordController.js";

const router=express.Router();
router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/profile',verify,profile);
router.get('/logout',verify,logout);
router.get('/getProfile',verify,getProfile);
router.put('/updateProfile', verify, updateProfile);
router.delete('/deleteProfile',verify,deleteProfile);
router.post('/forgotPassword', forgotPassword);
router.post('/verifyResetCode', verifyResetCode);
router.post('/resetPassword',resetPassword);
router.get('/total',totalUsers);
export default router;