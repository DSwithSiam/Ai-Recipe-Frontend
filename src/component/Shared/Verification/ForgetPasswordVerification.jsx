


import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useForgetpasswordVerificationMutation,
 
  useResendOtpMutation,
} from '../../../Rudux/feature/authApi';
import { toast, Toaster } from 'react-hot-toast';
import registration_img from '../../../assets/image/user_login_img.jpg';
import login_img2 from '../../../assets/image/Admin_login_img.png';

function ForgetPasswordVerification() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [focused, setFocused] = useState([false, false, false, false]);
  const [otpError, setOtpError] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0); // Cooldown state for resend button
  const inputRefs = useRef([]);
  const [forgetpasswordVerification, { isLoading: isVerifying }] = useForgetpasswordVerificationMutation();
 // Not used, kept for consistency
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const navigate = useNavigate();

  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleFocus = (index) => {
    setFocused((prev) => {
      const newFocused = [...prev];
      newFocused[index] = true;
      return newFocused;
    });
  };

  const handleBlur = (index) => {
    setFocused((prev) => {
      const newFocused = [...prev];
      newFocused[index] = false;
      return newFocused;
    });
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{4}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[3].focus();
    }
  };

  const handleSubmit = async () => {
    const email = localStorage.getItem('forgetPasswordEmail');
    const otpString = otp.join('');

    if (!email) {
      toast.error('Email not found. Please request a new reset link.');
      return;
    }

    if (otpString.length !== 4 || !/^\d{4}$/.test(otpString)) {
      toast.error('Please enter a valid 4-digit OTP.');
      return;
    }

    const verificationData = { email, otp: otpString };

    try {
      const res = await forgetpasswordVerification(verificationData).unwrap();
      if (res.access_token) {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('refresh_token', res.refresh_token);
      }
      toast.success(res.message || 'OTP verified successfully!');
      localStorage.setItem('otp', otpString);
      navigate('/new_password');
    } catch (error) {
      const errorMessage = error?.data?.message || 'OTP verification failed!';
      toast.error(errorMessage);
      setOtp(['', '', '', '']);
      setOtpError(true);
      inputRefs.current[0].focus();
      setTimeout(() => setOtpError(false), 500);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) {
      toast.error(`Please wait ${resendCooldown} seconds before resending.`);
      return;
    }

    const email = localStorage.getItem('forgetPasswordEmail');
    if (!email) {
      toast.error('Email not found. Please request a new reset link.');
      return;
    }

    try {
      const res = await resendOtp({ email }).unwrap();
      toast.success(res.message || 'A new verification code has been sent to your email!');
      setOtp(['', '', '', '']);
      inputRefs.current[0].focus();
      setResendCooldown(60); // Set 60-second cooldown
      const countdown = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      const errorMessage = error?.data?.message || 'Failed to resend OTP!';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex w-full md:flex-row flex-col min-h-screen justify-between items-center lora">
      <div className="md:w-1/2 w-full md:h-screen">
        <img src={registration_img} alt="Registration illustration" className="md:h-screen w-full" />
      </div>
      <div className="md:w-1/2 w-full md:px-40 py-8">
        <img src={login_img2} className="h-[120px] w-[120px] mb-8 mx-auto" alt="Logo" />
        <div className="w-full px-4">
          <div className="text-center space-y-6">
            <h1 className="text-2xl text-[#5B21BD] font-semibold">Verify Your Email</h1>
            <p className="text-sm text-gray-600">
              We&apos;ve sent a 4-digit verification code to your email address. Please enter it below to reset your password.
            </p>
            <h2 className="text-xl font-bold text-[#5B21BD]">Enter Verification Code</h2>
            <div className="flex justify-center space-x-4 my-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="tel"
                  maxLength="1"
                  aria-label={`OTP digit ${index + 1}`}
                  placeholder={focused[index] || digit ? '' : '*'}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={() => handleFocus(index)}
                  onBlur={() => handleBlur(index)}
                  onPaste={handlePaste}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className={`w-12 h-12 text-center text-xl border rounded-full pt-2 transition-all focus:outline-none focus:ring-2 ${
                    otpError ? 'border-red-500 animate-shake' : 'border-gray-300 focus:ring-[#5B21BD]'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">
              Didn&apos;t receive a code?{' '}
              <button
                onClick={handleResendOtp}
                disabled={isResending || resendCooldown > 0}
                className={`text-[#5B21BD] underline focus:outline-none ${
                  isResending || resendCooldown > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:text-[#4A1A9C]'
                }`}
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
              </button>
            </p>
            <button
              onClick={handleSubmit}
              disabled={isVerifying}
              className={`w-1/2 bg-[#5B21BD] text-white py-3 rounded-lg font-semibold transition-all cursor-pointer ${
                isVerifying ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#4A1A9C]'
              }`}
            >
              {isVerifying ? 'Verifying...' : 'Confirm'}
            </button>
          </div>
        </div>
        <Toaster position="top-right" />
      </div>
    </div>
  );
}

export default ForgetPasswordVerification;
