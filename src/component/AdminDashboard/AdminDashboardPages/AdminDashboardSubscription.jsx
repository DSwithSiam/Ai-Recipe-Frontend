



import React, { useState } from 'react';
import { CiFilter } from 'react-icons/ci';
import { RiDeleteBin6Line } from 'react-icons/ri';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function AdminDashboardSubscription() {
  const [tableData, setTableData] = useState([
    {
      id: 1,
      User: 'John Smith',
      email: 'john.smith@example.com',
      img: 'https://i.ibb.co.com/60hvPZRS/bannerimg-01.png',
      Plan: 'Pro',
      Status: 'Active',
      Chef: 'Chef-Alpha',
      'Start Date': 'Jan 16, 2025',
      'Next Billing': 'Jan 16, 2026',
    },
    {
      id: 2,
      User: 'John Smith',
      email: 'john.smith2@example.com',
      img: 'https://i.ibb.co.com/60hvPZRS/bannerimg-01.png',
      Plan: 'Basic',
      Status: 'Inactive',
      Chef: 'Chef-Beta',
      'Start Date': 'Jan 16, 2025',
      'Next Billing': 'Jan 16, 2026',
    },
    {
      id: 3,
      User: 'John Smith',
      email: 'john.smith3@example.com',
      img: 'https://i.ibb.co.com/60hvPZRS/bannerimg-01.png',
      Plan: 'Enterprise',
      Status: 'Active',
      Chef: 'Chef-Gamma',
      'Start Date': 'Jan 16, 2025',
      'Next Billing': 'Jan 16, 2026',
    },
    {
      id: 4,
      User: 'John Smith',
      email: 'john.smith4@example.com',
      img: 'https://i.ibb.co.com/60hvPZRS/bannerimg-01.png',
      Plan: 'Pro',
      Status: 'Inactive',
      Chef: 'Chef-Delta',
      'Start Date': 'Jan 16, 2025',
      'Next Billing': 'Jan 16, 2026',
    },
    {
      id: 5,
      User: 'John Smith',
      email: 'john.smith5@example.com',
      img: 'https://i.ibb.co.com/60hvPZRS/bannerimg-01.png',
      Plan: 'Basic',
      Status: 'Active',
      Chef: 'Chef-Epsilon',
      'Start Date': 'Jan 16, 2025',
      'Next Billing': 'Jan 16, 2026',
    },
    {
      id: 6,
      User: 'John Smith',
      email: 'john.smith6@example.com',
      img: 'https://i.ibb.co.com/60hvPZRS/bannerimg-01.png',
      Plan: 'Enterprise',
      Status: 'Inactive',
      Chef: 'Chef-Zeta',
      'Start Date': 'Jan 16, 2025',
      'Next Billing': 'Jan 16, 2026',
    },
    {
      id: 7,
      User: 'John Smith',
      email: 'john.smith7@example.com',
      img: 'https://i.ibb.co.com/60hvPZRS/bannerimg-01.png',
      Plan: 'Pro',
      Status: 'Active',
      Chef: 'Chef-Eta',
      'Start Date': 'Jan 16, 2025',
      'Next Billing': 'Jan 16, 2026',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isPlanDropdownOpen, setIsPlanDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isChefDropdownOpen, setIsChefDropdownOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedChef, setSelectedChef] = useState('All');

  // Get unique plan, status, and chef values from tableData
  const planOptions = ['All', ...new Set(tableData.map((row) => row.Plan))];
  const statusOptions = ['All', ...new Set(tableData.map((row) => row.Status))];
  const chefOptions = ['All', ...new Set(tableData.map((row) => row.Chef))];

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setTableData(tableData.filter((row) => row.id !== selectedId));
    setIsModalOpen(false);
    setSelectedId(null);
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setSelectedId(null);
  };

  // Toggle dropdowns
  const togglePlanDropdown = () => {
    setIsPlanDropdownOpen(!isPlanDropdownOpen);
    setIsStatusDropdownOpen(false);
    setIsChefDropdownOpen(false);
  };

  const toggleStatusDropdown = () => {
    setIsStatusDropdownOpen(!isStatusDropdownOpen);
    setIsPlanDropdownOpen(false);
    setIsChefDropdownOpen(false);
  };

  const toggleChefDropdown = () => {
    setIsChefDropdownOpen(!isChefDropdownOpen);
    setIsPlanDropdownOpen(false);
    setIsStatusDropdownOpen(false);
  };

  // Handle selections
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setIsPlanDropdownOpen(false);
  };

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setIsStatusDropdownOpen(false);
  };

  const handleChefSelect = (chef) => {
    setSelectedChef(chef);
    setIsChefDropdownOpen(false);
  };

  // Filter table data based on selected plan, status, and chef
  const filteredData = tableData.filter((row) => {
    return (
      (selectedPlan === 'All' || row.Plan === selectedPlan) &&
      (selectedStatus === 'All' || row.Status === selectedStatus) &&
      (selectedChef === 'All' || row.Chef === selectedChef)
    );
  });

  // Export data to Excel
  const handleExportData = () => {
    const exportData = filteredData.map(({ id, img, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Subscriptions');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'subscriptions.xlsx');
  };

  return (
    <div className="px-10 py-6 lora">
      <div className="flex md:gap-8 items-center justify-between">
        <div>
          <h2 className="text-[34px] font-semibold text-[#5B21BD] mb-1">
            Subscription Management
          </h2>
          <p className="text-xl text-gray-500 mb-8">
            View and manage user subscriptions.
          </p>
        </div>
        <div className="relative flex gap-4">
          <div className="relative">
            <button
              onClick={togglePlanDropdown}
              className="text-[#5B21BD] border border-[#5B21BD] py-2 px-6 rounded-full flex items-center gap-2 cursor-pointer"
              aria-label="Filter by plan"
            >
              <CiFilter />
              <span>Filter by plan</span>
            </button>
            {isPlanDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-[#0077B6] rounded-md shadow-lg z-10">
                {planOptions.map((plan) => (
                  <button
                    key={plan}
                    onClick={() => handlePlanSelect(plan)}
                    className="block w-full text-left px-4 py-2 text-sm text-[#5B21BD] hover:bg-gray-100 rounded-2xl"
                    aria-label={`Select plan ${plan}`}
                  >
                    {plan}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={toggleStatusDropdown}
              className="text-[#5B21BD] border border-[#5B21BD] py-2 px-6 rounded-full flex items-center gap-2 cursor-pointer"
              aria-label="Filter by status"
            >
              <CiFilter />
              <span>Filter by status</span>
            </button>
            {isStatusDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-[#0077B6] rounded-md shadow-lg z-10">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusSelect(status)}
                    className="block w-full text-left px-4 py-2 text-sm text-[#5B21BD] hover:bg-gray-100 rounded-2xl"
                    aria-label={`Select status ${status}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={toggleChefDropdown}
              className="text-[#5B21BD] border border-[#5B21BD] py-2 px-6 rounded-full flex items-center gap-2 cursor-pointer"
              aria-label="Filter by chef"
            >
              <CiFilter />
              <span>Filter by chef</span>
            </button>
            {isChefDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-[#0077B6] rounded-md shadow-lg z-10">
                {chefOptions.map((chef) => (
                  <button
                    key={chef}
                    onClick={() => handleChefSelect(chef)}
                    className="block w-full text-left px-4 py-2 text-sm text-[#5B21BD] hover:bg-gray-100 rounded-2xl"
                    aria-label={`Select chef ${chef}`}
                  >
                    {chef}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* <button
            onClick={handleExportData}
            className="text-[#5B21BD] border border-[#5B21BD] py-2 px-6 rounded-full cursor-pointer"
            aria-label="Export data to Excel"
          >
            Export Data
          </button> */}
        </div>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#CCBAEB] text-left">
            <th className="p-3 pl-10 font-semibold">User</th>
            <th className="p-3 font-semibold">Plan</th>
            <th className="p-3 font-semibold">Status</th>
            <th className="p-3 font-semibold">Chef</th>
            <th className="p-3 font-semibold">Start Date</th>
            <th className="p-3 font-semibold">Next Billing</th>
            <th className="p-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row) => (
            <tr key={row.id} className="border-b border-[#CCBAEB]">
              <td className="p-3 flex items-center">
                <div className="flex">
                  <div className="w-8 h-8 rounded-full">
                    <img
                      src={row.img}
                      alt={row.User}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.src = '/fallback-image.png')} // Add a fallback image
                    />
                  </div>
                  <div className="ml-3">
                    <p className="capitalize">{row.User}</p>
                    <p>{row.email}</p>
                  </div>
                </div>
              </td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    row.Plan === 'Pro'
                      ? 'bg-blue-200 text-blue-800'
                      : row.Plan === 'Basic'
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-purple-200 text-purple-800'
                  }`}
                >
                  {row.Plan}
                </span>
              </td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    row.Status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : row.Status === 'Inactive'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {row.Status}
                </span>
              </td>
              <td className="p-3">
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold capitalize">
                  {row.Chef}
                </span>
              </td>
              <td className="p-3">{row['Start Date']}</td>
              <td className="p-3">{row['Next Billing']}</td>
              <td className="p-3">
                <button
                  onClick={() => handleDeleteClick(row.id)}
                  aria-label={`Delete subscription for ${row.User}`}
                >
                  <RiDeleteBin6Line className="text-[#FF0000] border border-[#CCBAEB] rounded-[10px] flex justify-center items-center size-10 p-2 cursor-pointer" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this subscription? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                aria-label="Cancel deletion"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                aria-label="Confirm deletion"
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

export default AdminDashboardSubscription;