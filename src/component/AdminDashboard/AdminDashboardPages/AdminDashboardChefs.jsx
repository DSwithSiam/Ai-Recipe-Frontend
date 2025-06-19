


import React from 'react';

// JSON data
const chefsData = [
    {
        Chef: "John Smith",
        Email: "Pappyroy69331@gmail.com",
        Specialty: "Chocolate/Bonbons",
        Subscribers: 8000,
        Recipes: 45,
        Revenue: 8750,
        Status: "Active",
    },
    {
        Chef: "John Smith",
        Email: "Pappyroy69331@gmail.com",
        Specialty: "Ice Cream",
        Subscribers: 8000,
        Recipes: 45,
        Revenue: 8750,
        Status: "In active",
    },
    {
        Chef: "John Smith",
        Email: "Pappyroy69331@gmail.com",
        Specialty: "Pastry",
        Subscribers: 8000,
        Recipes: 45,
        Revenue: 8750,
        Status: "Active",
    },
    {
        Chef: "John Smith",
        Email: "Pappyroy69331@gmail.com",
        Specialty: "Chocolate",
        Subscribers: 8000,
        Recipes: 45,
        Revenue: 8750,
        Status: "Active",
    },
    {
        Chef: "John Smith",
        Email: "Pappyroy69331@gmail.com",
        Specialty: "Chocolate",
        Subscribers: 8000,
        Recipes: 45,
        Revenue: 8750,
        Status: "Active",
    },
    {
        Chef: "John Smith",
        Email: "Pappyroy69331@gmail.com",
        Specialty: "Chocolate",
        Subscribers: 8000,
        Recipes: 45,
        Revenue: 8750,
        Status: "Pending",
    },
    {
        Chef: "John Smith",
        Email: "Pappyroy69331@gmail.com",
        Specialty: "Chocolate",
        Subscribers: 8000,
        Recipes: 45,
        Revenue: 8750,
        Status: "Active",
    },
];

const AdminDashboardChefs = () => {
    return (
        <div className='px-10 py-6'>
            <p className='text-[30px] text-[#5B21BD] font-semibold mb-4'>Manage Chefs & Influencers</p>

            <div className="overflow-x-auto rounded-lx">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-[#CCBAEB] text-[#5B21BD] uppercase text-sm">
                            <th className="py-3 px-4 text-left">Chef</th>
                            <th className="py-3 px-4 text-left">Specialty</th>
                            <th className="py-3 px-4 text-left">Subscribers</th>
                            <th className="py-3 px-4 text-left">Recipes</th>
                            <th className="py-3 px-4 text-left">Revenue</th>
                            <th className="py-3 px-4 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chefsData.map((chef, index) => (
                            <tr
                                key={index}
                                className='border-b border-b-[#CCBAEB]'
                            >
                                <td className="py-3 px-4 flex items-center">
                                    <img
                                        src="https://i.ibb.co.com/60hvPZRS/bannerimg-01.png"
                                        alt={`${chef.Chef}'s profile`}
                                        className="w-10 h-10 rounded-full object-cover mr-3"
                                    />
                                    <div>
                                        <div className="font-medium  capitalize">{chef.Chef}</div>
                                        <div className="text-xs text-gray-500">{chef.Email}</div>
                                    </div>
                                </td>
                                <td className="py-3 px-4">{chef.Specialty}</td>
                                <td className="py-3 px-4">{chef.Subscribers}</td>
                                <td className="py-3 px-4">{chef.Recipes}</td>
                                <td className="py-3 px-4">${chef.Revenue}</td>
                                <td className="py-3 px-4">
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${chef.Status === 'Active'
                                                ? 'bg-green-500 text-white'
                                                : chef.Status === 'In active'
                                                    ? 'bg-red-500 text-white'
                                                    : 'bg-yellow-400 text-gray-800'
                                            }`}
                                    >
                                        {chef.Status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboardChefs;