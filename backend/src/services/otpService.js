import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import OTP from '../models/OTP.js';

export function generateOtp() {
  return String(crypto.randomInt(100000, 1000000));
}

export async function saveOtp(email, otp) {
  const normalizedEmail = email.toLowerCase();
  const otpHash = await bcrypt.hash(otp, 10);

  await OTP.deleteMany({ email: normalizedEmail });
  await OTP.create({
    email: normalizedEmail,
    otpHash,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });
}

export async function verifyOtp(email, otp) {
  const normalizedEmail = email.toLowerCase();
  const record = await OTP.findOne({ email: normalizedEmail }).sort({ createdAt: -1 });

  if (!record || record.expiresAt < new Date() || record.attempts >= 5) {
    return false;
  }

  record.attempts += 1;
  await record.save();

  return bcrypt.compare(otp, record.otpHash);
}
