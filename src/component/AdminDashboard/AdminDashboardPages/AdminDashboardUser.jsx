


import React, { useState } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';

function AdminDashboardUser() {
  const [userData, setUserData] = useState([
    {
      user: { name: 'John Smith', email: 'p13231233@gmail.com' },
      subscribed_to: 'Chef Mario',
      status: 'Active',
      join_date: 'Jan 15, 2025',
      plan: 'Premium',
    },
    {
      user: { name: 'John Smith', email: 'p13231233@gmail.com' },
      subscribed_to: 'Chef Mario',
      status: 'Active',
      join_date: 'Jan 15, 2025',
      plan: 'Premium',
    },
    {
      user: { name: 'John Smith', email: 'p13231233@gmail.com' },
      subscribed_to: 'Chef Mario',
      status: 'Active',
      join_date: 'Jan 15, 2025',
      plan: 'Basic',
    },
    {
      user: { name: 'John Smith', email: 'p13231233@gmail.com' },
      subscribed_to: 'Chef Mario',
      status: 'Active',
      join_date: 'Jan 15, 2025',
      plan: 'Premium',
    },
    {
      user: { name: 'John Smith', email: 'p13231233@gmail.com' },
      subscribed_to: 'Chef Mario',
      status: 'Active',
      join_date: 'Jan 15, 2025',
      plan: 'Premium',
    },
    {
      user: { name: 'John Smith', email: 'p13231233@gmail.com' },
      subscribed_to: 'Chef Mario',
      status: 'Active',
      join_date: 'Jan 15, 2025',
      plan: 'Basic',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const openModal = (index) => {
    setUserToDelete(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  const handleDelete = () => {
    setUserData(userData.filter((_, i) => i !== userToDelete));
    closeModal();
  };

  return (
    <div>
      <div className="px-10 py-6 lora">
        <h2 className="text-[34px] font-semibold text-[#5B21BD] mb-1">All users</h2>
        <p className="text-xl text-gray-500 mb-8">Manage end users and their subscriptions</p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#CCBAEB] text-gray-700">
              <th className="py-2 px-4 text-left">User</th>
              <th className="py-2 px-4 text-left">Subscribed To</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Join Date</th>
              <th className="py-2 px-4 text-left">Plan</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((row, index) => (
              <tr key={index} className="border-b border-[#CCBAEB]">
                <td className="py-2 px-4 flex items-center">
                  <img
                    src="https://i.ibb.co.com/60hvPZRS/bannerimg-01.png"
                    alt="User profile"
                    className="w-8 h-8 rounded-full mr-2 object-cover"
                  />
                  <div>
                    <div className="font-semibold capitalize">{row.user.name}</div>
                    <div className="text-gray-500 text-sm">{row.user.email}</div>
                  </div>
                </td>
                <td className="py-2 px-4 capitalize">{row.subscribed_to}</td>
                <td className="py-2 px-4">
                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    {row.status}
                  </span>
                </td>
                <td className="py-2 px-4">{row.join_date}</td>
                <td className="py-2 px-4">
                  <span
                    className={`inline-block px-2 py-1 rounded text-sm ${
                      row.plan === 'Premium' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {row.plan}
                  </span>
                </td>
                <td className="py-2 px-4 text-gray-500">
                  <RiDeleteBin6Line
                    className="text-[#FF0000] border border-[#B0D5E8] rounded-[10px] flex justify-center items-center size-10 p-2 cursor-pointer"
                    onClick={() => openModal(index)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex justify-center items-center z-100">
          <div className="bg-white rounded-lg p-6 w-[400px]">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardUser;