




import { useState } from 'react';
import login_img from '../../../assets/image/user_login_img.jpg';
import login_img2 from '../../../assets/image/Admin_login_img.png';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../../Rudux/feature/authApi';
import { toast, Toaster } from 'react-hot-toast'; // ✅ use only react-hot-toast

function UserSignup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setrole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !password || !confirmPassword || !role) {
      toast.error('Please fill in all required fields.');
      return;
    }


    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    const signupData = {
      name,
      email,
      phone,
      password,
      role
    };
    console.log('signupData:', signupData);

    try {
      await register(signupData).unwrap();


      localStorage.setItem("userEmail", email); // Store email in localStorage
 localStorage.setItem("role", role); 
      toast.success('Registration successful!');
      
      navigate('/verification');
    } catch (err) {
      toast.error(err?.data?.message || 'Registration failed.');
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="flex flex-col items-center md:flex-row justify-between w-full md:min-h-screen gap-10 md:p-0 p-4 font-lora">
     

      <div className="md:w-1/2 w-full md:h-screen ">
        <img
          src={login_img}
          alt="Registration illustration"
          className="md:h-screen w-full"
        />
      </div>
      <div className="md:w-1/2 w-full md:px-40">
        <div className="flex justify-center">
          <img
            src={login_img2}
            className="h-32 w-32"
            alt="Admin login illustration"
          />
        </div>
        <h1 className="text-5xl text-[#5B21BD] font-bold text-center">Welcome</h1>
        <p className="text-[#A8A8A8] text-base text-center mb-3">
          Enter your details to create an account
        </p>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label htmlFor="name" className="block text-[#5B21BD] mb-1 text-xl">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border bg-[#F8FCFF] border-[#5B21BD] rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-[#5B21BD] mb-1 text-xl">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border bg-[#F8FCFF] border-[#5B21BD] rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-[#5B21BD] mb-1 text-xl">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border bg-[#F8FCFF] border-[#5B21BD] rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-[#5B21BD] mb-1 text-xl">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border bg-[#F8FCFF] border-[#5B21BD] rounded-lg pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5B21BD]"
              >
                {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-[#5B21BD] mb-1 text-xl">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border bg-[#F8FCFF] border-[#5B21BD] rounded-lg pr-10"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5B21BD]"
              >
                {showConfirmPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="role" className="block text-[#5B21BD] mb-1 text-xl">
              Account Type
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setrole(e.target.value)}
              className="w-full px-4 py-2 border bg-[#F8FCFF] border-[#5B21BD] rounded-lg"
            >
              <option value="" disabled>Select</option>
              <option value="user">User</option>
              <option value="chef">Chef</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#5B21BD] text-white rounded-lg px-6 py-2 mt-4 text-xl ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
          <p className="text-base text-[#3E3E3E] text-center py-4">
            Already have an account?{' '}
            <Link to="/signin" className="text-[#5B21BD] underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>

      {/*  Toast container */}
      <Toaster position="top-right" />
    </div>
  );
}

export default UserSignup;



