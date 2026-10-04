import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, ShieldCheck } from 'lucide-react';

import Logo from '../../components/common/Logo';
import { sendOtp } from '../../services/authService';
import { useToast } from '../../context/ToastContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { show } = useToast();

  const submit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      show('Please enter your email', 'error');
      return;
    }

    try {
      setLoading(true);

      await sendOtp(cleanEmail);

      show('OTP sent to your email');

      navigate(
        `/auth/verify-otp?email=${encodeURIComponent(cleanEmail)}`
      );
    } catch (error) {
      console.error('Send OTP error:', error);

      show(
        error?.response?.data?.message ||
          'Failed to send OTP',
        'error'
      );
    } finally {
      setLoading(false);
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
                WELCOME TO BUDDY AID
              </div>

              <h1 className="text-3xl font-black mt-2">
                Your safety,
                <br />
                our community.
              </h1>

              <p className="muted text-sm mt-3 leading-6">
                Sign in securely with your email and
                one-time password to access Buddy Aid.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-2xl p-4 bg-gradient-to-br from-[#fff3f5] to-[#edf4ff] border border-[#f2dfe6]">

            <ShieldCheck
              className="text-[#f31f58]"
              size={20}
            />

            <p className="font-black text-sm mt-3">
              Secure login
            </p>

            <p className="muted text-xs mt-1">
              We use OTP verification instead of
              storing passwords.
            </p>

          </div>
        </div>

        {/* Right Side */}
        <div className="p-7 md:p-10 flex flex-col justify-center">

          <div className="text-[12px] font-black text-[#f31f58] uppercase tracking-[.12em]">
            Welcome Back
          </div>

          <h2 className="text-2xl font-black mt-2">
            Sign in to Buddy Aid
          </h2>

          <p className="muted text-xs mt-1">
            Enter your email to receive a secure OTP.
          </p>

          <form
            onSubmit={submit}
            className="mt-7 space-y-5"
          >

            <label>
              <span className="label block mb-1.5">
                Email
              </span>

              <div className="relative">

                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  required
                  type="email"
                  className="field pl-11"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  disabled={loading}
                />

              </div>
            </label>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                'Sending OTP...'
              ) : (
                <>
                  Continue
                  <ArrowRight size={15} />
                </>
              )}
            </button>

          </form>

          <div className="text-center text-xs muted mt-6">
            Don't have an account?{' '}

            <Link
              className="font-black text-[#f31f58]"
              to="/auth/register"
            >
              Create Account
            </Link>
          </div>

          <div className="text-center text-xs muted mt-4">
            Need help?{' '}

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