


import { useState } from 'react';
import { FaUserFriends } from 'react-icons/fa';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { GoGraph } from 'react-icons/go';
import { PiChefHatFill } from 'react-icons/pi';
import { RiBox3Fill } from 'react-icons/ri';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import { useChefDashboardFirstPartQuery } from '../../../Rudux/feature/ApiSlice';

// Chart data with random values between 5000 and 30000
const lineChartData = [
    { name: 'Jan', value: 12640 },
    { name: 'Feb', value: 28950 },
    { name: 'Mar', value: 15870 },
    { name: 'Apr', value: 23980 },
    { name: 'May', value: 19420 },
    { name: 'Jun', value: 26890 },
    { name: 'Jul', value: 22110 },
    { name: 'Aug', value: 17550 },
    { name: 'Sep', value: 29300 },
    { name: 'Oct', value: 14730 },
    { name: 'Nov', value: 18020 },
    { name: 'Dec', value: 25560 },
];

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

function AdminDashboard() {
    const [darkMode, setDarkMode] = useState(false);
    const [selectedMonthTotalUsers, setSelectedMonthTotalUsers] = useState('October');
    const [selectedMonthRevenue, setSelectedMonthRevenue] = useState('October');
    const [isOpenTotalUsers, setIsOpenTotalUsers] = useState(false);
    const [isOpenMonthlyRevenue, setIsOpenMonthlyRevenue] = useState(false);
    const { data: ChefDashboardFirstPart } = useChefDashboardFirstPartQuery()
    return (
        <div className="px-10 py-6 lora">
            <h2 className="text-[34px] font-semibold  text-gray-400 mb-1">Dashboard</h2>
            <p className="text-xl text-gray-400 mb-8">Welcome to your Culinary AI Platform admin dashboard</p>
            {/* Stats Cards */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Card Template */}
                {[
                    {
                        title: "Total AI Interactions",
                        value: ChefDashboardFirstPart ? ChefDashboardFirstPart.total_interactions.toLocaleString() : "0",
                        icon: <PiChefHatFill className="text-[#5B21BD] text-[25px]" />,
                        note: "+15", // You can change this dynamically if needed
                        subtext: "From last month",
                    },
                    {
                        title: "Active Subscribers",
                        value: ChefDashboardFirstPart ? ChefDashboardFirstPart.active_subscribers.toLocaleString() : "0",
                        icon: <FaUserFriends className="text-[#5B21BD] text-[25px]" />,
                        note: "3%",
                        subtext: "From last month",
                    },
                    {
                        title: "Total Recipes",
                        value: ChefDashboardFirstPart ? ChefDashboardFirstPart.total_recipes.toLocaleString() : "0",
                        icon: <RiBox3Fill className="text-[#5B21BD] text-[25px]" />,
                        note: "3+",
                        subtext: "New this week",
                    },
                    {
                        title: "Monthly revenue",
                        value: ChefDashboardFirstPart ? `$${ChefDashboardFirstPart.monthly_revenue.toLocaleString()}` : "$0",
                        icon: <GoGraph className="text-[#5B21BD] text-[25px]" />,
                        note: "10%",
                        subtext: "From last month",
                    },
                ].map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg space-y-4 border border-[#D9D9D9]">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-500 text-sm">{item.title}</p>
                                <p className="text-gray-300 text-3xl font-bold">{item.value}</p>
                            </div>
                            <div className="bg-[#8280ff1c] px-4 py-4 rounded-full">
                                {item.icon}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <div className="flex items-center gap-1 text-gray-300 ">
                                <FaArrowTrendUp />
                                <span>{item.note}</span>
                            </div>
                            <span className="text-gray-500">{item.subtext}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart Section: Total Users */}
            <div className='mt-10 shadow bg-white rounded-xl p-4'>
                <div className='flex justify-between pb-6 relative'>
                    <p className='text-[28px] font-medium text-gray-400'>Total Users</p>
                    <div className='relative'>
                        <button
                            onClick={() => setIsOpenTotalUsers(!isOpenTotalUsers)}
                            className='border border-gray-400 rounded-[10px]  text-gray-400 py-1 px-8'
                        >
                            {selectedMonthTotalUsers}
                        </button>
                        {isOpenTotalUsers && (
                            <div className='absolute right-0 mt-2 w-40 bg-white border border-gray-400 rounded-md shadow-md z-10'>
                                {months.map((month) => (
                                    <div
                                        key={month}
                                        onClick={() => {
                                            setSelectedMonthTotalUsers(month);
                                            setIsOpenTotalUsers(false);
                                        }}
                                        className='px-4 py-2 hover:bg-[#5a21bd62] hover:text-white text-gray-400 cursor-pointer'
                                    >
                                        {month}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={lineChartData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#4B5563" : "#E5E7EB"} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: darkMode ? "#D1D5DB" : "#6B7280" }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: darkMode ? "#D1D5DB" : "#6B7280" }}
                                tickFormatter={(value) => `${value / 1000}k`}
                            />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className={`px-3 py-1 rounded shadow-md text-center ${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-[#5B21BD] text-white'}`}>
                                                <p className="text-sm font-medium">{payload[0].value.toLocaleString()} users</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="50%" stopColor="#5B21BD" stopOpacity={0.8} />
                                    <stop offset="98%" stopColor="#5B21BD" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#5B21BD"
                                strokeWidth={2}
                                fill="url(#colorValue)"
                                dot={{ r: 4, fill: "#5B21BD", strokeWidth: 0 }}
                                activeDot={{ r: 6, fill: "#5B21BD", stroke: "#fff", strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Chart Section: Monthly Revenue */}
            <div className='mt-10 shadow bg-white rounded-xl p-4'>
                <div className='flex justify-between pb-6 relative'>
                    <p className='text-[28px] font-medium  text-gray-400'>Monthly Revenue</p>
                    <div className='relative'>
                        <button
                            onClick={() => setIsOpenMonthlyRevenue(!isOpenMonthlyRevenue)}
                            className='border border-gray-400 rounded-[10px]  text-gray-400 py-1 px-8'
                        >
                            {selectedMonthRevenue}
                        </button>
                        {isOpenMonthlyRevenue && (
                            <div className='absolute right-0 mt-2 w-40 bg-white border border-gray-400 rounded-md shadow-md z-10'>
                                {months.map((month) => (
                                    <div
                                        key={month}
                                        onClick={() => {
                                            setSelectedMonthRevenue(month);
                                            setIsOpenMonthlyRevenue(false);
                                        }}
                                        className='px-4 py-2 hover:bg-[#5a21bd88] text-gray-400 hover:text-white cursor-pointer'
                                    >
                                        {month}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={lineChartData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#4B5563" : "#E5E7EB"} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: darkMode ? "#D1D5DB" : "#6B7280" }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: darkMode ? "#D1D5DB" : "#6B7280" }}
                                tickFormatter={(value) => `${value / 1000}k`}
                            />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className={`px-3 py-1 rounded shadow-md text-center ${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-[#5B21BD] text-white'}`}>
                                                <p className="text-sm font-medium">${payload[0].value.toLocaleString()}</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="50%" stopColor="#5B21BD" stopOpacity={0.8} />
                                    <stop offset="98%" stopColor="#5B21BD" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#5B21BD"
                                strokeWidth={2}
                                fill="url(#colorValue)"
                                dot={{ r: 4, fill: "#5B21BD", strokeWidth: 0 }}
                                activeDot={{ r: 6, fill: "#5B21BD", stroke: "#fff", strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;