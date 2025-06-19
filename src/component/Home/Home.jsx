import { CiFilter } from 'react-icons/ci';
import landingPageIcon from '../../assets/image/Admin_login_img.png';
import { IoSearchOutline } from 'react-icons/io5';
import { useState, useEffect, useRef, useMemo } from 'react';
import PreviewGallary from './PreviewGallary';
import Expertice from './Expertice';
import { useGetManiChefBrandListByIdQuery, useGetManiChefBrandListQuery, } from '../../Rudux/feature/ApiSlice';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChef, setSelectedChef] = useState({});
  const [activeButton, setActiveButton] = useState('about');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSubTitle, setSelectedSubTitle] = useState('');
  const [currentBrandId, setCurrentBrandId] = useState(null);
  const filterRef = useRef(null);

  const navigate = useNavigate();

  const { data: getManiChefBrandList, isLoading, error } = useGetManiChefBrandListQuery();
  const { data: idOfItems } = useGetManiChefBrandListByIdQuery(currentBrandId);
  console.log("idOfItems", idOfItems)
  // const { data: getMainSubscription } = useGetMainSubscriptionQuery(idOfItems?.about?.chef_id);
  // console.log("getMainSubscription", getMainSubscription)



  // Compute unique taglines for filter dropdown
  const uniqueSubTitles = useMemo(() => {
    if (!getManiChefBrandList) return [];
    const taglines = getManiChefBrandList.map(item => item.tagline || "Chef's Branding");
    return [...new Set(taglines)]; // Get unique taglines
  }, [getManiChefBrandList]);

  // Filter data based on search query and selected tagline
  const filteredData = useMemo(() => {
    if (!getManiChefBrandList) return [];
    return getManiChefBrandList.filter(item => {
      const matchesSearch =
        (item.brand_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (item.tagline?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (item.about?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      const matchesFilter = !selectedSubTitle || item.tagline === selectedSubTitle;
      return matchesSearch && matchesFilter;
    });
  }, [getManiChefBrandList, searchQuery, selectedSubTitle]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value.trim();
    setSearchQuery(query);
  };

  // Toggle filter dropdown
  const toggleFilterDropdown = () => {
    setIsFilterOpen((prev) => !prev);
  };

  // Handle subtitle selection
  const handleSubTitleSelect = (subTitle) => {
    setSelectedSubTitle(subTitle);
    setIsFilterOpen(false);
  };

  // for route handle
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/signin");
    }
  }, [navigate]);
  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // Other functions (openModalWithChef, closeModal, handleButtonClick) remain unchanged
  const openModalWithChef = (chef) => {
    setCurrentBrandId(chef?.id);
    setSelectedChef(chef);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedChef(null);
    setActiveButton('about');
  };

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  return (
    <div className='bg-[#E6EBE8] min-h-screen py-10 lora'>
      <div>
        <div className='flex justify-center mb-4'>
          <img src={landingPageIcon} alt="Culinary Experts Logo" className='w-[200px] h-[150px]' />
        </div>
        <h1 className='text-[60px] font-semibold text-[#5B21BD] text-center'>Choose Your Culinary Expert</h1>
        <p className='text-[20px] text-[#8F8F8F] text-center pb-8 pt-4'>
          Select a chef whose expertise aligns with your culinary interests. You'll get access <br />
          to their exclusive recipes, techniques, and personalized AI assistance.
        </p>

        <div className='flex justify-center gap-2 relative'>
          <div className='absolute top-4 right-2/3 mr-6'>
            <IoSearchOutline className='text-[#5B21BD]' />
          </div>
          <input
            type="search"
            className='placeholder:text-[#5B21BD] w-1/3 border border-[#5B21BD80] py-2 rounded-full pl-10'
            placeholder='Search by name, specialty, or keyword'
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ WebkitAppearance: 'none' }}
          />
          <div className='relative' ref={filterRef}>
            <button
              className='text-[#5B21BD] border border-[#5B21BD80] py-2 px-6 rounded-full flex items-center gap-2 cursor-pointer'
              onClick={toggleFilterDropdown}
            >
              <CiFilter />
              <span>filter</span>
            </button>
            {isFilterOpen && (
              <div className='absolute right-0 mt-2 w-48 bg-white border border-[#5B21BD80] rounded-lg shadow-lg z-10'>
                <ul className='py-1'>
                  <li
                    className='px-4 py-2 text-[#5B21BD] hover:bg-[#E6EBE8] cursor-pointer'
                    onClick={() => handleSubTitleSelect('')}
                  >
                    All
                  </li>
                  {uniqueSubTitles.map((subTitle) => (
                    <li
                      key={subTitle}
                      className='px-4 py-2 text-[#5B21BD] hover:bg-[#E6EBE8] cursor-pointer'
                      onClick={() => handleSubTitleSelect(subTitle)}
                    >
                      {subTitle}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 p-10">
        {isLoading ? (
          <p className="text-center text-[#515151] text-lg p-10">Loading culinary experts...</p>
        ) : error ? (
          <p className="text-center text-[#515151] text-lg p-10">Error loading data: {error.message || 'Something went wrong'}</p>
        ) : filteredData.length === 0 ? (
          <p className="text-center text-[#515151] text-lg p-10">No culinary experts found.</p>
        ) : (
          filteredData.map((item) => (
            <div
              key={item.brand_id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative lora"
            >
               {item.is_active && (
    <div className="absolute top-4 right-4 z-10">
      <button className="bg-green-400 text-white text-sm font-semibold px-4 py-1 rounded-full shadow">
        Subscribe
      </button>
    </div>
  )}
              <div className="h-52 relative">
                <img
                  src={
                    item.logo
                      ? `https://bmn1212.duckdns.org${item.logo}`
                      : landingPageIcon
                  }
                  alt={item.brand_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <img
                    className="w-10 h-10 bg-gray-300 rounded-full z-50"
                    src={`https://bmn1212.duckdns.org${item?.chef_image}`}
                    alt="chef_image"
                  />
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-[24px] font-semibold text-[#5B21BD] capitalize">
                    {item.brand_name}
                  </h2>
                </div>
                <h3 className="text-lg font-medium text-[#515151] mb-3 capitalize">
                  {item.tagline || "Chef's Branding"}
                </h3>
                <p className="text-gray-600 mb-4">{item.description || 'No description available'}</p>
                <div className="flex justify-between">
                  <div className="flex items-center px-2 py-1 rounded">
                    <svg
                      className="w-4 h-4 ml-1 text-[#FACC15]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-[#676767] font-medium ml-1">
                      {parseInt(item.rating, 10)}
                    </span>
                  </div>
                  <button
                    className="px-4 py-2 text-[#5B21BD] text-[18px] font-medium rounded cursor-pointer"
                    onClick={() =>
                      openModalWithChef({
                        id: item.brand_id,
                        title: item.brand_name,
                        category: item.tagline || "Chef's Branding",
                        description: item.description
                          || 'No description available',
                        rating: item.rating,
                        logo_image: item.logo,
                        image: item.chef_image,
                        chefId: item.chef_id || "",
                      })
                    }
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal remains unchanged */}
      {isModalOpen && selectedChef && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#5B21BDCC] bg-opacity-50 z-50 overflow-y-auto py-10">
          <div className="bg-white rounded-lg p-6 w-11/12 md:w-3/4

 lg:w-1/2 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-[#5B21BD] capitalize">{selectedChef.title}</h2>
                <p className='text-[#515151] capitalize'> {selectedChef.category}</p>
              </div>
              <button
                className="px-6 py-2 bg-[#5B21BD] text-white font-medium rounded hover:bg-[#5B21BD] transition-colors"
                onClick={closeModal}
              >
                Back
              </button>
            </div>

            <div className="flex-1 overflow-y-auto relative">
              <div className="h-[300px] relative">
                <img
                  src={`https://bmn1212.duckdns.org${selectedChef.logo_image}`}
                  alt="logo_image"
                  className="w-full h-full rounded-lg object-cover"
                />
                <div className='bottom-4 left-6 absolute'>
                  {selectedChef.image ? (
                    <img
                      src={`https://bmn1212.duckdns.org${selectedChef.image}`}
                      alt="chef_image"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-xs text-gray-600">{selectedChef.logo_image.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className='flex justify-between gap-4 py-4'>
                <div className='bg-[#EFE9F8] px-4 py-2 w-full rounded-[10px] text-center'>Recipes: {idOfItems?.recipe_data?.length || "length not found"}</div>
                <div className='bg-[#EFE9F8] px-4 py-2 w-full rounded-[10px] text-center'>Students: {idOfItems?.about?.student_count}</div>
                <div className="flex items-center justify-center bg-[#EFE9F8] px-4 py-2 w-full rounded-[10px] text-center">
                  <svg className="w-5 h-5 text-[#FACC15]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="mr-1 text-[#676767] font-medium">{parseInt(selectedChef.rating, 10)}</span>
                </div>
              </div>

              <div className="bg-[#EFE9F8] rounded-[10px] py-2 flex gap-6 justify-between px-4 sm:px-10 mt-4">
                <button
                  className={`w-1/3 py-2 rounded-[10px] transition-colors ${activeButton === 'about'
                    ? 'bg-[#5B21BD] text-white'
                    : 'text-[#5B21BD] hover:bg-[#5B21BD20]'
                    }`}
                  onClick={() => handleButtonClick('about')}
                >
                  About
                </button>
                <button
                  className={`w-1/3 py-2 rounded-[10px] transition-colors ${activeButton === 'preview'
                    ? 'bg-[#5B21BD] text-white'
                    : 'text-[#5B21BD] hover:bg-[#5B21BD20]'
                    }`}
                  onClick={() => handleButtonClick('preview')}
                >
                  Preview gallery
                </button>
              </div>

              <div className="relative mt-2">
                {activeButton === 'about' ? (
                  <>
                    <p className='text-[26px] font-semibold text-[#5B21BD] mb-2 capitalize'>About chef {selectedChef.title} </p>
                    <p className='text-gray-500 '>{selectedChef?.description
                    } </p>

                    <Expertice expertise={idOfItems?.about?.expertice} chefId={idOfItems?.about?.chef_id} />
                    {/* <p className="text-gray-600 mt-4">{selectedChef.description}</p> */}
                  </>
                ) : (
                  <PreviewGallary recipeData={idOfItems?.recipe_data} chefId={idOfItems?.about?.chef_id} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;








