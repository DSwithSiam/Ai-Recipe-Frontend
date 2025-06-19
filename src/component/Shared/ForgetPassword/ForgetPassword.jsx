

import { useState } from "react";
import registration_img from "../../../assets/image/user_login_img.jpg";
import login_img2 from "../../../assets/image/Admin_login_img.png";
import { MdEmail } from "react-icons/md";
import {  useNavigate } from "react-router-dom";
import { useForgetPasswordMutation } from "../../../Rudux/feature/authApi";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";

function ForgetPassword() {
  const [emailFocused, setEmailFocused] = useState(false);
  const navigate = useNavigate();
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  // Form submission handler
  const onSubmit = async (data) => {
    const email = data?.email?.trim(); // Trim to remove whitespace

    // Check if email is empty
    if (!email) {
      toast.error("Please enter an email address to proceed.", {
        duration: 3000,
        position: "top-right",
      });
      return;
    }

    try {
      // Store email in localStorage
      localStorage.setItem("forgetPasswordEmail", email);

      // Make API call
      const response = await forgetPassword({ email }).unwrap();
      console.log("backendResponse", response);

      // Show success toast
      toast.success("Password reset email sent successfully!", {
        duration: 3000,
        position: "top-right",
      });

      // Navigate to verification page
      navigate("/forget_password_verification");
    } catch (error) {
      // Show error toast
      toast.error(error?.data?.message || "Failed to send reset email. Please try again.", {
        duration: 3000,
        position: "top-right",
      });
      console.error("Forget password error:", error);
    }
  };

  return (
    <div className="flex items-center md:flex-row flex-col  justify-between w-full md:min-h-screen gap-10 lora">
      <div className="md:w-1/2 w-full h-screen">
        <img
          src={registration_img}
          alt="Registration illustration"
          className="w-full h-screen"
        />
      </div>
      <div className="md:w-1/2 w-full md:px-40">
        <div className="flex justify-center mb-6">
          <img src={login_img2} className="h-[150px] w-[150px]" alt="img" />
        </div>

        <div className="rounded md:px-10">
          <h2 className="text-[34px] font-bold text-center text-[#5B21BD]">
            Confirm email
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative py-10">
              <label className="block text-[20px] text-[#5B21BD] mb-2">Email</label>
              <input
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                onFocus={() => setEmailFocused(true)}
                onBlur={(e) => setEmailFocused(e.target.value !== "")}
                className='w-full px-4 py-3 border bg-[#F8FCFF] border-[#5B21BD] rounded pl-10 '
              />
              <MdEmail className="text-[#959AA6] bottom-[58px] left-3 absolute" />
             
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className={`bg-[#5B21BD] text-white rounded-[8px] mx-auto px-6 py-2 cursor-pointer w-[123px] cursor-pointer ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Toaster />
    </div>
  );
}

export default ForgetPassword;