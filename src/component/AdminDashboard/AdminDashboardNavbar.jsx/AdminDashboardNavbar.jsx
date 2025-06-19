
import { GoBellFill } from 'react-icons/go';
import { NavLink,  } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useGetProfileQuery, useUpdateProfileMutation } from '../../../Rudux/feature/ApiSlice';
import { FaUserTie } from 'react-icons/fa';

function AdminDashboardNavbar() {
  const { data: profileList, refetch } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const user = profileList?.user || {};

  const [username, setUsername] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    setUsername(user?.username || '');
  }, [user]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    if (image) {
      formData.append('image', image);
    }

    try {
      await updateProfile(formData).unwrap();
      refetch();
      alert('Profile updated successfully');
    } catch (err) {
      console.error('Profile update failed:', err);
    }
  };

  return (
    <div className="flex items-center justify-between pt-10 lora h-16 px-6 md:max-w-[170vh] mx-auto md:ml-[260px] md:w-[calc(100%-240px)]">
      {/* Left section (notification) */}
      <div className="flex justify-end space-x-8 w-full">
        <NavLink to="/dashboard/user_notifications">
          <div className="relative">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-transform duration-200 cursor-pointer">
              <GoBellFill className="h-7 w-7 text-[#5B21BD]" />
            </button>
            <div className="absolute text-[10px] p-[5px] top-[6px] right-[10px] bg-gray-200 rounded-full"></div>
          </div>
        </NavLink>




        <div className="flex items-center gap-2">
          <span className="text-[17px] font-medium text-gray-400 hidden md:block">
            {user?.first_name || 'Admin'}
          </span>
          {user?.image ? (
            <img
              src={`https://bmn1212.duckdns.org${user.image}`}
              alt="User profile"
              className="h-10 w-10 rounded-full cursor-pointer"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer">
              <FaUserTie className="text-xl text-gray-600" />
            </div>
          )}
        </div>

      </div>

      {/* Right section (profile + form) */}

    </div>
  );
}

export default AdminDashboardNavbar;


