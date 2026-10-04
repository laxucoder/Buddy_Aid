import User from '../models/User.js';
import { generateOtp, saveOtp, verifyOtp } from '../services/otpService.js';
import { sendOtpEmail } from '../services/emailService.js';
import { signToken } from '../services/tokenService.js';
import { isEmail } from '../utils/validateEmail.js';

export async function sendOtp(req, res, next) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();

    if (!isEmail(email)) {
      return res.status(400).json({ success: false, message: 'A valid email is required' });
    }

    const otp = generateOtp();

    if (process.env.MONGODB_URI) {
      await saveOtp(email, otp);
    }

    await sendOtpEmail({ to: email, otp });
    return res.json({ success: true, message: 'OTP sent' });
  } catch (error) {
    return next(error);
  }
}

export async function verifyOtpController(req, res, next) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const otp = String(req.body.otp || '').trim();

    if (!isEmail(email) || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Valid email and 6-digit OTP are required',
      });
    }

    if (process.env.MONGODB_URI && !(await verifyOtp(email, otp))) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    let user = process.env.MONGODB_URI ? await User.findOne({ email }) : null;

    if (!user && process.env.MONGODB_URI) {
      user = await User.create({
        email,
        name: req.body.name || email.split('@')[0],
      });
    }

    const payload = user || { id: 'demo-user', email, role: 'user' };
    const token = signToken(payload);

    return res.json({ success: true, token, user: payload });
  } catch (error) {
    return next(error);
  }
}
