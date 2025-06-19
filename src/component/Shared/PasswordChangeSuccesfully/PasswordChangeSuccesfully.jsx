
import { Link } from 'react-router-dom';
import registration_img from '../../../assets/image/user_login_img.jpg'; // Adjust path as needed
import registration_img2 from '../../../assets/image/Admin_login_img.png'; // Adjust path as needed

function PasswordChangeSuccesfully() {
  return (
    <div className="flex items-center justify-between w-full md:min-h-screen gap-10 lora">
      <div className="w-1/2 md:h-screen">
        <img
          src={registration_img}
          alt="Registration illustration"
          className="w-full md:h-screen"
        />
      </div>
      <div className="w-1/2 lg:px-40">
        <div className="flex justify-center mb-6">
          <img src={registration_img2 } className='w-[150px] h-[150px]' alt="" />
        </div>
        <div className="p-4">
          <div className="w-full rounded-lg bg-[#F8FCFF] py-14 shadow-md">
            <div className="flex flex-col items-center justify-center space-y-6">
              {/* Success Icon */}
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#5B21BD] text-white">
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

              {/* Success Message */}
              <h2 className="text-center text-lg font-medium text-[#012939]">
                Password changed successfully
              </h2>

              {/* Back to Login Button */}
              <Link
                to="/signin"
                className="flex items-center justify-center rounded-[8px] bg-[#5B21BD] px-4 py-2 text-[#F6F8FA] w-[194px] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordChangeSuccesfully;