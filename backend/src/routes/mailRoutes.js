import express from 'express';
import { sendMailTest, verifyOtp } from '../controllers/emailVerficationController.js';
import { verify } from '../middleware/authMiddleware.js';
const router = express.Router();
router.get('/send-mail-test', sendMailTest);


router.post('/verify-otp', verify, verifyOtp);
export default router;