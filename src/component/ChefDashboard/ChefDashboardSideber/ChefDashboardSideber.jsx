


import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { IoReorderThreeOutline, IoSettingsOutline } from "react-icons/io5";

import login_img2 from '../../../assets/image/Admin_login_img.png';
import { FaBrain, FaChessQueen, FaCloudRain, FaUsers } from "react-icons/fa";
import { GiAchievement } from "react-icons/gi";
import { useEffect, useState } from "react";
import { PiChefHatFill } from "react-icons/pi";
import { MdOutlineDashboard } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { RiLogoutCircleLine } from "react-icons/ri";
import { BsFillChatDotsFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { logout } from "../../../Rudux/feature/authSlice";

const ChefDashboardSideber = () => {

    const navigate = useNavigate();
    const token =
        useSelector((state) => state.auth.token) ||
        localStorage.getItem("refresh_token");
    useEffect(() => {
        if (!token) {
            navigate("/signin");
        }
        console.log("Token:", token);
    }, [token, navigate]);
    const dispatch = useDispatch();
    const location = useLocation();
    const isProjectActive = location.pathname.startsWith('/dashboard/user_notifications');
    const isDashboardActive = ["/chef_dashboard", "/chef_all_recipes/chef_recipese_dettails_view", "/dashboard/createBuyerOrder", "/dashboard/buyer_candidate_list"].includes(location.pathname);


    // State to control sidebar visibility on small devices
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Function to toggle sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("authToken");
        localStorage.removeItem("role");
     

        navigate("/signin");
        toast.success("Logout successful!");
    };

    return (
        <div className="lora">
            {/* Toggle Icon for Small Devices */}
            <div className="md:hidden flex justify-start p-4 bg-[#CCBAEB]">
                <IoReorderThreeOutline
                    className="h-8 w-8 text-[#004C3F] cursor-pointer"
                    onClick={toggleSidebar}
                />
            </div>

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#CCBAEB] pt-10 lora transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:relative md:translate-x-0 md:block h-screen `}
            >
                <NavLink className="flex justify-center">
                    <img src={login_img2} alt="logo" className="w-[129px] h-[110px]" />
                </NavLink>
                <div className="flex flex-col gap-2 pt-5 mx-5 h-full">
                    <NavLink
                        to="/chef_dashboard"

                        className={`flex items-center gap-3 px-3 py-3 transition-colors duration-200 ${isDashboardActive ?
                            'bg-[#5B21BD]  text-white rounded-md' : 'text-[#5B21BD] hover:bg-[#9f7addef] hover:text-white rounded-md'
                            }`}

                    >
                        <MdOutlineDashboard className="h-6 w-6" />
                        <h1 className="text-lg font-medium text-white">Dashboard</h1>
                    </NavLink>



                    <NavLink
                        to="/chef_dashboard/chef_all_recipes"
                        className={() =>
                            location.pathname.startsWith('/chef_dashboard/chef_all_recipes') ||
                                location.pathname.startsWith('/chef_dashboard/chef_recipese_edit_page') ||
                                location.pathname.startsWith('/chef_dashboard/chef_recipese_addd_page')
                                ? 'flex items-center gap-3 px-3 py-2 bg-[#5B21BD] text-white rounded-md w-full'
                                : 'flex items-center gap-3 px-3 py-2 text-[#5B21BD] hover:bg-[#9f7addef] hover:text-white rounded-md w-full'
                        }
                    >
                        <PiChefHatFill className="h-6 w-6" />
                        <h1 className="text-lg font-medium text-white">Recipes</h1>
                    </NavLink>
                    <NavLink
                        to="/chef_dashboard/chef_ai_chat"
                        className={() =>
                           
                                location.pathname.startsWith('/chef_dashboard/chef_ai_chat') ||
                                location.pathname.startsWith('/chef_dashboard/chef_inspiration')
                                ? 'flex items-center gap-3 px-3 py-2 bg-[#5B21BD] text-white rounded-md w-full'
                                : 'flex items-center gap-3 px-3 py-2 text-[#5B21BD] hover:bg-[#9f7addef] hover:text-white rounded-md w-full'
                        }
                    >
                        <BsFillChatDotsFill className="h-6 w-6" />
                        <h1 className="text-lg font-medium text-white">AI Chat</h1>
                    </NavLink>

                    <NavLink
                        to="/chef_dashboard/ai_training"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 transition-colors duration-200 w-full ${isActive
                                ? 'bg-[#5B21BD] text-white rounded-md'
                                : 'text-[#5B21BD] hover:bg-[#9f7addef] hover:text-white rounded-md'
                            }`
                        }
                    >
                        <FaBrain className="h-6 w-6" />
                        <h1 className="text-lg font-medium text-white">AI Training</h1>
                    </NavLink>

                    <NavLink
                        to="/chef_dashboard/user_feedback"
                        className={({ isActive }) =>

                            `flex items-center gap-3 px-3 py-2 transition-colors duration-200 w-full ${isActive
                                ? 'bg-[#5B21BD] text-white rounded-md'
                                : 'text-[#5B21BD] hover:bg-[#9f7addef] hover:text-white rounded-md'
                            }`
                        }
                    >
                        <FaUsers className="h-6 w-6" />
                        <h1 className="text-lg font-medium text-white">User Feedback</h1>
                    </NavLink>



                    <NavLink
                        to="/chef_dashboard/chef_subscribtion"
                        className={() =>
                            location.pathname.startsWith('/chef_dashboard/chef_subscribtion') ||
                                location.pathname.startsWith('/chef_dashboard/add_new_plan')
                                ? 'flex items-center gap-3 px-3 py-2 bg-[#5B21BD] text-white rounded-md w-full'
                                : 'flex items-center gap-3 px-3 py-2 text-[#5B21BD] hover:bg-[#9f7addef] hover:text-white rounded-md w-full'
                        }
                    >
                        <FaChessQueen className="h-6 w-6" />
                        <h1 className="text-lg font-medium text-white">Subscription</h1>
                    </NavLink>


                    <NavLink
                        to="/chef_dashboard/chef_community"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 transition-colors duration-200 w-full ${isActive
                                ? 'bg-[#5B21BD] text-white rounded-md'
                                : 'text-[#5B21BD] hover:bg-[#9f7addef] hover:text-white rounded-md'
                            }`
                        }
                    >
                        <FaPeopleGroup className="h-6 w-6" />
                        <h1 className="text-lg font-medium text-white">Community</h1>
                    </NavLink>
                    <NavLink
                        to="/chef_dashboard/branding"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 transition-colors duration-200 w-full ${isActive
                                ? 'bg-[#5B21BD] text-white rounded-md'
                                : 'text-[#5B21BD] hover:bg-[#9f7addef] hover:text-white rounded-md'
                            }`
                        }
                    >
                        <GiAchievement className="h-6 w-6" />
                        <h1 className="text-lg font-medium text-white">Branding</h1>
                    </NavLink>
                    <NavLink
                        to="/chef_dashboard/chef_settings_privecy"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 transition-colors duration-200 w-full ${isActive
                                ? 'bg-[#5B21BD] text-white rounded-md'
                                : 'text-[#5B21BD] hover:bg-[#9f7addef] hover:text-white rounded-md'
                            }`
                        }
                    >
                        <IoSettingsOutline className="h-6 w-6" />
                        <h1 className="text-lg font-medium text-white">Profile & setting</h1>
                    </NavLink>
                    {/* <NavLink to='/signin' className='flex items-center gap-2 justify-center   text-gray-50  h-full '>
                        <RiLogoutCircleLine /> <p>Logout</p>
                    </NavLink> */}
                    <button
                        className="w-full flex items-center gap-2 justify-center text-[#5B21BD] h-full cursor-pointer"
                        onClick={handleLogout}
                    >
                        <RiLogoutCircleLine /> <p>Logout</p>
                    </button>
                </div>
            </div>

            {/* Overlay for Small Devices */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0  bg-opacity-50 z-40 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </div>
    );
};

export default ChefDashboardSideber;