import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

import Logo from '../../components/common/Logo';
import { verifyOtp, sendOtp } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function VerifyOTP() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { login } = useAuth();
  const { show } = useToast();

  const emailFromUrl = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailFromUrl);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    if (!cleanEmail) {
      show('Please enter your email', 'error');
      return;
    }

    if (!/^\d{6}$/.test(cleanOtp)) {
      show('Please enter a valid 6-digit OTP', 'error');
      return;
    }

    try {
      setLoading(true);

      // authService.js expects verifyOtp(email, otp)
      const response = await verifyOtp(cleanEmail, cleanOtp);

      const data = response?.data;

      if (!data?.success || !data?.token || !data?.user) {
        throw new Error(data?.message || 'Login failed');
      }

      const user = data.user;
      const token = data.token;

      // Save real MongoDB user and JWT
      login(user, token);

      show('Login successful!');

      // Admin goes to admin dashboard
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('OTP verification error:', error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Invalid or expired OTP';

      show(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      show('Please enter your email', 'error');
      return;
    }

    try {
      setResending(true);

      await sendOtp(cleanEmail);

      setOtp('');
      show('New OTP sent to your email');
    } catch (error) {
      console.error('Resend OTP error:', error);

      show(
        error?.response?.data?.message ||
          'Failed to resend OTP',
        'error'
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-shell page-bg">
      <div className="auth-box">

        {/* Left Side */}
        <div className="soft-card p-7 md:p-9 flex flex-col justify-between overflow-hidden relative">
          <div>
            <Logo />

            <div className="mt-14">
              <div className="text-xs font-black text-[#f31f58]">
                VERIFY YOUR ACCOUNT
              </div>

              <h1 className="text-3xl font-black mt-2">
                One more step.
              </h1>

              <p className="muted text-sm mt-2 leading-6">
                Enter the one-time code sent to your email
                to securely access Buddy Aid.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-2xl p-4 bg-gradient-to-br from-[#fff3f5] to-[#edf4ff] border border-[#f2dfe6]">
            <ShieldCheck
              className="text-[#f31f58]"
              size={20}
            />

            <p className="font-black text-sm mt-3">
              Secure OTP verification
            </p>

            <p className="muted text-xs mt-1">
              Your account role and permissions are loaded
              securely after verification.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-7 md:p-10 flex flex-col justify-center">

          <div className="text-[12px] font-black text-[#f31f58] uppercase tracking-[.12em]">
            Verification
          </div>

          <h2 className="text-2xl font-black mt-2">
            Verify OTP
          </h2>

          <p className="muted text-xs mt-1">
            Enter the 6-digit code sent to your email.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-4"
          >

            {/* Email */}
            <label>
              <span className="label block mb-1.5">
                Email
              </span>

              <input
                required
                type="email"
                className="field"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </label>

            {/* OTP */}
            <label>
              <span className="label block mb-1.5">
                OTP
              </span>

              <input
                required
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                className="field text-center tracking-[0.4em] font-black"
                placeholder="000000"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/\D/g, '')
                    .slice(0, 6);

                  setOtp(value);
                }}
                disabled={loading}
              />
            </label>

            {/* Verify Button */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading || otp.length !== 6}
            >
              {loading ? (
                <>
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                  Verifying...
                </>
              ) : (
                <>
                  Verify & Continue
                  <ArrowRight size={15} />
                </>
              )}
            </button>

          </form>

          {/* Resend OTP */}
          <button
            type="button"
            onClick={resendOtp}
            disabled={resending || loading}
            className="btn btn-outline w-full mt-3"
          >
            {resending ? (
              <>
                <Loader2
                  size={14}
                  className="animate-spin"
                />
                Sending...
              </>
            ) : (
              'Resend OTP'
            )}
          </button>

          {/* Back */}
          <button
            type="button"
            onClick={() => navigate('/auth/login')}
            className="flex items-center justify-center gap-2 text-xs font-black text-[#25304d] mt-6"
          >
            <ArrowLeft size={14} />
            Back to Login
          </button>

          {/* Support */}
          <div className="text-center text-xs muted mt-6">
            Having trouble?{' '}

            <Link
              className="font-black text-[#f31f58]"
              to="/support"
            >
              Contact Support
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}