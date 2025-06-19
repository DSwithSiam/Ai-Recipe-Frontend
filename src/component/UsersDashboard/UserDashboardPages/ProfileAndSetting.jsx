import { useEffect, useState } from "react";
import { MdOutlineCameraAlt } from "react-icons/md";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../../../Rudux/feature/ApiSlice";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";

function ProfileAndSetting() {
  const { data: profileList, isLoading: isProfileLoading } = useGetProfileQuery();
  console.log("profileList", profileList);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    photo: "https://i.ibb.co/jVcFCQf/businessman-icon-600nw-564112600.webp",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: formData, // Initialize with formData
  });

  // Update formData and reset form when profileList changes
  useEffect(() => {
    if (profileList?.user) {
      const newFormData = {
        firstName: profileList.user.first_name || "",
        lastName: profileList.user.last_name || "",
        email: profileList.user.email || "",
        phone: profileList.user.phone || "",
        photo: profileList.user.image
          ? `https://bmn1212.duckdns.org${profileList.user.image}`
          : "https://i.ibb.co/jVcFCQf/businessman-icon-600nw-564112600.webp",
      };
      setFormData(newFormData);
      reset(newFormData); // Reset form with new data
    }
  }, [profileList, reset]);

  const [submitUpdate, { isLoading: isSubmitting }] = useUpdateProfileMutation();

  const onSubmit = async (data) => {
    try {
      console.log(data);
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("first_name", data.firstName);
      formDataToSubmit.append("last_name", data.lastName);
      formDataToSubmit.append("email", data.email);
      formDataToSubmit.append("phone", data.phone);
      if (data.photo[0] instanceof File) {
        formDataToSubmit.append("image", data.photo[0]);
      }

      const response = await submitUpdate(formDataToSubmit).unwrap();
      toast.success(response?.detail || "Profile updated successfully!");
    } catch (err) {
      console.error("Error submitting form data:", err);
      toast.error("Failed to update profile.");
    }
  };

  // Optionally, show a loading state while profile data is being fetched
  if (isProfileLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="px-10 py-4 lora">
      <h1 className="text-[#5B21BD] text-[45px] font-semibold">
        Profile information
      </h1>
      <p className="text-[#A2A2A2] text-[20px] capitalize">
        Update your information and public details
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6 w-full">
          <div className="flex justify-center mb-4">
            <img
              src={formData.photo}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2"
            />
          </div>

          <div className="flex justify-center mb-4">
            <label className="text-[#5B21BD] border border-[#5B21BD] p-2 rounded-[10px] cursor-pointer flex items-center">
              <span className="mr-2 text-[20px]">Change Photo</span>
              <MdOutlineCameraAlt />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                {...register("photo")}
              />
            </label>
          </div>

          <div className="py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-4 text-[20px]">
              <div>
                <label className="block text-sm font-medium text-[#5B21BD] text-[20px]">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your first name"
                  className="mt-1 p-2 w-full rounded-md focus:outline-none border border-[#5B21BD] bg-[#FFFFFF]"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block font-medium text-[#5B21BD] text-[20px]">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your last name"
                  className="mt-1 p-2 w-full rounded-md focus:outline-none border border-[#5B21BD] bg-[#FFFFFF]"
                  {...register("lastName", {
                    required: "Last Name is required",
                  })}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-4">
              <div>
                <label className="block text-[#5B21BD] text-[20px] font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  readOnly
                  className="mt-1 p-2 w-full rounded-md focus:outline-none border border-[#5B21BD] bg-[#FFFFFF]"
                  {...register("email", {
                    required: "Email is required",
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-[#5B21BD] text-[20px] font-medium">
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="Enter here"
                  className="mt-1 p-2 w-full rounded-md focus:outline-none border border-[#5B21BD] bg-[#FFFFFF]"
                  {...register("phone", {
                    required: "Phone is required",
                  })}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-[#5B21BD] text-white rounded-lg px-6 py-2 mt-4 text-lg font-semibold transition-opacity cursor-pointer ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-[#4A1A9C]"
              }`}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>

      <Toaster position="top-right" />
    </div>
  );
}

export default ProfileAndSetting;