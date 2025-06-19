import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    useRegisterVerificationMutation,
    useResendOtpMutation,
} from '../../../Rudux/feature/authApi';
import { toast, Toaster } from 'react-hot-toast';
import registration_img from '../../../assets/image/user_login_img.jpg';
import login_img2 from '../../../assets/image/Admin_login_img.png';

function Verification() {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [focused, setFocused] = useState([false, false, false, false]);
    const [otpError, setOtpError] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const inputRefs = useRef([]);
    const [registerVerification, { isLoading: isVerifying }] = useRegisterVerificationMutation();
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
    try {
        const otpCode = otp.join('');
        const email = localStorage.getItem('userEmail');
        const role = localStorage.getItem('role'); // নতুন লাইন যোগ করুন

        if (!email) {
            toast.error('Email not found. Please try registering again.');
            return;
        }

        if (otpCode.length !== 4) {
            setOtpError(true);
            toast.error('Please enter a valid 4-digit OTP.');
            return;
        }

        const response = await registerVerification({ email, otp: otpCode }).unwrap();

        toast.success('Verification successful!');
        localStorage.removeItem('userEmail');
        
        // role অনুযায়ী রাউটিং
        if (role === 'chef') {
            navigate('/chef_dashboard');
        } else {
            navigate('/dashboard');
        }
        
    } catch (error) {
        setOtpError(true);
        toast.error(error?.data?.message || 'Invalid OTP. Please try again.');
    }
};
    const handleResendOtp = async () => {
        try {
            // Get email from localStorage
            const email = localStorage.getItem('userEmail');

            if (!email) {
                toast.error('Email not found. Please try registering again.');
                return;
            }

            // Call the resendOtp mutation
            await resendOtp({ email }).unwrap();

            // Show success modal
            setIsModalOpen(true);
            // Start 30-second cooldown for resend
            setResendCooldown(30);

            // Countdown timer
            const timer = setInterval(() => {
                setResendCooldown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to resend OTP. Please try again.');
        }
    };

    // Auto-close modal after 2 seconds
    useEffect(() => {
        if (isModalOpen) {
            const timer = setTimeout(() => {
                setIsModalOpen(false);
            }, 2000); // 2 seconds

            // Cleanup the timer on component unmount or if modal state changes
            return () => clearTimeout(timer);
        }
    }, [isModalOpen]);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            setIsModalOpen(false);
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
                            We've sent a 4-digit verification code to your email address. Please enter it below to reset your password.
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
                                    className={`w-12 h-12 text-center text-xl border rounded-full pt-2 transition-all focus:outline-none focus:ring-2 ${otpError ? 'border-red-500 animate-shake' : 'border-gray-300 focus:ring-[#5B21BD]'
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="text-sm text-gray-600">
                            Didn't receive a code?{' '}
                            <button
                                onClick={handleResendOtp}
                                disabled={isResending || resendCooldown > 0}
                                className={`text-[#5B21BD] underline focus:outline-none ${isResending || resendCooldown > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:text-[#4A1A9C]'
                                    }`}
                            >
                                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                            </button>
                        </p>
                        <button
                            onClick={handleSubmit}
                            disabled={isVerifying}
                            className={`w-1/2 bg-[#5B21BD] text-white py-3 rounded-lg font-semibold transition-all ${isVerifying ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#4A1A9C]'
                                }`}
                        >
                            {isVerifying ? 'Verifying...' : 'Confirm'}
                        </button>
                    </div>
                </div>
                <Toaster position="top-right" />
            </div>

            {/* Modal for successful resend */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50"
                    onClick={handleBackdropClick}
                >
                    <div className="bg-white rounded-lg p-6 w-96 shadow-lg space-y-8 py-10">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full mx-auto bg-[#5B21BD] text-white">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <p className="text-[#012939] text-[20px] font-medium text-center">
                            Code has been sent again
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Verification;