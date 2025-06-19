import { useState, useEffect } from "react";
import { GoBellFill } from "react-icons/go";
import { IoMdAdd } from "react-icons/io";
import { PiChefHatFill } from "react-icons/pi";
import { Link, NavLink } from "react-router-dom";
import { useGetAllBrandsQuery, useGetProfileQuery } from "../../../Rudux/feature/ApiSlice";

// import { setBrandId } from "../../../Rudux/feature/BrandSlice";
import { useDispatch } from "react-redux";
import { FaUserTie } from "react-icons/fa";

const UserDashboardNavbar = () => {
	const dispatch = useDispatch();
	const [userImageUrl, setUserImageUrl] = useState(
		"https://i.ibb.co.com/x2wkVkr/Whats-App-Image-2024-07-04-at-10-43-40-AM.jpg"
	);
	const { data: profileList } = useGetProfileQuery();
	console.log("profileList", profileList);
	const { data: getAllBrands } = useGetAllBrandsQuery();
	// console.log("Profile List:", profileList);
	const userData = profileList?.user || {};
	// console.log(userData, "dasdfsdf")
	const brands = getAllBrands?.data || [];
	// console.log("Brands:", brands);
	const [userName, setUserName] = useState("");

	useEffect(() => {
		if (profileList?.user) {
			setUserName(profileList?.user?.first_name
 || "");
			setUserImageUrl(
				profileList.user.image
					? `https://bmn1212.duckdns.org${profileList.user.image}`
					: ""
			);
		}
	}, [profileList]);

	const [showAddChefModal, setShowAddChefModal] = useState(false);
	const toggleAddChefModal = () => {
		setShowAddChefModal((prev) => !prev);
	};

	// const selectedBrandId = useSelector((state) => state.brand.selectedBrandId);

	const handleBrandChange = (e) => {
		const brandId = e.target.value || null; // Set to null if no brand is selected
		dispatch(setBrandId(brandId));
	};

	return (
		<div className="flex items-center justify-end pt-10 lora h-16 px-6 bg-white md:max-w-[170vh] mx-auto md:ml-[260px] md:w-[calc(100%-240px)]">
			<div className="flex items-center space-x-8">
				<div className="hidden md:flex gap-10">
					<Link
						to="/"
						onClick={toggleAddChefModal}
						className="flex items-center gap-2 px-4 py-2 text-white bg-[#5B21BD] rounded-[10px] cursor-pointer"
					>
						<PiChefHatFill />
						<span className="font-medium">Add Chefs</span>
						<IoMdAdd />
					</Link>

				
				</div>

				<NavLink to="/dashboard/user_notifications">
					<div className="relative">
						<button className="p-2 rounded-full hover:bg-gray-100 transition-transform duration-200 cursor-pointer">
							<GoBellFill className="h-7 w-7 text-[#5B21BD]" />
						</button>
						<div className="absolute text-[10px] p-[5px] top-[6px] right-[10px] bg-gray-200 rounded-full"></div>
					</div>
				</NavLink>

				<div className="flex items-center space-x-4">

					{/* Username */}
					{userName && (
						<span className="text-[17px] font-medium text-black">
							{userName}
						</span>
					)}
					{/* Image or fallback icon */}
					{userImageUrl ? (
						<img
							src={userImageUrl}
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
		</div>
	);
};

export default UserDashboardNavbar;





