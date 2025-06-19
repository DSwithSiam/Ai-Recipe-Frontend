




import { useEffect, useRef, useState } from 'react';
import { CiFilter } from 'react-icons/ci';
import { HiDotsHorizontal } from 'react-icons/hi';
import { IoMdAdd } from 'react-icons/io';
import { IoSearchOutline } from 'react-icons/io5';
import { Link, NavLink, } from 'react-router-dom';
import { useDeleteChefRecipeMutation, useGetCategoryListQuery, useGetCreateRecipeQuery, } from '../../../Rudux/feature/ApiSlice';
import toast, { Toaster } from 'react-hot-toast';


function ChefAllRecipes() {


  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRefs = useRef({});
  const filterRef = useRef(null);

  // Fetch recipes using the RTK Query hook
  const { data: recipesData, isLoading, isError, error  } = useGetCreateRecipeQuery();
 
  console.log("asdfsfdf", recipesData);
  
  const [deleteChefRecipe, { isLoading: isDeleting }] = useDeleteChefRecipeMutation();
  const { data: categoryList, } = useGetCategoryListQuery();
  console.log("categoryList", categoryList);




  // Set recipes when data is fetched
  useEffect(() => {
    if (recipesData) {
      const dataArray = Array.isArray(recipesData)
        ? recipesData
        : recipesData?.data || [];
      setRecipes(dataArray);
      setFilteredRecipes(dataArray);
    }
  }, [recipesData]);

  // Extract unique categories from recipes
  const categories = recipes.length > 0
    ? ['All', ...new Set(recipes.map((recipe) => recipe.category))]
    : ['All'];

  // Handle search functionality
  const handleSearch = (query) => {
    const filtered = recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRecipes(filtered);
  };

  // Update search query and trigger search
  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  // Handle click outside to close dropdowns and filter
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !Object.values(dropdownRefs.current).some((ref) => ref && ref.contains(event.target))
      ) {
        setOpenDropdownId(null);
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);




  const handleDelete = async (id) => {
    try {
      await deleteChefRecipe(id).unwrap();
      // Optimistically update the local state
      const updatedRecipes = recipes.filter((recipe) => recipe.id !== id);
      setRecipes(updatedRecipes);
      const filtered = updatedRecipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRecipes(filtered);
      setOpenDropdownId(null);

      // Show success toast
      toast.success('Recipe deleted successfully!');
    } catch (err) {
      console.error('Failed to delete recipe:', err);
      toast.error('Failed to delete recipe. Please try again.');
    }
  };

  // Handle category filter
  const handleFilter = (category) => {
    let filtered = recipes;
    if (category !== 'All') {
      filtered = recipes.filter((recipe) => recipe.category === category);
    }
    filtered = filtered.filter((recipe) =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRecipes(filtered);
    setIsFilterOpen(false);
  };

  // Render loading or error states
  if (isLoading) {
    return <div className="text-center py-10">Loading recipes...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Error fetching recipes: {error?.message || 'Something went wrong'}
      </div>
    );
  }

  return (
    <div>
      <div className="md:px-10 py-6 lora">
        <div className="flex items-center justify-between px-2">
          <div className="md:w-1/2">
            <h1 className="text-[#5B21BD] text-[34px] font-semibold">All Recipes</h1>
            <p className="text-[#A2A2A2] text-[20px]">Manage your recipes and AI training data</p>
          </div>
          <div className="relative flex gap-6 md:w-2/5" ref={filterRef}>
            <div className="flex items-center relative w-full">
              <IoSearchOutline className="text-[#5B21BD] absolute ml-3 opacity-100 transition-opacity duration-200" />


              <input
                type="search"
                placeholder="Search recipes"
                className="placeholder-[color:#5B21BD] focus:placeholder-[#5B21BD] w-full py-3 border border-[#5B21BD] rounded-full pl-8"
                value={searchQuery}
                onChange={handleSearchInput}

              />




            </div>




            <button
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className="text-[#5B21BD] border border-[#5B21BD] py-2 px-6 rounded-full flex items-center gap-2 cursor-pointer"
            >
              <CiFilter />
              <span>Filter</span>
            </button>
            {isFilterOpen && (
              <ul className="absolute right-0 z-50 mt-2 w-40 origin-top-right top-12 rounded-md border border-[#5B21BD] bg-gray-200 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none menu menu-sm p-2">
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => handleFilter(category)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-300 cursor-pointer"
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Card section */}
        <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 justify-between gap-6 pt-6">
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="w-full shadow rounded-xl overflow-hidden">
              <div className="relative">
                <img
                  className="w-full h-48 object-cover"
                  src={`https://bmn1212.duckdns.org${recipe.image}`}
                  alt={recipe.title}
                />
              </div>
              <div className="p-4 rounded-b-xl space-y-2">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-[#5B21BD] lora capitalize">{recipe.title}</h2>
                  
                  <div
                    className="relative inline-block text-left"
                    ref={(el) => (dropdownRefs.current[recipe.id] = el)}
                  >
                    <button
                      onClick={() =>
                        setOpenDropdownId((prevId) =>
                          prevId === recipe.id ? null : recipe.id
                        )
                      }
                      className="btn btn-ghost btn-circle"
                      disabled={isDeleting}
                    >
                      <HiDotsHorizontal className="text-[#5B21BD] w-[16px] h-[16px] cursor-pointer" />
                    </button>
                    {openDropdownId === recipe.id && (
                      <ul className="absolute right-0 z-50 mt-2 w-30 origin-top-right rounded-md border border-[#5B21BD] bg-gray-200 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none menu menu-sm p-2">

                        <div className='flex flex-col  items-center'>
                          <NavLink
                            to={{
                              pathname: `/chef_dashboard/chef_recipese_edit_page/${recipe.id}`,
                              state: { recipe },
                            }}
                            className="cursor-pointer w-full"
                          >
                            Edit
                          </NavLink>





                          <button
                            onClick={() => handleDelete(recipe.id)}
                            className="cursor-pointer w-full text-start"
                            disabled={isDeleting}
                          >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>

                      </ul>
                    )}
                  </div>
                </div>
                <div className="flex gap-4 py-2">
                  <p className="text-sm text-white bg-[#5B21BD] inline-block px-2 py-1 rounded-[29px] capitalize">
                    {recipe.category}
                  </p>

                  <Link className="text-white text-sm bg-[#91E2CE] px-2 py-1 rounded-full">
                    Published
                  </Link>
                  <Link
                  to="/chef_dashboard/ai_training"
                  className="text-white text-sm bg-[#CCBAEB] px-2 py-1 rounded-full">
                    AI train
                  </Link>
                </div>
                <p className="mt-2 text-[#676767]  text-[16px]">{recipe?.description}</p>
                <div className="mt-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <span className="ml-1 text-gray-600">{recipe.rating}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Updated: {new Date(recipe.created_at).toLocaleString([], {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <Link
            to="/chef_dashboard/chef_recipese_addd_page"
            className="shadow h-full rounded-xl p-2 text-white flex justify-center items-center cursor-pointer"
          >
            <div className="space-y-4 py-4">
              <div className="bg-[#5B21BD] rounded-full flex justify-center items-center mx-auto w-[50px] h-[50px]">
                <span className="text-[25px]">
                  <IoMdAdd />
                </span>
              </div>
              <p className="text-[#5B21BD] text-center">Add New Recipe</p>
              <button className="flex bg-[#5B21BD] py-1 px-3 rounded-full items-center gap-2 cursor-pointer">
                Add New Recipe <IoMdAdd />
              </button>
            </div>
          </Link>
        </div>
      </div>
      <Toaster position='top-right' />
    </div>
  );
}

export default ChefAllRecipes;




