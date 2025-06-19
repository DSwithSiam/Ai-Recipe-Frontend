


import { useState } from 'react';
import login_img from '../../../assets/image/user_login_img.jpg';
import login_img2 from '../../../assets/image/Admin_login_img.png';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../../Rudux/feature/authApi';
import { toast, Toaster } from 'react-hot-toast';

// Utility function for email validation
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function UserSignin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!email || !password) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    const loginData = { email, password};

//     try {
//       const response = await login(loginData).unwrap();
//       console.log('Login response:', response);

//       // Store tokens in localStorage
//       if (response.access_token) {
//         localStorage.setItem('access_token', response.access_token);
//         localStorage.setItem('refresh_token', response.refresh_token);
        
//         // Store user data including role
//         if (response.user) {
//           localStorage.setItem('role', response.user.role);
//           console.log(response.user.role)
//           localStorage.setItem('userData', JSON.stringify(response.user));
//         }
//       }

//       // Store tokens only if rememberMe is checked
//       if (rememberMe) {
//         localStorage.setItem('authToken', response.access_token);
//       }

//   if (response?.role) {
//   const role = response?.role;

//   toast.success('Login successful!');

//   if (role === 'chef') {
//     navigate('/chef_dashboard');
//   } else if (role === 'admin') {
//     navigate('/Admin_Dashboard');
//   } else {
//     navigate('/dashboard');
//   }
// } else {
//   toast.error("User role not found in response!");
// }


      

//     } catch (err) {
//       console.error('Login error:', err);
//       const errorMessage = err?.data?.message || err?.message || 'Login failed. Please try again.';
//       toast.error(errorMessage);
//     }


try {
  const response = await login(loginData).unwrap();
  console.log('Login response:', response);

  if (response.access_token) {
  
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);

    //  Role and User Data Save
    if (response) {
      const  role  = response.role;
      localStorage.setItem('role', response.role); 
      
      toast.success('Login successful!');

      //  Role-based navigation
      if (role === 'chef') {
        navigate('/chef_dashboard');
      } else if (role === 'admin') {
        navigate('/Admin_Dashboard');
      } else {
        navigate('/dashboard'); // user
      }
    } else {
      toast.error('User info missing in response!');
    }
  }

  if (rememberMe) {
    localStorage.setItem('authToken', response.access_token);
  }

} catch (err) {
  console.error('Login error:', err);
  const errorMessage = err?.data?.message || err?.message || 'Login failed. Please try again.';
  toast.error(errorMessage);
}

  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-full min-h-screen gap-10 p-4 md:p-0 font-lora bg-gray-50">
      <div className="md:w-1/2 w-full">
        <img
          src={login_img}
          alt="Login illustration"
          className="md:h-screen w-full"
        />
      </div>
      <div className="md:w-1/2 w-full md:px-40 px-4">
        <div className="flex justify-center mb-6">
          <img
            src={login_img2}
            className="h-[120px] w-[120px]"
            alt="Admin login illustration"
          />
        </div>
        <h1 className="text-3xl md:text-4xl text-[#5B21BD] font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-[#A8A8A8] text-sm md:text-base text-center mb-8">
          Enter your email & password to access your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-[#5B21BD] mb-2 text-md font-medium">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border bg-[#F8FCFF] border-[#5B21BD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B21BD] transition-all"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[#5B21BD] mb-2 text-md font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border bg-[#F8FCFF] border-[#5B21BD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B21BD] pr-12 transition-all"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5B21BD] hover:text-[#4A1A9C] transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <IoEyeOffOutline size={22} /> : <IoEyeOutline size={22} />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2 h-5 w-5 text-[#5B21BD] border-[#5B21BD] rounded focus:ring-[#5B21BD] cursor-pointer"
                disabled={isLoading}
              />
              <label htmlFor="rememberMe" className="text-[#5B21BD] text-sm cursor-pointer">
                Remember me
              </label>
            </div>
            <Link
              to="/forget_password"
              className="text-[#5B21BD] text-sm hover:underline transition-all"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#5B21BD] text-white rounded-lg px-6 py-3 mt-6 text-lg font-semibold transition-all cursor-pointer ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#4A1A9C] hover:shadow-md'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-[#5B21BD] font-medium hover:underline transition-all"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#5B21BD',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
    </div>
  );
}

export default UserSignin;