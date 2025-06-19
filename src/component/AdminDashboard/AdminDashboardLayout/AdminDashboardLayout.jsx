import React from 'react'


import { Outlet } from 'react-router-dom'
import AdminDashboardSidebar from '../AdminDashboardSidebar/AdminDashboardSidebar'
import AdminDashboardNavbar from '../AdminDashboardNavbar.jsx/AdminDashboardNavbar'

function ChefDashboardLayout() {
    return (
        <div className='bg-gray-100'>
            <div className="flex h-screen">
                {/* Sidebar */}
                <div className=" h-full fixed transition-all duration-300 ease-in-out z-100 md:w-[240px]">
                    <div className="h-full flex flex-col justify-between">
                        {/* Sidebar Content */}
                        <AdminDashboardSidebar />
                    </div>
                </div>

                {/* Main Content Area */}

                <div className="flex flex-col md:ml-[240px] md:w-[calc(100%-240px)]">
                    {/* Navbar - Full width and above sidebar */}
                    <div
                        className="fixed top-0  transition-all duration-300 z-50 "
                        style={{
                            left: 0, // Start from the left edge of the screen
                            width: "100%", // Full width of the viewport
                        }}
                    >
                        <AdminDashboardNavbar />
                    </div>

                    {/* Outlet (Main Content) */}
                    <div className="h-full  mt-20 overflow-auto  ">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChefDashboardLayout